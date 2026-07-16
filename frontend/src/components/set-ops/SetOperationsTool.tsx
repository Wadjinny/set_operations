import { useMemo, useState } from 'react'
import {
  calculateSetOperations,
  calculateSmartStats,
  createEmptySet,
  createInitialSets,
  getExampleSets,
  MAX_SETS,
  processSets,
  reassignSetIds,
} from '../../lib/set-ops'
import type { ExampleKey, ResultTab, Separator, SetInput } from '../../types/set'
import { IconChart, IconPlus, IconSparkles, IconTrash } from './icons'
import { ResultsPanel } from './ResultsPanel'
import { SetInputCard } from './SetInputCard'

export function SetOperationsTool() {
  const [sets, setSets] = useState<SetInput[]>(createInitialSets)
  const [activeTab, setActiveTab] = useState<ResultTab>('operations')
  const [showExamples, setShowExamples] = useState(false)
  const [showFrequency, setShowFrequency] = useState(false)
  const [copiedResult, setCopiedResult] = useState<string | null>(null)

  const processedSets = useMemo(() => processSets(sets), [sets])
  const operationResults = useMemo(
    () => calculateSetOperations(processedSets),
    [processedSets],
  )
  const smartStats = useMemo(() => calculateSmartStats(processedSets), [processedSets])

  const updateSet = (index: number, updates: Partial<SetInput>) => {
    setSets((prev) =>
      prev.map((set, i) => (i === index ? { ...set, ...updates } : set)),
    )
  }

  const addSet = () => {
    if (sets.length >= MAX_SETS) return
    setSets((prev) => [...prev, createEmptySet(prev.length)])
  }

  const removeSet = (index: number) => {
    if (sets.length <= 2) return
    setSets((prev) => reassignSetIds(prev.filter((_, i) => i !== index)))
  }

  const clearSet = (index: number | 'all') => {
    if (index === 'all') {
      setSets((prev) => prev.map((set) => ({ ...set, data: '' })))
      return
    }
    updateSet(index, { data: '' })
  }

  const pasteIntoSet = async (index: number) => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) updateSet(index, { data: text })
    } catch {
      // Clipboard permission denied or unavailable
    }
  }

  const loadExample = (example: ExampleKey) => {
    setSets(getExampleSets(example))
    setShowExamples(false)
  }

  const copyToClipboard = (text: string[], resultType: string) => {
    void navigator.clipboard.writeText(text.join('\n')).then(() => {
      setCopiedResult(resultType)
      setTimeout(() => setCopiedResult(null), 2000)
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setShowExamples((v) => !v)}
          className={`flex h-8 w-8 items-center justify-center rounded-[var(--r-ctrl)] shadow-[var(--sh-card)] transition hover:shadow-[var(--sh-hover)] ${
            showExamples
              ? 'bg-[var(--indigo)] text-white shadow-[var(--sh-pop)]'
              : 'bg-[var(--white)] text-[var(--g700)]'
          }`}
          title="Examples"
          aria-label="Toggle examples"
          aria-pressed={showExamples}
        >
          <IconSparkles />
        </button>
        <button
          type="button"
          onClick={() => clearSet('all')}
          className="flex h-8 w-8 items-center justify-center rounded-[var(--r-ctrl)] bg-[var(--red-soft)] text-[var(--red)] transition hover:opacity-90"
          title="Clear all"
          aria-label="Clear all sets"
        >
          <IconTrash />
        </button>
        <button
          type="button"
          onClick={() => setShowFrequency((v) => !v)}
          className={`flex h-8 w-8 items-center justify-center rounded-[var(--r-ctrl)] shadow-[var(--sh-card)] transition hover:shadow-[var(--sh-hover)] ${
            showFrequency
              ? 'bg-[var(--indigo)] text-white shadow-[var(--sh-pop)]'
              : 'bg-[var(--white)] text-[var(--g700)]'
          }`}
          title={showFrequency ? 'Hide frequency' : 'Show frequency'}
          aria-label={showFrequency ? 'Hide frequency' : 'Show frequency'}
          aria-pressed={showFrequency}
        >
          <IconChart />
        </button>
      </div>

      {showExamples && (
        <div className="rounded-[var(--r-card)] bg-[var(--white)] p-3.5 shadow-[var(--sh-card)]">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ['countries', 'Countries (3 sets)'],
                ['numbers', 'Numbers (3 sets)'],
                ['fruits', 'Fruits (3 sets)'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => loadExample(key)}
                className="rounded-[var(--r-pill)] bg-[var(--g100)] px-3 py-1.5 text-[12px] font-medium text-[var(--g700)] transition hover:bg-[var(--indigo-soft)] hover:text-[var(--indigo)]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {processedSets.map((set, index) => (
              <SetInputCard
                key={`set-${set.id}`}
                set={set}
                index={index}
                canRemove={sets.length > 2}
                onUpdateName={(i, name) => updateSet(i, { name })}
                onUpdateSeparator={(i, separator: Separator) =>
                  updateSet(i, { separator })
                }
                onUpdateData={(i, data) => updateSet(i, { data })}
                onClear={clearSet}
                onPaste={pasteIntoSet}
                onRemove={removeSet}
              />
            ))}
          </div>

          {sets.length < MAX_SETS && (
            <button
              type="button"
              onClick={addSet}
              className="flex w-full items-center justify-center gap-2 rounded-[var(--r-card)] bg-[var(--indigo)] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[var(--sh-pop)] transition hover:bg-[var(--indigo-hover)]"
              title={`Add Set ${String.fromCharCode('A'.charCodeAt(0) + sets.length)}`}
            >
              <IconPlus />
              Add Set ({String.fromCharCode('A'.charCodeAt(0) + sets.length)})
            </button>
          )}
        </div>

        <div className="space-y-3 xl:sticky xl:top-3 xl:self-start">
          {showFrequency && (
            <div className="rounded-[var(--r-card)] bg-[var(--white)] p-3.5 shadow-[var(--sh-card)]">
              <FrequencyPanel sets={processedSets} />
            </div>
          )}

          <ResultsPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            sets={processedSets}
            operationResults={operationResults}
            smartStats={smartStats}
            copiedResult={copiedResult}
            onCopy={copyToClipboard}
          />
        </div>
      </div>
    </div>
  )
}

function FrequencyPanel({
  sets,
}: {
  sets: ReturnType<typeof processSets>
}) {
  return (
    <>
      <h2 className="mb-3 text-[13px] font-bold text-[var(--indigo)]">
        Value frequency analysis
      </h2>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {sets.map((set) => (
          <div key={`freq-${set.id}`}>
            <h3 className="mb-1.5 text-[12px] font-bold text-[var(--g900)]">
              Set {set.id}
            </h3>
            <div className="max-h-48 overflow-y-auto rounded-[var(--r-ctrl)] bg-[var(--g100)] p-2.5">
              {Object.keys(set.frequency).length > 0 ? (
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="border-b border-[var(--g200)]">
                      <th className="px-2 py-1 text-left font-bold text-[var(--g900)]">
                        Value
                      </th>
                      <th className="px-2 py-1 text-right font-bold text-[var(--g900)]">
                        Count
                      </th>
                      <th className="px-2 py-1 text-right font-bold text-[var(--g900)]">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(set.frequency)
                      .sort((a, b) => b[1] - a[1])
                      .map(([value, count], index) => (
                        <tr
                          key={`freq-${set.id}-${index}`}
                          className="border-b border-[var(--g100)]"
                        >
                          <td className="px-2 py-0.5 text-[var(--g700)]">{value}</td>
                          <td className="px-2 py-0.5 text-right text-[var(--g900)]">
                            {count}
                          </td>
                          <td className="px-2 py-0.5 text-right text-[var(--g500)]">
                            {set.totalCount > 0
                              ? ((count / set.totalCount) * 100).toFixed(1)
                              : 0}
                            %
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-[12px] italic text-[var(--g400)]">No data available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
