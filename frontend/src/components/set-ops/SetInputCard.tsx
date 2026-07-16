import { SET_BADGE_COLORS, SEPARATOR_OPTIONS } from '../../lib/set-ops'
import type { ProcessedSet, Separator } from '../../types/set'
import { IconClipboard, IconTrash, IconX } from './icons'

type SetInputCardProps = {
  set: ProcessedSet
  index: number
  canRemove: boolean
  onUpdateName: (index: number, name: string) => void
  onUpdateSeparator: (index: number, separator: Separator) => void
  onUpdateData: (index: number, data: string) => void
  onClear: (index: number) => void
  onPaste: (index: number) => void
  onRemove: (index: number) => void
}

const iconBtn =
  'flex h-7 w-7 items-center justify-center rounded-[var(--r-ctrl)] transition hover:opacity-90'

export function SetInputCard({
  set,
  index,
  canRemove,
  onUpdateName,
  onUpdateSeparator,
  onUpdateData,
  onClear,
  onPaste,
  onRemove,
}: SetInputCardProps) {
  const badgeColor = SET_BADGE_COLORS[set.id] ?? 'bg-[var(--g500)]'

  return (
    <div className="rounded-[var(--r-card)] bg-[var(--white)] p-3.5 shadow-[var(--sh-card)] transition hover:shadow-[var(--sh-hover)]">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--r-ctrl)] text-[11px] font-bold text-white ${badgeColor}`}
        >
          {set.id}
        </span>
        <input
          type="text"
          value={set.name}
          onChange={(e) => onUpdateName(index, e.target.value)}
          className="min-w-0 flex-1 border-b border-dashed border-[var(--g200)] bg-transparent text-[13px] font-bold text-[var(--g900)] focus:border-solid focus:border-[var(--indigo)] focus:outline-none"
          aria-label={`Set ${set.id} name`}
          placeholder={`Set ${set.id}`}
        />
        <select
          value={set.separator}
          onChange={(e) => onUpdateSeparator(index, e.target.value as Separator)}
          aria-label={`Set ${set.id} separator`}
          className="w-[7.5rem] shrink-0 rounded-[var(--r-ctrl)] border-[1.5px] border-[var(--g200)] bg-[var(--white)] px-2 py-1 text-[11px] text-[var(--g900)] focus:border-[var(--indigo)] focus:outline-none focus:ring-[3px] focus:ring-[var(--indigo-soft)]"
        >
          {SEPARATOR_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onPaste(index)}
            className={`${iconBtn} bg-[var(--indigo-soft)] text-[var(--indigo)]`}
            title="Paste from clipboard"
            aria-label={`Paste into Set ${set.id}`}
          >
            <IconClipboard />
          </button>
          <button
            type="button"
            onClick={() => onClear(index)}
            className={`${iconBtn} bg-[var(--g100)] text-[var(--g500)]`}
            title="Clear input"
            aria-label={`Clear Set ${set.id}`}
          >
            <IconTrash className="h-3.5 w-3.5" />
          </button>
          {canRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className={`${iconBtn} bg-[var(--red-soft)] text-[var(--red)]`}
              title="Remove set"
              aria-label={`Remove Set ${set.id}`}
            >
              <IconX />
            </button>
          )}
        </div>
        <div className="flex shrink-0 gap-1.5">
          <span className="rounded-[var(--r-pill)] bg-[var(--indigo-soft)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--indigo)]">
            {set.uniqueCount} unique
          </span>
          <span className="rounded-[var(--r-pill)] bg-[var(--g100)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--g500)]">
            {set.totalCount} total
          </span>
        </div>
      </div>

      <textarea
        className="h-24 w-full resize-y rounded-[var(--r-ctrl)] border-[1.5px] border-[var(--g200)] bg-[var(--white)] p-2.5 text-[13px] text-[var(--g900)] placeholder:text-[var(--g400)] focus:border-[var(--indigo)] focus:outline-none focus:ring-[3px] focus:ring-[var(--indigo-soft)]"
        placeholder={`Enter values for Set ${set.id}…`}
        value={set.data}
        onChange={(e) => onUpdateData(index, e.target.value)}
      />
    </div>
  )
}
