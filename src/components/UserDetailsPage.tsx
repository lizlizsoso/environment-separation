import { useEffect, useRef, useState } from 'react'
import { AppSidebar } from './AppSidebar'

const MATRIX_AGENTS = ['campfire', 'fire', 'wood', 'smoke', 'agent'] as const
const MATRIX_ENVIRONMENTS = ['Test', 'Staging', 'Production'] as const

type MatrixEnvironment = (typeof MATRIX_ENVIRONMENTS)[number]
type MatrixAgent = (typeof MATRIX_AGENTS)[number]

type PermissionMatrix = Record<MatrixAgent, Record<MatrixEnvironment, boolean>>

const DEFAULT_MATRIX: PermissionMatrix = {
  campfire: { Test: true, Staging: true, Production: false },
  fire: { Test: true, Staging: true, Production: false },
  wood: { Test: true, Staging: true, Production: false },
  smoke: { Test: true, Staging: true, Production: false },
  agent: { Test: true, Staging: true, Production: false },
}

const ROLES = [
  {
    name: 'Admin',
    description:
      'Can create and manage users, assign roles, and create and manage API tokens.',
  },
  {
    name: 'Agent Manager',
    description: 'Can publish agents and make releases live.',
  },
  {
    name: 'Content Editor',
    description:
      'Can create and edit journeys, responses, simulations, and configurations.',
  },
  {
    name: 'Conversation Reader',
    description: 'Can view conversation transcripts.',
  },
] as const

function createDefaultMatrix(): PermissionMatrix {
  return structuredClone(DEFAULT_MATRIX)
}

type UserDetailsPageProps = {
  fullName?: string
  email?: string
  onBack?: () => void
}

export function UserDetailsPage({
  fullName: initialFullName = 'Wayne Fan',
  email = 'design.intern@sierra.ai',
  onBack,
}: UserDetailsPageProps) {
  const [fullName, setFullName] = useState(initialFullName)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  function handleSave() {
    setSavedMessage(`Saved locally: ${fullName}`)
    window.setTimeout(() => setSavedMessage(null), 3200)
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-sierra-border px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-7 w-7 items-center justify-center rounded text-sierra-muted transition hover:bg-neutral-100 hover:text-sierra-text"
              aria-label="Back to users"
            >
              <BackIcon className="h-4 w-4" />
            </button>
            <h1 className="text-[15px] font-semibold text-sierra-text">
              Users and Roles
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {savedMessage && (
              <p className="mr-2 text-[12px] text-sierra-green">{savedMessage}</p>
            )}
            <button
              type="button"
              onClick={onBack}
              className="rounded-md border border-sierra-border bg-white px-3 py-1.5 text-[13px] text-sierra-text transition hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-sierra-green px-3 py-1.5 text-[13px] font-medium text-white transition hover:bg-sierra-green-hover"
            >
              Save
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-[720px] space-y-6">
            <section className="rounded-lg border border-sierra-border bg-white p-6 space-y-4">
              <h2 className="text-[13px] font-medium text-sierra-text">Name</h2>
              <div className="flex gap-4">
                <label className="flex flex-1 flex-col gap-1.5">
                  <span className="text-[13px] text-sierra-muted">Full name</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="h-9 rounded-md border border-sierra-border px-3 text-[13px] text-sierra-text outline-none transition focus:border-sierra-green focus:ring-2 focus:ring-sierra-green/20"
                  />
                </label>
                <label className="flex flex-1 flex-col gap-1.5">
                  <span className="text-[13px] text-sierra-muted">Email</span>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    disabled
                    className="h-9 cursor-not-allowed rounded-md border border-sierra-border bg-sierra-input-disabled px-3 text-[13px] text-sierra-muted"
                  />
                </label>
              </div>
            </section>

            {ROLES.map((role) => (
              <RoleSection
                key={role.name}
                name={role.name}
                description={role.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RoleSection({
  name,
  description,
}: {
  name: string
  description: string
}) {
  const [enabled, setEnabled] = useState(false)
  const [allAgents, setAllAgents] = useState(true)
  const [selectedAgents, setSelectedAgents] = useState<Set<MatrixAgent>>(new Set())
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [allAgentsMatrix, setAllAgentsMatrix] = useState<Record<MatrixEnvironment, boolean>>({ Test: true, Staging: true, Production: false })
const [matrix, setMatrix] = useState<PermissionMatrix>(createDefaultMatrix)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropdownOpen) return
    function handleClick(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [dropdownOpen])

  function toggleCell(agent: MatrixAgent, environment: MatrixEnvironment) {
    setMatrix((current) => ({
      ...current,
      [agent]: {
        ...current[agent],
        [environment]: !current[agent][environment],
      },
    }))
  }

  function toggleColumn(environment: MatrixEnvironment, agents: readonly MatrixAgent[]) {
    setMatrix((current) => {
      const allChecked = agents.every((agent) => current[agent][environment])
      return {
        ...current,
        ...Object.fromEntries(
          agents.map((agent) => [agent, { ...current[agent], [environment]: !allChecked }])
        ),
      } as PermissionMatrix
    })
  }

  function isColumnFullyChecked(environment: MatrixEnvironment, agents: readonly MatrixAgent[]) {
    return agents.every((agent) => matrix[agent][environment])
  }

  return (
    <section className="rounded-lg border border-sierra-border bg-white p-6">
      <div className="flex items-start justify-between gap-4 px-1">
        <div>
          <h3 className="text-[13px] font-medium text-sierra-text">{name}</h3>
          <p className="mt-0.5 text-[12px] leading-relaxed text-sierra-muted">
            {description}
          </p>
        </div>
        <div className="relative flex shrink-0 items-center gap-3" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className={`inline-flex max-w-[175px] items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] transition ${
              allAgents
                ? 'border-sierra-border text-sierra-green hover:bg-neutral-50'
                : 'border-sierra-border bg-white text-sierra-text hover:bg-neutral-50'
            } ${enabled ? '' : 'invisible'}`}
          >
            <span className="truncate">
              {allAgents
                ? 'All agents'
                : selectedAgents.size > 0
                  ? [...selectedAgents].join(', ')
                  : 'Include all agents'}
            </span>
            <ChevronDownIcon className={`h-3 w-3 shrink-0 ${allAgents ? 'text-sierra-green' : 'text-sierra-muted'}`} />
          </button>

          {dropdownOpen && enabled && (
            <div className="absolute right-10 top-full z-50 mt-1 w-72 overflow-hidden rounded-xl border border-sierra-border bg-white shadow-lg">
              <button
                type="button"
                onClick={() => { setAllAgents(true); setSelectedAgents(new Set()) }}
                className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-neutral-50"
              >
                <span className="mt-0.5 w-4 shrink-0 text-[14px] text-sierra-text">{allAgents ? '✓' : ''}</span>
                <div>
                  <p className="text-[14px] font-medium text-sierra-text">All current and future agents</p>
                  <p className="mt-0.5 text-[13px] text-sierra-muted">Automatically includes any agents you create later</p>
                </div>
              </button>
              <div className="border-t border-sierra-border" />
              <div className="px-4 py-2">
                <p className="text-[13px] text-sierra-muted">Select individual agents</p>
              </div>
              {MATRIX_AGENTS.map((agent) => (
                <button
                  key={agent}
                  type="button"
                  onClick={() => {
                    setAllAgents(false)
                    setSelectedAgents((prev) => {
                      const next = new Set(prev)
                      if (next.has(agent)) next.delete(agent)
                      else next.add(agent)
                      return next
                    })
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-[14px] text-sierra-text hover:bg-neutral-50"
                >
                  <span className="mt-0.5 w-4 shrink-0 text-[14px] text-sierra-text">{selectedAgents.has(agent) ? '✓' : ''}</span>
                  {agent}
                </button>
              ))}
            </div>
          )}
          <ToggleSwitch
            checked={enabled}
            onChange={setEnabled}
            label={`Enable ${name} role`}
          />
        </div>
      </div>

      {enabled && (
        <div className="mt-4">
          {allAgents ? (
            <AllAgentsTable
              matrix={allAgentsMatrix}
              onChange={(env) => setAllAgentsMatrix((m) => ({ ...m, [env]: !m[env] }))}
            />
          ) : selectedAgents.size > 0 ? (
            <PermissionMatrixTable
              agents={MATRIX_AGENTS.filter((a) => selectedAgents.has(a))}
              matrix={matrix}
              isColumnFullyChecked={isColumnFullyChecked}
              onToggleColumn={toggleColumn}
              onToggleCell={toggleCell}
            />
          ) : null}

        </div>
      )}
    </section>
  )
}

function AllAgentsTable({
  matrix,
  onChange,
}: {
  matrix: Record<MatrixEnvironment, boolean>
  onChange: (environment: MatrixEnvironment) => void
}) {
  return (
    <div className="sierra-matrix-table">
      <table className="text-[13px]">
        <colgroup>
          <col className="sierra-matrix-agent-col" />
          <col className="sierra-matrix-env-col" />
          <col className="sierra-matrix-env-col" />
          <col className="sierra-matrix-env-col" />
        </colgroup>
        <thead>
          <tr className="text-left">
            <th className="bg-[#fafafa] px-4 py-2.5 font-medium text-sierra-muted">Agents</th>
            {MATRIX_ENVIRONMENTS.map((env) => (
              <th key={env} className="bg-[#fafafa] px-3 py-2.5 text-center font-medium text-sierra-muted">{env}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2.5 font-semibold text-sierra-text">All agents</td>
            {MATRIX_ENVIRONMENTS.map((env) => (
              <td key={env} className="cursor-pointer px-3 py-2.5 text-center" onClick={() => onChange(env)}>
                <MatrixCheckbox
                  checked={matrix[env]}
                  onChange={() => onChange(env)}
                  label={`All agents ${env}`}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function PermissionMatrixTable({
  agents,
  matrix,
  isColumnFullyChecked,
  onToggleColumn,
  onToggleCell,
}: {
  agents: MatrixAgent[]
  matrix: PermissionMatrix
  isColumnFullyChecked: (environment: MatrixEnvironment, agents: MatrixAgent[]) => boolean
  onToggleColumn: (environment: MatrixEnvironment, agents: MatrixAgent[]) => void
  onToggleCell: (agent: MatrixAgent, environment: MatrixEnvironment) => void
}) {
  return (
    <div className="sierra-matrix-table">
      <table className="text-[13px]">
        <colgroup>
          <col className="sierra-matrix-agent-col" />
          <col className="sierra-matrix-env-col" />
          <col className="sierra-matrix-env-col" />
          <col className="sierra-matrix-env-col" />
        </colgroup>
        <thead>
          <tr className="text-left text-sierra-muted">
            <th className="bg-[#fafafa] px-4 py-2.5 font-medium text-sierra-muted">Agents</th>
            {MATRIX_ENVIRONMENTS.map((environment) => (
              <th key={environment} className="bg-[#fafafa] px-3 py-2.5 text-center font-medium">
                {environment}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2.5 font-semibold text-sierra-text">Select all</td>
            {MATRIX_ENVIRONMENTS.map((environment) => (
              <td key={environment} className="cursor-pointer px-3 py-2.5 text-center" onClick={() => onToggleColumn(environment, agents)}>
                <MatrixCheckbox
                  checked={isColumnFullyChecked(environment, agents)}
                  onChange={() => onToggleColumn(environment, agents)}
                  label={`Select all for ${environment}`}
                />
              </td>
            ))}
          </tr>
          {agents.map((agent) => (
            <tr key={agent}>
              <td className="px-4 py-2.5 font-semibold text-sierra-text">{agent}</td>
              {MATRIX_ENVIRONMENTS.map((environment) => (
                <td key={environment} className="cursor-pointer px-3 py-2.5 text-center" onClick={() => onToggleCell(agent, environment)}>
                  <MatrixCheckbox
                    checked={matrix[agent][environment]}
                    onChange={() => onToggleCell(agent, environment)}
                    label={`${agent} ${environment}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MatrixCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={`inline-flex h-4 w-4 items-center justify-center rounded border transition ${
        checked
          ? 'border-sierra-green bg-sierra-green text-white'
          : 'border-neutral-300 bg-white hover:border-neutral-400'
      }`}
    >
      {checked && <CheckIcon className="h-2.5 w-2.5" />}
    </button>
  )
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition ${
        checked ? 'bg-sierra-green' : 'bg-neutral-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M10 4L6 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M3.5 8.5l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
