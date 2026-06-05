import { useEffect, useRef, useState } from 'react'
import {
  REMOVE_ROW_VARIANTS,
  type RemoveRowVariant,
} from '../types/prototype'

type PrototypePanelProps = {
  removeVariant: RemoveRowVariant
  onRemoveVariantChange: (variant: RemoveRowVariant) => void
}

export function PrototypePanel({
  removeVariant,
  onRemoveVariantChange,
}: PrototypePanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const activeLabel =
    REMOVE_ROW_VARIANTS.find((item) => item.value === removeVariant)?.label ??
    'Prototype variants'

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 left-4 z-[60] w-[min(100vw-2rem,320px)]"
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-sierra-border bg-white px-3 py-2.5 text-left text-[12px] font-medium text-sierra-text shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition hover:border-neutral-300"
      >
        <span className="truncate">{activeLabel}</span>
        <ChevronIcon
          className={`h-3.5 w-3.5 shrink-0 text-sierra-muted transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Prototype variants"
          className="absolute bottom-full left-0 mb-1 w-full overflow-hidden rounded-lg border border-sierra-border bg-white py-1 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        >
          {REMOVE_ROW_VARIANTS.map((item) => (
            <li key={item.value} role="option" aria-selected={removeVariant === item.value}>
              <button
                type="button"
                className={`w-full px-3 py-2 text-left text-[12px] transition hover:bg-neutral-50 ${
                  removeVariant === item.value
                    ? 'font-medium text-sierra-green'
                    : 'text-sierra-text'
                }`}
                onClick={() => {
                  onRemoveVariantChange(item.value)
                  setOpen(false)
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
