import { amountToCurrency } from '@/utils/amountToCurrency'
import { formatDate } from '@/utils/dateHelpers'
import { EXPENSE_CATEGORIES } from '@/utils/expenseCategories'
import {
  buildCategoryStats,
  buildMonthlyBuckets,
  monthLabel,
  sortExpenses
} from '@/utils/expenseStats'

const LOGO_URL = '/images/LOGO02.png'
const PAGE_MARGIN = 14

// eslint-disable-next-line no-misleading-character-class
const EMOJI_PATTERN = /[\u{1F000}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{FE0E}\u{FE0F}\u{200D}\u{20E3}\u{20D0}-\u{20FF}]/gu

function sanitizePdfText (value) {
  return String(value == null ? '' : value)
    .replace(EMOJI_PATTERN, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function pad (number) {
  return String(number).padStart(2, '0')
}

function exportDateStamp (date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`
}

function exportDateLabel (date = new Date()) {
  return date.toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short'
  })
}

function slugify (value) {
  return (value || 'groupe')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function money (amount) {
  return amountToCurrency(amount).replace('.', ',')
}

function expenseType (expense) {
  return expense.kind === 'refund' ? 'Remboursement' : expense.category || ''
}

function paidBy (expense) {
  return expense.credits.map((credit) => credit.member.nickname).join(', ')
}

function csvValue (value) {
  const text = value == null ? '' : String(value)
  if (/[";\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function csvRow (cells) {
  return cells.map(csvValue).join(';')
}

function buildFileName (groupName, extension) {
  return `historique-${slugify(groupName)}-${exportDateStamp()}.${extension}`
}

function downloadBlob (blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function hexToRgb (hex) {
  const value = parseInt(hex.replace('#', ''), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

export function exportExpensesCsv ({
  expenses,
  paybacks,
  groupName,
  sections
}) {
  const lines = []
  const push = (...rows) => rows.forEach((row) => lines.push(row))

  push(csvRow(['Historique des dépenses']))
  push(csvRow(['Groupe', groupName || '']))
  push(csvRow(['Exporté le', exportDateLabel()]))
  push('')

  if (sections.debts) {
    push(csvRow(['Dettes']))
    push(csvRow(['De', 'Vers', 'Montant']))
    if (paybacks.length === 0) {
      push(csvRow(['Aucune dette']))
    } else {
      paybacks.forEach((payback) => {
        push(csvRow([payback.from.name, payback.to.name, money(payback.amount)]))
      })
    }
    push('')
  }

  if (sections.statistics) {
    const categoryStats = buildCategoryStats(expenses, EXPENSE_CATEGORIES)
    const monthlyBuckets = buildMonthlyBuckets(expenses)
    const total = categoryStats.reduce((sum, stat) => sum + stat.amount, 0)

    push(csvRow(['Statistiques']))
    push(csvRow(['Par catégorie']))
    push(csvRow(['Catégorie', 'Montant', 'Pourcentage']))
    if (categoryStats.length === 0) {
      push(csvRow(['Aucune donnée']))
    } else {
      categoryStats.forEach((stat) => {
        push(
          csvRow([
            stat.label,
            money(stat.amount),
            `${stat.percent.toFixed(1).replace('.', ',')} %`
          ])
        )
      })
      push(csvRow(['Total', money(total), '100 %']))
    }
    push('')
    push(csvRow(['Par mois']))
    push(csvRow(['Mois', 'Montant']))
    if (monthlyBuckets.length === 0) {
      push(csvRow(['Aucune donnée']))
    } else {
      monthlyBuckets.forEach((month) => {
        push(csvRow([monthLabel(month.key), money(month.total)]))
      })
    }
    push('')
  }

  if (sections.history) {
    push(csvRow(['Historique des dépenses']))
    push(csvRow(['Intitulé', 'Type', 'Date', 'Montant', 'Payé par']))
    if (expenses.length === 0) {
      push(csvRow(['Aucune dépense']))
    } else {
      sortExpenses(expenses).forEach((expense) => {
        push(
          csvRow([
            expense.name,
            expenseType(expense),
            formatDate(expense.paymentDate || expense.createdAt),
            money(expense.amount),
            paidBy(expense)
          ])
        )
      })
    }
  }

  const csv = `\ufeff${lines.join('\r\n')}`
  downloadBlob(
    new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
    buildFileName(groupName, 'csv')
  )
}

function loadImageDataUrl (url) {
  return fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
    )
}

function getImageSize (dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () =>
      resolve({ width: image.naturalWidth, height: image.naturalHeight })
    image.onerror = reject
    image.src = dataUrl
  })
}

function ensureSpace (doc, y, needed) {
  const pageHeight = doc.internal.pageSize.getHeight()
  if (y + needed > pageHeight - PAGE_MARGIN) {
    doc.addPage()
    return PAGE_MARGIN
  }
  return y
}

function drawPie (doc, cx, cy, radius, slices) {
  let angleCursor = -Math.PI / 2
  for (const slice of slices) {
    const angle = (slice.percent / 100) * Math.PI * 2
    const segments = Math.max(4, Math.ceil(angle / 0.08))
    const [r, g, b] = hexToRgb(slice.color)
    doc.setFillColor(r, g, b)
    for (let i = 0; i < segments; i++) {
      const a1 = angleCursor + (angle * i) / segments
      const a2 = angleCursor + (angle * (i + 1)) / segments
      doc.triangle(
        cx,
        cy,
        cx + radius * Math.cos(a1),
        cy + radius * Math.sin(a1),
        cx + radius * Math.cos(a2),
        cy + radius * Math.sin(a2),
        'F'
      )
    }
    angleCursor += angle
  }
}

export async function exportExpensesPdf ({
  expenses,
  paybacks,
  groupName,
  sections
}) {
  const { jsPDF: JsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new JsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = PAGE_MARGIN

  if (sections.logo) {
    try {
      const dataUrl = await loadImageDataUrl(LOGO_URL)
      const size = await getImageSize(dataUrl)
      const height = 16
      const width = (size.width / size.height) * height
      doc.addImage(dataUrl, 'PNG', PAGE_MARGIN, y, width, height)
      y += height + 8
    } catch {
      // Le logo est optionnel : on continue l'export sans lui.
    }
  }

  doc.setFontSize(18)
  doc.setTextColor(40, 40, 40)
  doc.text('Historique des dépenses', PAGE_MARGIN, y)
  y += 8

  doc.setFontSize(11)
  doc.setTextColor(110, 110, 110)
  doc.text(sanitizePdfText(`Groupe : ${groupName || '—'}`), PAGE_MARGIN, y)
  y += 6
  doc.text(`Exporté le ${exportDateLabel()}`, PAGE_MARGIN, y)
  y += 12

  const heading = (title) => {
    y = ensureSpace(doc, y, 16)
    doc.setFontSize(14)
    doc.setTextColor(40, 40, 40)
    doc.text(title, PAGE_MARGIN, y)
    y += 4
  }

  const table = (head, body) => {
    autoTable(doc, {
      startY: y,
      head: [head.map(sanitizePdfText)],
      body: body.map((row) => row.map(sanitizePdfText)),
      theme: 'grid',
      margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
      headStyles: { fillColor: [168, 85, 247] },
      styles: { fontSize: 9, cellPadding: 2 }
    })
    y = doc.lastAutoTable.finalY + 10
  }

  if (sections.debts) {
    heading('Dettes')
    table(
      ['De', 'Vers', 'Montant'],
      paybacks.length === 0
        ? [['Aucune dette', '', '']]
        : paybacks.map((payback) => [
          payback.from.name,
          payback.to.name,
          amountToCurrency(payback.amount)
        ])
    )
  }

  if (sections.statistics) {
    const categoryStats = buildCategoryStats(expenses, EXPENSE_CATEGORIES)
    const monthlyBuckets = buildMonthlyBuckets(expenses)
    const total = categoryStats.reduce((sum, stat) => sum + stat.amount, 0)

    heading('Statistiques')
    table(
      ['Catégorie', 'Montant', 'Pourcentage'],
      categoryStats.length === 0
        ? [['Aucune donnée', '', '']]
        : [
            ...categoryStats.map((stat) => [
              stat.label,
              amountToCurrency(stat.amount),
              `${stat.percent.toFixed(1).replace('.', ',')} %`
            ]),
            ['Total', amountToCurrency(total), '100 %']
          ]
    )

    if (categoryStats.length > 0) {
      y = ensureSpace(doc, y, 64)
      const radius = 24
      const cx = PAGE_MARGIN + radius
      const cy = y + radius
      drawPie(doc, cx, cy, radius, categoryStats)

      let legendY = y + 5
      const legendX = cx + radius + 10
      doc.setFontSize(9)
      categoryStats.forEach((stat) => {
        const [r, g, b] = hexToRgb(stat.color)
        doc.setFillColor(r, g, b)
        doc.rect(legendX, legendY - 3, 4, 4, 'F')
        doc.setTextColor(60, 60, 60)
        doc.text(
          sanitizePdfText(
            `${stat.label} — ${amountToCurrency(stat.amount)} (${stat.percent
              .toFixed(1)
              .replace('.', ',')} %)`
          ),
          legendX + 7,
          legendY
        )
        legendY += 6
      })
      y = Math.max(cy + radius, legendY) + 8
    }

    heading('Dépenses par mois')
    table(
      ['Mois', 'Montant'],
      monthlyBuckets.length === 0
        ? [['Aucune donnée', '']]
        : monthlyBuckets.map((month) => [
          monthLabel(month.key),
          amountToCurrency(month.total)
        ])
    )
  }

  if (sections.history) {
    heading('Historique des dépenses')
    table(
      ['Intitulé', 'Type', 'Date', 'Montant', 'Payé par'],
      expenses.length === 0
        ? [['Aucune dépense', '', '', '', '']]
        : sortExpenses(expenses).map((expense) => [
          expense.name,
          expenseType(expense),
          formatDate(expense.paymentDate || expense.createdAt),
          amountToCurrency(expense.amount),
          paidBy(expense)
        ])
    )
  }

  const pageCount = doc.internal.getNumberOfPages()
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${page}/${pageCount}`,
      pageWidth - PAGE_MARGIN,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'right' }
    )
  }

  doc.save(buildFileName(groupName, 'pdf'))
}
