export const PIE_COLORS = [
  '#ba80f8',
  '#e17c55',
  '#e0bed3',
  '#e9e577',
  '#a7bada',
  '#80ba9d',
  '#a97e6e',
  '#c4bef1',
  '#e8b379',
  '#62e8a5'
]

export const UNCATEGORIZED_LABEL = 'Sans catégorie'
export const UNCATEGORIZED_COLOR = '#a1a1aa'

export function sortExpenses (expenseList) {
  return expenseList.slice().sort((a, b) => {
    const dateA = new Date(a.paymentDate || a.createdAt)
    const dateB = new Date(b.paymentDate || b.createdAt)

    const dayA = dateA.setHours(0, 0, 0, 0)
    const dayB = dateB.setHours(0, 0, 0, 0)

    if (dayA !== dayB) return dayB - dayA

    return (
      new Date(b.createdAt || b.paymentDate) -
      new Date(a.createdAt || a.paymentDate)
    )
  })
}

export function expenseMonthKey (expense) {
  const date = new Date(expense.paymentDate || expense.createdAt)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function monthLabel (monthKey) {
  if (!monthKey) return ''
  const [year, month] = monthKey.split('-').map(Number)
  const label = new Date(year, month - 1, 1).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function buildSlices (expenseList) {
  const totals = new Map()
  for (const expense of expenseList) {
    const label = expense.category || UNCATEGORIZED_LABEL
    totals.set(label, (totals.get(label) || 0) + (expense.amount || 0))
  }

  return [...totals.entries()]
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function buildColorMap (expenseList, categories) {
  const known = [...new Set(categories || [])].sort()
  const extra = [...new Set(expenseList.map((expense) => expense.category))]
    .filter((category) => category && !known.includes(category))
    .sort()
  const labels = [...known, ...extra, UNCATEGORIZED_LABEL]

  const map = { [UNCATEGORIZED_LABEL]: UNCATEGORIZED_COLOR }
  let colorIndex = 0
  for (const label of labels) {
    if (label !== UNCATEGORIZED_LABEL) {
      map[label] = PIE_COLORS[colorIndex % PIE_COLORS.length]
      colorIndex += 1
    }
  }
  return map
}

export function buildMonthlyBuckets (expenseList) {
  const buckets = new Map()
  for (const expense of expenseList) {
    const key = expenseMonthKey(expense)
    const bucket = buckets.get(key) || { key, expenses: [] }
    bucket.expenses.push(expense)
    buckets.set(key, bucket)
  }

  return [...buckets.values()]
    .map((bucket) => ({
      ...bucket,
      total: bucket.expenses.reduce(
        (sum, expense) => sum + (expense.amount || 0),
        0
      )
    }))
    .sort((a, b) => b.key.localeCompare(a.key))
}

export function buildCategoryStats (expenseList, categories) {
  const slices = buildSlices(expenseList)
  const total = slices.reduce((sum, slice) => sum + slice.amount, 0)
  const colorMap = buildColorMap(expenseList, categories)

  return slices.map((slice) => ({
    label: slice.label,
    amount: slice.amount,
    percent: total > 0 ? (slice.amount / total) * 100 : 0,
    color: colorMap[slice.label]
  }))
}
