'use client'

import { useState } from 'react'

import Button from '@/components/Button'

import { exportExpensesCsv, exportExpensesPdf } from '@/utils/exportExpenses'

const SECTION_OPTIONS = [
  { key: 'debts', label: 'Liste des dettes' },
  { key: 'statistics', label: 'Statistiques' },
  { key: 'history', label: 'Historique des dépenses' }
]

export default function ExportModal ({
  open,
  onClose,
  expenses,
  paybacks,
  groupName
}) {
  const [format, setFormat] = useState('pdf')
  const [sections, setSections] = useState({
    debts: true,
    statistics: true,
    history: true
  })
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const toggleSection = (key) => {
    setSections((current) => ({ ...current, [key]: !current[key] }))
  }

  const activeSections = {
    logo: format === 'pdf',
    debts: sections.debts,
    statistics: sections.statistics,
    history: sections.history
  }

  const hasContent =
    activeSections.debts ||
    activeSections.statistics ||
    activeSections.history

  const handleExport = async () => {
    if (!hasContent) return
    setLoading(true)
    try {
      if (format === 'csv') {
        exportExpensesCsv({
          expenses,
          paybacks,
          groupName,
          sections: activeSections
        })
      } else {
        await exportExpensesPdf({
          expenses,
          paybacks,
          groupName,
          sections: activeSections
        })
      }
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center bg-black/30 dark:bg-black/70 p-4 animate-[fadeIn_0.2s_ease-out]'
      onClick={onClose}
    >
      <div
        className='bg-white dark:bg-zinc-700 w-full max-w-md rounded-2xl shadow-xl p-6 flex flex-col text-left animate-[scaleIn_0.25s_ease-out]'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between mb-4'>
          <h2 className='font-bold text-xl'>Exporter les données</h2>
          <button
            type='button'
            onClick={onClose}
            className='text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-2xl leading-none'
            aria-label='Fermer'
          >
            ×
          </button>
        </div>

        <div className='space-y-4'>
          <div>
            <span className='text-sm font-medium text-zinc-600 dark:text-zinc-300'>
              Format
            </span>
            <div className='mt-2 flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1'>
              {[
                { value: 'pdf', label: 'PDF' },
                { value: 'csv', label: 'CSV' }
              ].map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => setFormat(option.value)}
                  className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition ${
                    format === option.value
                      ? 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 shadow'
                      : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className='text-sm font-medium text-zinc-600 dark:text-zinc-300'>
              Contenu
            </span>
            <div className='mt-2 space-y-2'>
              {SECTION_OPTIONS.map((option) => {
                return (
                  <label
                    key={option.key}
                    className='flex items-center gap-3 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      checked={sections[option.key]}
                      onChange={() => toggleSection(option.key)}
                      className='size-4 accent-purple-500'
                    />
                    <span className='text-sm text-zinc-700 dark:text-zinc-200'>
                      {option.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {!hasContent && (
            <p className='text-sm text-amber-600 dark:text-amber-400'>
              Sélectionne au moins une section à exporter.
            </p>
          )}

          <div className='flex gap-4'>
            <Button
              onClick={onClose}
              className='bg-zinc-400 hover:bg-zinc-500 dark:bg-zinc-600'
            >
              Annuler
            </Button>
            <Button
              onClick={handleExport}
              disabled={!hasContent}
              loading={loading}
            >
              Exporter
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
