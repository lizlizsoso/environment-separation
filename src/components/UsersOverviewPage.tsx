import { useState } from 'react'
import { AppSidebar } from './AppSidebar'

const USERS: { name: string; email: string }[] = [
  { name: 'Jessica Sun', email: 'jessica@sierra.ai' },
  { name: 'Jordan Katzen', email: 'jordan.katzen@sierra.ai' },
  { name: 'Kaila Fleisig', email: 'kaila@sierra.ai' },
  { name: 'Jordeen Chang', email: 'jordeen@sierra.ai' },
  { name: 'Niles Lawrence', email: 'niles@sierra.ai' },
  { name: 'Nathan Cross', email: 'nathan.cross@sierra.ai' },
  { name: 'Saksiri Tanphaichit', email: 'saksiri@sierra.ai' },
  { name: 'Wei Li', email: 'wei@sierra.ai' },
  { name: 'J Katzen', email: 'jkatzen8@gmail.com' },
  { name: 'Bot tester', email: 'weili.lenovo@gmail.com' },
  { name: 'Cole Bevis', email: 'cole@sierra.ai' },
  { name: 'Cole Bevis', email: 'cole@sierra.ai' },
  { name: 'Srinath Ananthakrishnan', email: 'srinath@sierra.ai' },
  { name: 'Michelle Lee', email: 'michelle.lee@sierra.ai' },
  { name: 'Andrew Kim', email: 'andrew.kim@sierra.ai' },
  { name: 'Wayne Fan', email: 'wayne@sierra.ai' },
]

const ROLE_COLUMNS = [
  'Admin',
  'Developer',
  'Agent Manager',
  'Content Editor',
  'Knowledge Manager',
] as const

const AGENT_NAMES = ['campfire', 'smoke', 'wood', 'fire'] as const

const ENVIRONMENT_PILLS = ['production', 'staging', 'test'] as const

type EnvironmentPill = (typeof ENVIRONMENT_PILLS)[number]

type EnvironmentAgents = Record<EnvironmentPill, string[]>

const ENV_TABS = ['All', 'Staging', 'Test', 'Production'] as const

type UserRow = {
  name: string
  email: string
  roleCells: Record<(typeof ROLE_COLUMNS)[number], EnvironmentAgents>
}

function hashSeed(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0
  }
  return Math.abs(hash)
}

function pickRandomAgents(seed: string, maxCount = 2): string[] {
  const hash = hashSeed(seed)
  const count = (hash % maxCount) + 1

  return [...AGENT_NAMES]
    .sort(
      (left, right) =>
        hashSeed(`${seed}-${left}`) - hashSeed(`${seed}-${right}`),
    )
    .slice(0, count)
}

function pickAgentsForCell(seed: string): EnvironmentAgents {
  const cellHash = hashSeed(seed)
  if (cellHash % 10 < 8) {
    return ENVIRONMENT_PILLS.reduce<EnvironmentAgents>(
      (acc, env) => ({ ...acc, [env]: [] }),
      {} as EnvironmentAgents,
    )
  }
  return ENVIRONMENT_PILLS.reduce<EnvironmentAgents>(
    (acc, env) => ({
      ...acc,
      [env]:
        hashSeed(`${seed}-${env}-skip`) % 5 < 2
          ? []
          : pickRandomAgents(`${seed}-${env}`, 3),
    }),
    {} as EnvironmentAgents,
  )
}

const USER_ROWS: UserRow[] = USERS.map(({ name, email }, userIndex) => {
  const roleCells = ROLE_COLUMNS.reduce<Record<(typeof ROLE_COLUMNS)[number], EnvironmentAgents>>(
    (acc, column, columnIndex) => ({
      ...acc,
      [column]: pickAgentsForCell(`${userIndex}-${columnIndex}-${name}`),
    }),
    {} as Record<(typeof ROLE_COLUMNS)[number], EnvironmentAgents>,
  )

  if (name === 'Wayne Fan') {
    roleCells.Admin = {
      production: ['wood', 'smoke'],
      staging: ['campfire', 'fire'],
      test: ['wood'],
    }
  }

  return { name, email, roleCells }
})

type UsersOverviewPageProps = {
  onUserSelect?: (name: string) => void
}

export function UsersOverviewPage({ onUserSelect }: UsersOverviewPageProps) {
  const [activeEnvTab, setActiveEnvTab] =
    useState<(typeof ENV_TABS)[number]>('All')

  return (
    <div className="flex min-h-screen bg-white">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader />
        <FilterBar
          activeEnvTab={activeEnvTab}
          onEnvTabChange={setActiveEnvTab}
        />
        <UsersTable rows={USER_ROWS} onUserSelect={onUserSelect} />
      </div>
    </div>
  )
}

function PageHeader() {
  return (
    <header className="flex items-center justify-between border-b border-sierra-border px-6 py-4">
      <h1 className="text-[15px] font-semibold text-sierra-text">User</h1>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-sierra-border bg-white px-3 py-1.5 text-[13px] text-sierra-text transition hover:bg-neutral-50"
        >
          <DownloadIcon className="h-3.5 w-3.5 text-sierra-muted" />
          Export CSV
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-sierra-border bg-white px-3 py-1.5 text-[13px] font-medium text-sierra-text transition hover:bg-neutral-50"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Add user
        </button>
      </div>
    </header>
  )
}

function FilterBar({
  activeEnvTab,
  onEnvTabChange,
}: {
  activeEnvTab: (typeof ENV_TABS)[number]
  onEnvTabChange: (tab: (typeof ENV_TABS)[number]) => void
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-sierra-border">
      <div className="flex items-center gap-2 px-6 pt-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sierra-muted" />
          <input
            type="search"
            placeholder="Search users"
            className="h-8 w-[200px] rounded-md border border-sierra-border pl-8 pr-3 text-[13px] text-sierra-text outline-none transition placeholder:text-sierra-muted focus:border-sierra-green focus:ring-2 focus:ring-sierra-green/20"
          />
        </div>
        <FilterSelect label="All people" />
        <FilterSelect label="All agents" />
      </div>
      <div className="flex items-center gap-3 px-6 pb-4">
        <span className="text-[13px] text-sierra-muted">Environment</span>
        <div className="flex items-center gap-1">
          {ENV_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onEnvTabChange(tab)}
              className={`rounded-md px-2.5 py-1 text-[13px] transition ${
                activeEnvTab === tab
                  ? 'bg-neutral-100 font-medium text-sierra-text'
                  : 'text-sierra-muted hover:text-sierra-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function FilterSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-sierra-border bg-white px-2.5 text-[13px] text-sierra-green transition hover:bg-neutral-50"
    >
      {label}
      <ChevronDownIcon className="h-3 w-3 text-sierra-muted" />
    </button>
  )
}

function UsersTable({
  rows,
  onUserSelect,
}: {
  rows: UserRow[]
  onUserSelect?: (name: string) => void
}) {
  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <table className="w-full min-w-[900px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-sierra-border text-left text-sierra-muted">
            <th className="sticky top-0 bg-[#fafafa] px-6 py-2.5 font-medium">
              Name
            </th>
            <th className="sticky top-0 bg-[#fafafa] px-3 py-2.5 font-medium">
              Email
            </th>
            {ROLE_COLUMNS.map((column) => (
              <th
                key={column}
                className="sticky top-0 bg-[#fafafa] px-3 py-2.5 text-center font-medium"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <UserTableRow
              key={`${row.name}-${index}`}
              row={row}
              onSelect={onUserSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function UserTableRow({
  row,
  onSelect,
}: {
  row: UserRow
  onSelect?: (name: string) => void
}) {
  return (
    <tr
      className={`group border-b border-sierra-border hover:bg-neutral-50/50 ${
        onSelect ? 'cursor-pointer' : ''
      }`}
      onClick={() => onSelect?.(row.name)}
    >
      <td className="px-6 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-sierra-text">{row.name}</span>
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex h-6 w-6 items-center justify-center rounded text-sierra-muted opacity-0 transition hover:bg-neutral-100 group-hover:opacity-100"
            aria-label={`Actions for ${row.name}`}
          >
            <MoreIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>

      <td
        className="px-3 py-2.5 text-sierra-muted"
        onClick={(event) => event.stopPropagation()}
      >
        {row.email}
      </td>

      {ROLE_COLUMNS.map((column) => (
        <td
          key={column}
          className="px-3 py-2.5"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex justify-center">
            <RoleCellIndicator agentsByEnvironment={row.roleCells[column]} />
          </div>
        </td>
      ))}
    </tr>
  )
}

function RoleCellIndicator({
  agentsByEnvironment,
}: {
  agentsByEnvironment: EnvironmentAgents
}) {
  const envsWithAgents = ENVIRONMENT_PILLS.filter(
    (env) => agentsByEnvironment[env].length > 0,
  )
  const total = ENVIRONMENT_PILLS.length
  const assigned = envsWithAgents.length

  if (assigned === 0) return null

  const isFull = assigned === total
  const uniqueAgents = new Set(
    envsWithAgents.flatMap((env) => agentsByEnvironment[env]),
  ).size
  const tooltip = isFull ? 'All agents' : `${uniqueAgents} agent${uniqueAgents === 1 ? '' : 's'}`

  return (
    <div className="group/tip relative inline-flex">
      {isFull ? (
        <FullCheckIcon className="h-4 w-4 text-sierra-green" />
      ) : (
        <HalfCheckIcon className="h-4 w-4 text-sierra-green" />
      )}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-800 px-2 py-1 text-[12px] text-white opacity-0 transition-opacity group-hover/tip:opacity-100">
        {tooltip}
      </div>
    </div>
  )
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M8 2v8M5 7l3 3 3-3M3 12h10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M8 3v10M3 8h10" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="7" cy="7" r="4" />
      <path d="M10 10l3 3" strokeLinecap="round" />
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

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="3" cy="8" r="1.25" />
      <circle cx="8" cy="8" r="1.25" />
      <circle cx="13" cy="8" r="1.25" />
    </svg>
  )
}

function FullCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path
        d="M4.5 8.5l2.5 2.5 4.5-5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HalfCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13.2002 7.99995C13.2002 5.12807 10.8721 2.79995 8.0002 2.79995C5.12832 2.79995 2.8002 5.12807 2.8002 7.99995C2.8002 10.8719 5.12831 13.2 8.0002 13.2C10.8721 13.2 13.2002 10.8719 13.2002 7.99995ZM14.8002 7.99995C14.8002 11.7555 11.7558 14.8 8.0002 14.8C4.24466 14.8 1.2002 11.7555 1.2002 7.99995C1.2002 4.24442 4.24466 1.19995 8.0002 1.19995C11.7558 1.19995 14.8002 4.24442 14.8002 7.99995Z"
        fill="currentColor"
      />
      <path
        d="M8 4C8.52529 4 9.04543 4.10346 9.53073 4.30448C10.016 4.5055 10.457 4.80014 10.8284 5.17157C11.1999 5.54301 11.4945 5.98396 11.6955 6.46927C11.8965 6.95457 12 7.47471 12 8C12 8.52529 11.8965 9.04543 11.6955 9.53073C11.4945 10.016 11.1999 10.457 10.8284 10.8284C10.457 11.1999 10.016 11.4945 9.53073 11.6955C9.04543 11.8965 8.52529 12 8 12L8 8L8 4Z"
        fill="currentColor"
      />
    </svg>
  )
}
