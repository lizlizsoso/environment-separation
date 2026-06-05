import { useState } from 'react'
import type { RemoveRowVariant } from '../types/prototype'
import {
  RoleAssignments,
  type RoleAssignment,
} from './RoleAssignments'

type EditUserModalProps = {
  open: boolean
  onClose: () => void
  removeVariant: RemoveRowVariant
}

export function EditUserModal({ open, onClose, removeVariant }: EditUserModalProps) {
  const [fullName, setFullName] = useState('Wayne Fan')
  const [assignments, setAssignments] = useState<RoleAssignment[]>([
    {
      id: 'admin',
      role: 'Admin',
      agents: ['campfire'],
      environments: ['Production', 'Staging', 'Test'],
    },
  ])
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  if (!open) return null

  function handleSave() {
    const summary = assignments
      .map(
        (a) =>
          `${a.role} (${a.agents.join(', ')}) · ${a.environments.join(', ')}`,
      )
      .join('; ')
    setSavedMessage(`Saved locally: ${fullName} · ${summary}`)
    window.setTimeout(() => setSavedMessage(null), 3200)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-sierra-overlay/90 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-user-title"
        className="w-full max-w-[720px] rounded-lg border border-sierra-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-sierra-border px-5 py-4">
          <h2
            id="edit-user-title"
            className="text-[15px] font-semibold text-sierra-text"
          >
            Edit user
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded text-sierra-muted hover:bg-neutral-100 hover:text-sierra-text"
            aria-label="Close"
          >
            <CloseIcon className="h-3.5 w-3.5" />
          </button>
        </header>

        <div className="space-y-4 overflow-visible px-5 py-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-sierra-text">
              Full name
            </span>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="h-9 rounded-md border border-sierra-border px-3 text-[13px] text-sierra-text outline-none transition focus:border-sierra-green focus:ring-2 focus:ring-sierra-green/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-sierra-text">
              Email
            </span>
            <input
              type="email"
              value="design.intern@sierra.ai"
              readOnly
              disabled
              className="h-9 cursor-not-allowed rounded-md border border-sierra-border bg-sierra-input-disabled px-3 text-[13px] text-sierra-muted"
            />
          </label>

          <hr className="border-sierra-border" />

          <RoleAssignments
            assignments={assignments}
            onChange={setAssignments}
            removeVariant={removeVariant}
          />
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-sierra-border px-5 py-4">
          {savedMessage && (
            <p className="mr-auto text-[12px] text-sierra-green">{savedMessage}</p>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-sierra-green px-4 py-1.5 text-[13px] font-medium text-white transition hover:bg-sierra-green-hover focus:outline-none focus:ring-2 focus:ring-sierra-green/40"
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M3 3l8 8M11 3 3 11" strokeLinecap="round" />
    </svg>
  )
}
