import { getSetColor, SET_BAR_COLORS } from '../../lib/set-ops'
import type {
  OperationResults,
  ProcessedSet,
  ResultTab,
  SmartStats,
} from '../../types/set'
import { IconCheck, IconCopy } from './icons'

type ResultsPanelProps = {
  activeTab: ResultTab
  onTabChange: (tab: ResultTab) => void
  sets: ProcessedSet[]
  operationResults: OperationResults
  smartStats: SmartStats
  copiedResult: string | null
  onCopy: (text: string[], resultType: string) => void
}

const TABS: { id: ResultTab; label: string }[] = [
  { id: 'operations', label: 'Set Operations' },
  { id: 'smartStats', label: 'Smart Statistics' },
  { id: 'visualization', label: 'Visualization' },
]

function ResultListCard({
  title,
  values,
  emptyLabel,
  copyKey,
  copiedResult,
  onCopy,
}: {
  title: string
  values: string[]
  emptyLabel: string
  copyKey: string
  copiedResult: string | null
  onCopy: (text: string[], resultType: string) => void
}) {
  return (
    <div className="rounded-[var(--r-ctrl)] bg-[var(--g100)] p-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <h4 className="text-[12px] font-bold text-[var(--g900)]">
          {title} ({values.length})
        </h4>
        {values.length > 0 && (
          <button
            type="button"
            onClick={() => onCopy(values, copyKey)}
            className={`flex h-6 w-6 items-center justify-center rounded-[var(--r-ctrl)] bg-[var(--white)] shadow-[var(--sh-card)] transition ${
              copiedResult === copyKey
                ? 'text-[var(--green)]'
                : 'text-[var(--g500)] hover:text-[var(--g900)]'
            }`}
            title={copiedResult === copyKey ? 'Copied' : 'Copy to clipboard'}
            aria-label={copiedResult === copyKey ? 'Copied' : `Copy ${title}`}
          >
            {copiedResult === copyKey ? <IconCheck /> : <IconCopy />}
          </button>
        )}
      </div>
      <div className="max-h-24 min-h-8 overflow-y-auto rounded-[var(--r-ctrl)] bg-[var(--white)] p-1.5">
        {values.length > 0 ? (
          <ul className="list-disc pl-4 text-[12px] text-[var(--g700)]">
            {values.slice(0, 10).map((item, index) => (
              <li key={`${copyKey}-${index}`}>{item}</li>
            ))}
            {values.length > 10 && (
              <li className="italic text-[var(--g400)]">
                …and {values.length - 10} more
              </li>
            )}
          </ul>
        ) : (
          <span className="text-[12px] italic text-[var(--g400)]">{emptyLabel}</span>
        )}
      </div>
    </div>
  )
}

function OperationsTab({
  operationResults,
  copiedResult,
  onCopy,
}: {
  operationResults: OperationResults
  copiedResult: string | null
  onCopy: (text: string[], resultType: string) => void
}) {
  return (
    <div className="space-y-4">
      <section>
        <h3 className="mb-2 text-[13px] font-bold text-[var(--indigo)]">
          Set Differences
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(operationResults.differences).map(([key, values]) => (
            <ResultListCard
              key={`diff-${key}`}
              title={key}
              values={values}
              emptyLabel="No elements"
              copyKey={`diff-${key}`}
              copiedResult={copiedResult}
              onCopy={onCopy}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[13px] font-bold text-[var(--indigo)]">
          Intersections
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(operationResults.intersections).map(([key, values]) => (
            <ResultListCard
              key={`int-${key}`}
              title={key}
              values={values}
              emptyLabel="No common elements"
              copyKey={`int-${key}`}
              copiedResult={copiedResult}
              onCopy={onCopy}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[13px] font-bold text-[var(--indigo)]">
          Unions
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(operationResults.unions).map(([key, values]) => (
            <ResultListCard
              key={`union-${key}`}
              title={key}
              values={values}
              emptyLabel="No elements"
              copyKey={`union-${key}`}
              copiedResult={copiedResult}
              onCopy={onCopy}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function SmartStatsTab({
  sets,
  smartStats,
  copiedResult,
  onCopy,
}: {
  sets: ProcessedSet[]
  smartStats: SmartStats
  copiedResult: string | null
  onCopy: (text: string[], resultType: string) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {[
          {
            label: 'Total unique values',
            value: smartStats.summary.totalUniqueValues || 0,
          },
          {
            label: 'Common across all sets',
            value: smartStats.commonAcrossAll.length,
          },
          {
            label: 'Sets with data',
            value: sets.filter((s) => s.uniqueCount > 0).length,
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`rounded-[var(--r-card)] p-3.5 text-center ${
              i === 0
                ? 'bg-[var(--indigo)] text-white shadow-[var(--sh-pop)]'
                : 'bg-[var(--g100)] text-[var(--g900)]'
            }`}
          >
            <h3
              className={`text-[11px] font-medium ${
                i === 0 ? 'text-white/80' : 'text-[var(--g400)]'
              }`}
            >
              {stat.label}
            </h3>
            <p className="mt-1 text-[22px] font-bold tracking-[-1px]">{stat.value}</p>
          </div>
        ))}
      </div>

      <section>
        <h3 className="mb-2 text-[13px] font-bold text-[var(--indigo)]">
          Elements common to all sets
        </h3>
        <div className="rounded-[var(--r-ctrl)] bg-[var(--g100)] p-4">
          {smartStats.commonAcrossAll.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {smartStats.commonAcrossAll.map((item, index) => (
                <span
                  key={`common-${index}`}
                  className="rounded-[var(--r-pill)] bg-[var(--indigo-soft)] px-3 py-1 text-[11px] font-bold text-[var(--indigo)]"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[13px] italic text-[var(--g400)]">
              No elements common to all sets
            </p>
          )}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[13px] font-bold text-[var(--indigo)]">
          Elements unique to each set
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(smartStats.uniqueToEachSet).map(([setId, values]) => {
            const set = sets.find((s) => s.id === setId)
            const title = set
              ? `${set.name} only`
              : `Set ${setId} only`
            return (
              <ResultListCard
                key={`unique-${setId}`}
                title={title}
                values={values}
                emptyLabel="No unique elements"
                copyKey={`unique-${setId}`}
                copiedResult={copiedResult}
                onCopy={onCopy}
              />
            )
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-[13px] font-bold text-[var(--indigo)]">
          Value distribution across sets
        </h3>
        <div className="overflow-x-auto rounded-[var(--r-ctrl)] bg-[var(--g100)] p-4">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[var(--g200)]">
                <th className="px-4 py-2 text-left font-bold text-[var(--g900)]">Value</th>
                {sets.map((set) => (
                  <th
                    key={`header-${set.id}`}
                    className="px-4 py-2 text-center font-bold text-[var(--g900)]"
                  >
                    {set.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(smartStats.valueDistribution)
                .slice(0, 20)
                .map(([value, setIds], index) => (
                  <tr
                    key={`dist-${index}`}
                    className={index % 2 === 0 ? 'bg-[var(--white)]' : ''}
                  >
                    <td className="px-4 py-2 text-[var(--g700)]">{value}</td>
                    {sets.map((set) => (
                      <td key={`dist-${index}-${set.id}`} className="px-4 py-2 text-center">
                        <span
                          className={`inline-block h-3.5 w-3.5 rounded-full ${
                            setIds.includes(set.id)
                              ? 'bg-[var(--green)]'
                              : 'bg-[var(--g300)]'
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              {Object.keys(smartStats.valueDistribution).length > 20 && (
                <tr>
                  <td
                    colSpan={sets.length + 1}
                    className="px-4 py-2 text-center italic text-[var(--g400)]"
                  >
                    …and {Object.keys(smartStats.valueDistribution).length - 20} more
                    values
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function VisualizationTab({
  sets,
  operationResults,
  smartStats,
}: {
  sets: ProcessedSet[]
  operationResults: OperationResults
  smartStats: SmartStats
}) {
  const labelFill = 'var(--g900)'

  if (sets.length > 3) {
    const totalSize = sets.reduce((sum, s) => sum + s.uniqueCount, 0)

    return (
      <div className="space-y-6">
        <section>
          <h3 className="mb-3 text-[13px] font-bold text-[var(--indigo)]">
            Set size comparison
          </h3>
          <div className="relative mb-4 h-14 overflow-hidden rounded-[var(--r-pill)] bg-[var(--g100)]">
            {sets.map((set, index) => {
              const widthPct = totalSize > 0 ? (set.uniqueCount / totalSize) * 100 : 0
              const prevWidth = sets.slice(0, index).reduce((sum, s) => {
                return sum + (totalSize > 0 ? (s.uniqueCount / totalSize) * 100 : 0)
              }, 0)

              return (
                <div
                  key={`size-${set.id}`}
                  className={`absolute h-full ${SET_BAR_COLORS[index % SET_BAR_COLORS.length]}`}
                  style={{ left: `${prevWidth}%`, width: `${widthPct}%` }}
                >
                  {widthPct > 5 && (
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                      {set.id}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mb-2 flex flex-wrap gap-3">
            {sets.map((set, index) => (
              <div key={`legend-${set.id}`} className="flex items-center gap-1.5 text-[13px]">
                <div
                  className={`h-3.5 w-3.5 rounded-[4px] ${SET_BAR_COLORS[index % SET_BAR_COLORS.length]}`}
                />
                <span className="text-[var(--g700)]">
                  Set {set.id}: {set.uniqueCount}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-[13px] font-bold text-[var(--indigo)]">
            Set overlap matrix
          </h3>
          <div className="overflow-x-auto rounded-[var(--r-ctrl)] bg-[var(--g100)] p-4">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  <th className="border border-[var(--g200)] px-4 py-2" />
                  {sets.map((set) => (
                    <th
                      key={`header-${set.id}`}
                      className="border border-[var(--g200)] px-4 py-2 font-bold text-[var(--g900)]"
                    >
                      {set.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sets.map((set) => (
                  <tr key={`row-${set.id}`}>
                    <th className="border border-[var(--g200)] px-4 py-2 text-left font-bold text-[var(--g900)]">
                      {set.name}
                    </th>
                    {sets.map((compareSet) => {
                      const key =
                        set.id === compareSet.id
                          ? null
                          : set.id < compareSet.id
                            ? `${set.id}∩${compareSet.id}`
                            : `${compareSet.id}∩${set.id}`
                      const overlap = key
                        ? (operationResults.intersections[key]?.length ?? 0)
                        : set.uniqueCount

                      return (
                        <td
                          key={`cell-${set.id}-${compareSet.id}`}
                          className={`border border-[var(--g200)] px-4 py-2 text-center ${
                            set.id === compareSet.id ? 'bg-[var(--white)]' : ''
                          }`}
                        >
                          {overlap}
                          {set.id !== compareSet.id &&
                            set.uniqueCount > 0 &&
                            compareSet.uniqueCount > 0 && (
                              <div className="text-[11px] text-[var(--g400)]">
                                {((overlap / set.uniqueCount) * 100).toFixed(1)}%
                              </div>
                            )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-center">
        {sets.length === 2 && (
          <svg width="400" height="280" viewBox="0 0 400 280" className="max-w-full">
            <circle
              cx="160"
              cy="140"
              r="100"
              fill={getSetColor('A').bg}
              stroke={getSetColor('A').border}
              strokeWidth="2"
            />
            <text x="100" y="80" fill={labelFill} fontSize="16" fontWeight="bold">
              {sets[0].name} ({sets[0].uniqueCount})
            </text>

            <circle
              cx="240"
              cy="140"
              r="100"
              fill={getSetColor('B').bg}
              stroke={getSetColor('B').border}
              strokeWidth="2"
            />
            <text x="280" y="80" fill={labelFill} fontSize="16" fontWeight="bold">
              {sets[1].name} ({sets[1].uniqueCount})
            </text>

            <text
              x="190"
              y="140"
              fill={labelFill}
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
            >
              {operationResults.intersections['A∩B']?.length || 0}
            </text>
            <text
              x="125"
              y="140"
              fill={labelFill}
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
            >
              {operationResults.differences['A-B']?.length || 0}
            </text>
            <text
              x="275"
              y="140"
              fill={labelFill}
              fontSize="14"
              fontWeight="bold"
              textAnchor="middle"
            >
              {operationResults.differences['B-A']?.length || 0}
            </text>

            <rect
              x="120"
              y="220"
              width="160"
              height="50"
              rx="10"
              fill="var(--white)"
              stroke="var(--g200)"
            />
            <circle
              cx="140"
              cy="235"
              r="8"
              fill={getSetColor('A').bg}
              stroke={getSetColor('A').border}
              strokeWidth="2"
            />
            <text x="155" y="239" fill={labelFill} fontSize="12">
              {sets[0].name.length > 10 ? sets[0].id : sets[0].name} only:{' '}
              {operationResults.differences['A-B']?.length || 0}
            </text>
            <circle
              cx="140"
              cy="255"
              r="8"
              fill={getSetColor('B').bg}
              stroke={getSetColor('B').border}
              strokeWidth="2"
            />
            <text x="155" y="259" fill={labelFill} fontSize="12">
              {sets[1].name.length > 10 ? sets[1].id : sets[1].name} only:{' '}
              {operationResults.differences['B-A']?.length || 0}
            </text>
          </svg>
        )}

        {sets.length === 3 && (
          <svg width="500" height="400" viewBox="0 0 500 400" className="max-w-full">
            <circle
              cx="200"
              cy="150"
              r="100"
              fill={getSetColor('A', 0.8).bg}
              stroke={getSetColor('A').border}
              strokeWidth="2"
            />
            <text x="135" y="90" fill={labelFill} fontSize="16" fontWeight="bold">
              {sets[0].name} ({sets[0].uniqueCount})
            </text>

            <circle
              cx="300"
              cy="150"
              r="100"
              fill={getSetColor('B', 0.8).bg}
              stroke={getSetColor('B').border}
              strokeWidth="2"
            />
            <text x="365" y="90" fill={labelFill} fontSize="16" fontWeight="bold">
              {sets[1].name} ({sets[1].uniqueCount})
            </text>

            <circle
              cx="250"
              cy="250"
              r="100"
              fill={getSetColor('C', 0.8).bg}
              stroke={getSetColor('C').border}
              strokeWidth="2"
            />
            <text
              x="250"
              y="370"
              fill={labelFill}
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
            >
              {sets[2].name} ({sets[2].uniqueCount})
            </text>

            <rect
              x="50"
              y="320"
              width="150"
              height="70"
              rx="10"
              fill="var(--white)"
              stroke="var(--g200)"
            />
            <circle
              cx="70"
              cy="340"
              r="6"
              fill={getSetColor('A').bg}
              stroke={getSetColor('A').border}
              strokeWidth="2"
            />
            <text x="85" y="344" fill={labelFill} fontSize="10">
              {sets[0].id} only
            </text>
            <circle
              cx="70"
              cy="358"
              r="6"
              fill={getSetColor('B').bg}
              stroke={getSetColor('B').border}
              strokeWidth="2"
            />
            <text x="85" y="362" fill={labelFill} fontSize="10">
              {sets[1].id} only
            </text>
            <circle
              cx="70"
              cy="376"
              r="6"
              fill={getSetColor('C').bg}
              stroke={getSetColor('C').border}
              strokeWidth="2"
            />
            <text x="85" y="380" fill={labelFill} fontSize="10">
              {sets[2].id} only · all: {smartStats.commonAcrossAll.length}
            </text>
          </svg>
        )}
      </div>

      {sets.length === 3 && (
        <div className="mt-4 rounded-[var(--r-ctrl)] bg-[var(--indigo-soft)] px-4 py-3 text-[13px] text-[var(--indigo)]">
          <strong>Note:</strong> For the 3-set Venn diagram, exact region counts aren&apos;t
          displayed due to complexity. See Smart Statistics for detailed counts.
        </div>
      )}
    </div>
  )
}

export function ResultsPanel({
  activeTab,
  onTabChange,
  sets,
  operationResults,
  smartStats,
  copiedResult,
  onCopy,
}: ResultsPanelProps) {
  return (
    <div className="rounded-[var(--r-card)] bg-[var(--white)] p-3.5 shadow-[var(--sh-card)]">
      <div className="mb-3 flex flex-wrap gap-1 rounded-[var(--r-pill)] bg-[var(--g100)] p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 rounded-[var(--r-pill)] px-3 py-2 text-xs font-medium transition ${
              activeTab === tab.id
                ? 'bg-[var(--indigo)] font-semibold text-white shadow-[var(--sh-pop)]'
                : 'text-[var(--g500)] hover:text-[var(--g900)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'operations' && (
        <OperationsTab
          operationResults={operationResults}
          copiedResult={copiedResult}
          onCopy={onCopy}
        />
      )}
      {activeTab === 'smartStats' && (
        <SmartStatsTab
          sets={sets}
          smartStats={smartStats}
          copiedResult={copiedResult}
          onCopy={onCopy}
        />
      )}
      {activeTab === 'visualization' && (
        <VisualizationTab
          sets={sets}
          operationResults={operationResults}
          smartStats={smartStats}
        />
      )}
    </div>
  )
}
