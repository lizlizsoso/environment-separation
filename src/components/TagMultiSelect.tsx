import { useEffect, useId, useRef, useState } from 'react'

type TagMultiSelectProps = {
  label: string
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export function TagMultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select',
}: TagMultiSelectProps) {
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const available = options.filter((option) => !value.includes(option))

  useEffect(() => {
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
  }, [])

  function addOption(option: string) {
    onChange([...value, option])
    setOpen(false)
  }

  function removeOption(option: string) {
    onChange(value.filter((item) => item !== option))
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-sierra-text">{label}</span>
      <div className="min-h-[72px] rounded-md border border-sierra-border bg-white px-2.5 py-2">
        {value.length > 0 && (
          <div className="mb-1.5 flex flex-wrap gap-1.5">
            {value.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 rounded bg-sierra-green-muted px-2 py-0.5 text-[13px] font-medium text-sierra-green"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeOption(item)}
                  className="inline-flex h-4 w-4 items-center justify-center rounded text-sierra-green/80 hover:bg-sierra-green/10 hover:text-sierra-green"
                  aria-label={`Remove ${item}`}
                >
                  <CloseIcon className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="relative">
          <button
            type="button"
            className="w-full rounded px-1 py-1 text-left text-[13px] text-sierra-muted hover:text-sierra-text"
            onClick={() => setOpen((current) => !current)}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            disabled={available.length === 0}
          >
            {available.length === 0 ? 'All selected' : placeholder}
          </button>
          {open && available.length > 0 && (
            <ul
              id={listboxId}
              role="listbox"
              className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-auto rounded-md border border-sierra-border bg-white py-1 shadow-lg"
            >
              {available.map((option) => (
                <li key={option} role="option">
                  <button
                    type="button"
                    className="w-full px-3 py-1.5 text-left text-[13px] text-sierra-text hover:bg-sierra-green-muted"
                    onClick={() => addOption(option)}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M2 2l8 8M10 2 2 10" strokeLinecap="round" />
    </svg>
  )
}
