'use client'

import { Icon } from '@/components/ui/Icon'
import type { Option } from '@/lib/assessment/steps'

type SelectionCardProps = {
  option: Option
  selected: boolean
  onSelect: (value: string) => void
  multi?: boolean
  name: string
}

export function SelectionCard({ option, selected, onSelect, multi, name }: SelectionCardProps) {
  return (
    <label
      className={`group flex min-h-[64px] cursor-pointer items-center gap-4 rounded border px-5 py-4 transition-colors duration-150 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-petrol ${
        selected
          ? 'border-petrol bg-petrol text-paper'
          : 'border-ink/15 bg-white text-ink hover:border-petrol/50 hover:bg-petrol/5'
      }`}
    >
      <input
        type={multi ? 'checkbox' : 'radio'}
        name={name}
        value={option.value}
        checked={selected}
        onChange={() => onSelect(option.value)}
        className="sr-only"
      />
      {option.icon && (
        <span className={selected ? 'text-yellow' : 'text-petrol'}>
          <Icon name={option.icon} className="h-6 w-6 shrink-0" />
        </span>
      )}
      <span className="flex-1">
        <span className="block text-[15px] font-semibold leading-snug">{option.label}</span>
        {option.description && (
          <span className={`mt-0.5 block text-sm ${selected ? 'text-paper/75' : 'text-ink/55'}`}>
            {option.description}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded${multi ? '' : '-full'} border ${
          selected ? 'border-yellow bg-yellow text-ink' : 'border-ink/25'
        }`}
      >
        {selected && <Icon name="check" className="h-3.5 w-3.5" />}
      </span>
    </label>
  )
}
