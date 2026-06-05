import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { RemoveRowVariant } from '../types/prototype'

const ROLE_OPTIONS = [
  'Admin',
  'Developer',
  'Content Editor',
  'Conversation Reader',
  'Agent Manager',
  'Masked Data Revealer',
  'QA',
  'Default',
]

const AGENT_OPTIONS = ['andy', 'campfire', 'wood', 'smoke', 'fire', 'agent']

const ENVIRONMENT_OPTIONS = ['Production', 'Staging', 'Test']

const MENU_ADVANCE_MS = 160

export type RoleAssignment = {
  id: string
  role: string | null
  agents: string[]
  environments: string[]
}

type RoleAssignmentsProps = {
  assignments: RoleAssignment[]
  onChange: (assignments: RoleAssignment[]) => void
  removeVariant: RemoveRowVariant
}

type Column = 'role' | 'agents' | 'environments'

type ActiveMenu = {
  assignmentId: string
  column: Column
} | null

export function RoleAssignments({
  assignments,
  onChange,
  removeVariant,
}: RoleAssignmentsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const advanceTimeoutRef = useRef<number | null>(null)
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null)

  function clearAdvanceTimeout() {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current)
      advanceTimeoutRef.current = null
    }
  }

  function advanceMenu(assignmentId: string, column: Column) {
    clearAdvanceTimeout()
    setActiveMenu(null)
    advanceTimeoutRef.current = window.setTimeout(() => {
      setActiveMenu({ assignmentId, column })
      advanceTimeoutRef.current = null
    }, MENU_ADVANCE_MS)
  }

  useEffect(() => () => clearAdvanceTimeout(), [])

  const hasIncompleteRow = assignments.some(
    (assignment) =>
      !assignment.role ||
      assignment.agents.length === 0 ||
      assignment.environments.length === 0,
  )

  useEffect(() => {
    if (!activeMenu) return

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveMenu(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [activeMenu])

  function updateAssignment(
    id: string,
    patch: Partial<Pick<RoleAssignment, 'role' | 'agents' | 'environments'>>,
  ) {
    onChange(
      assignments.map((assignment) =>
        assignment.id === id ? { ...assignment, ...patch } : assignment,
      ),
    )
  }

  function openMenu(assignmentId: string, column: Column) {
    const assignment = assignments.find((item) => item.id === assignmentId)
    if (!assignment) return

    if (column === 'agents' && !assignment.role) return
    if (column === 'environments' && assignment.agents.length === 0) return

    setActiveMenu({ assignmentId, column })
  }

  function removeRow(assignmentId: string) {
    onChange(assignments.filter((assignment) => assignment.id !== assignmentId))
    if (activeMenu?.assignmentId === assignmentId) {
      setActiveMenu(null)
    }
  }

  function addRow() {
    const id = crypto.randomUUID()
    onChange([
      ...assignments,
      { id, role: null, agents: [], environments: [] },
    ])
    setActiveMenu({ assignmentId: id, column: 'role' })
  }

  function isIncomplete(assignment: RoleAssignment) {
    return (
      !assignment.role ||
      assignment.agents.length === 0 ||
      assignment.environments.length === 0
    )
  }

  function handleRoleSelect(assignmentId: string, role: string) {
    const assignment = assignments.find((item) => item.id === assignmentId)
    if (!assignment) return

    updateAssignment(assignmentId, { role })
    const next = { ...assignment, role }

    if (isIncomplete(next)) {
      advanceMenu(assignmentId, 'agents')
    } else {
      clearAdvanceTimeout()
      setActiveMenu(null)
    }
  }

  function handleAgentSelect(assignmentId: string, agent: string) {
    const assignment = assignments.find((item) => item.id === assignmentId)
    if (!assignment) return

    updateAssignment(assignmentId, { agents: [agent] })
    const next = { ...assignment, agents: [agent] }

    if (isIncomplete(next)) {
      advanceMenu(assignmentId, 'environments')
    } else {
      clearAdvanceTimeout()
      setActiveMenu(null)
    }
  }

  function handleEnvironmentToggle(assignmentId: string, environment: string) {
    const assignment = assignments.find((item) => item.id === assignmentId)
    if (!assignment) return

    const environments = assignment.environments.includes(environment)
      ? assignment.environments.filter((item) => item !== environment)
      : [...assignment.environments, environment]

    updateAssignment(assignmentId, { environments })
  }

  function getMenuOptions(column: Column): string[] {
    switch (column) {
      case 'role':
        return ROLE_OPTIONS
      case 'agents':
        return AGENT_OPTIONS
      case 'environments':
        return ENVIRONMENT_OPTIONS
    }
  }

  function getSelected(column: Column, assignment: RoleAssignment): string[] {
    switch (column) {
      case 'role':
        return assignment.role ? [assignment.role] : []
      case 'agents':
        return assignment.agents
      case 'environments':
        return assignment.environments
    }
  }

  function handleOptionSelect(
    assignmentId: string,
    column: Column,
    option: string,
  ) {
    switch (column) {
      case 'role':
        handleRoleSelect(assignmentId, option)
        break
      case 'agents':
        handleAgentSelect(assignmentId, option)
        break
      case 'environments':
        handleEnvironmentToggle(assignmentId, option)
        break
    }
  }

  const rowGridClass =
    removeVariant === 'row-control'
      ? 'grid grid-cols-[1fr_1fr_1fr_1.75rem] gap-4'
      : 'grid grid-cols-3 gap-4'

  return (
    <div ref={containerRef} className="relative space-y-0">
      <div
        className={`${rowGridClass} border-b border-sierra-border pb-2`}
      >
        <ColumnHeader>Roles</ColumnHeader>
        <ColumnHeader>Agents with this role</ColumnHeader>
        <ColumnHeader>Environment</ColumnHeader>
        {removeVariant === 'row-control' && <span className="sr-only">Remove</span>}
      </div>

      {assignments.map((assignment, index) => {
        const rowMenuOpen = activeMenu?.assignmentId === assignment.id

        return (
        <div
          key={assignment.id}
          className={`${rowGridClass} sierra-row-enter py-3 ${
            rowMenuOpen ? 'relative z-50' : 'relative z-0'
          } ${
            index < assignments.length - 1
              ? 'border-b border-sierra-border'
              : ''
          }`}
        >
          <SelectCell
            label="Roles"
            value={assignment.role}
            placeholder="Select role"
            disabled={false}
            isOpen={
              activeMenu?.assignmentId === assignment.id &&
              activeMenu.column === 'role'
            }
            onOpen={() => openMenu(assignment.id, 'role')}
          >
            {activeMenu?.assignmentId === assignment.id &&
              activeMenu.column === 'role' && (
                <PickerMenu
                  label="Roles"
                  options={getMenuOptions('role')}
                  selected={getSelected('role', assignment)}
                  onSelect={(option) =>
                    handleOptionSelect(assignment.id, 'role', option)
                  }
                  showInfo
                  onRemove={
                    removeVariant === 'cell-clear'
                      ? () => removeRow(assignment.id)
                      : undefined
                  }
                />
              )}
          </SelectCell>

          <SelectCell
            label="Agents with this role"
            value={
              assignment.agents.length > 0
                ? assignment.agents.join(', ')
                : null
            }
            placeholder="Select agent"
            disabled={!assignment.role}
            isOpen={
              activeMenu?.assignmentId === assignment.id &&
              activeMenu.column === 'agents'
            }
            onOpen={() => openMenu(assignment.id, 'agents')}
          >
            {activeMenu?.assignmentId === assignment.id &&
              activeMenu.column === 'agents' && (
                <PickerMenu
                  label="Agents with this role"
                  options={getMenuOptions('agents')}
                  selected={getSelected('agents', assignment)}
                  onSelect={(option) =>
                    handleOptionSelect(assignment.id, 'agents', option)
                  }
                />
              )}
          </SelectCell>

          <SelectCell
            label="Environment"
            value={
              assignment.environments.length > 0
                ? assignment.environments.join(', ')
                : null
            }
            placeholder="Select environment"
            disabled={assignment.agents.length === 0}
            isOpen={
              activeMenu?.assignmentId === assignment.id &&
              activeMenu.column === 'environments'
            }
            onOpen={() => openMenu(assignment.id, 'environments')}
          >
            {activeMenu?.assignmentId === assignment.id &&
              activeMenu.column === 'environments' && (
                <PickerMenu
                  label="Environment"
                  options={getMenuOptions('environments')}
                  selected={getSelected('environments', assignment)}
                  onSelect={(option) =>
                    handleOptionSelect(assignment.id, 'environments', option)
                  }
                />
              )}
          </SelectCell>

          {removeVariant === 'row-control' && (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeRow(assignment.id)}
                className="inline-flex h-7 w-7 items-center justify-center rounded text-sierra-muted transition hover:bg-neutral-100 hover:text-sierra-text"
                aria-label="Remove role assignment"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
        )
      })}

      <button
        type="button"
        onClick={addRow}
        disabled={hasIncompleteRow}
        className={`relative z-0 w-full rounded-md border border-sierra-border px-3 py-2.5 text-left text-[13px] text-sierra-muted transition hover:border-neutral-300 hover:text-sierra-text disabled:cursor-not-allowed disabled:opacity-50 ${
          assignments.length === 0 ? 'mt-3' : ''
        }`}
      >
        Select role
      </button>
    </div>
  )
}

function ColumnHeader({ children }: { children: ReactNode }) {
  return (
    <span className="text-[13px] font-medium text-sierra-text">{children}</span>
  )
}

type SelectCellProps = {
  label: string
  value: string | null
  placeholder: string
  disabled: boolean
  isOpen: boolean
  onOpen: () => void
  children: ReactNode
}

function SelectCell({
  label,
  value,
  placeholder,
  disabled,
  isOpen,
  onOpen,
  children,
}: SelectCellProps) {
  const filled = Boolean(value)

  return (
    <div className={`relative ${isOpen ? 'z-50' : ''}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={onOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={filled ? `${label}: ${value}` : placeholder}
        className={`w-full rounded-md border px-3 py-2 text-left text-[13px] transition-[color,background-color,border-color,box-shadow,opacity] duration-200 ease-out ${
          disabled
            ? 'cursor-not-allowed border-sierra-border bg-sierra-input-disabled text-sierra-muted'
            : filled
              ? 'border-sierra-border bg-white font-medium text-sierra-green hover:border-neutral-300'
              : 'border-sierra-border bg-white text-sierra-muted hover:border-neutral-300 hover:text-sierra-text'
        } ${isOpen ? 'border-sierra-green ring-2 ring-sierra-green/20' : ''}`}
      >
        <span
          key={value ?? placeholder}
          className="block transition-opacity duration-200 ease-out"
        >
          {value ?? placeholder}
        </span>
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 isolate">
          <div className="sierra-menu-enter">{children}</div>
        </div>
      )}
    </div>
  )
}

type PickerMenuProps = {
  label: string
  options: string[]
  selected: string[]
  onSelect: (value: string) => void
  showInfo?: boolean
  onRemove?: () => void
}

function PickerMenu({
  label,
  options,
  selected,
  onSelect,
  showInfo = false,
  onRemove,
}: PickerMenuProps) {
  const listboxId = useId()

  return (
    <div
      role="listbox"
      id={listboxId}
      aria-label={label}
      className="relative z-50 max-h-56 overflow-auto rounded-lg border border-sierra-border bg-white py-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
    >
      <ul>
        {options.map((option) => {
          const isSelected = selected.includes(option)
          return (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] text-sierra-text transition-colors duration-150 ease-out hover:bg-neutral-50"
                onClick={() => onSelect(option)}
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {isSelected && (
                    <span className="sierra-check-pop">
                      <CheckIcon />
                    </span>
                  )}
                </span>
                <span className="flex-1">{option}</span>
                {showInfo && <InfoIcon className="shrink-0 text-sierra-muted" />}
              </button>
            </li>
          )
        })}
      </ul>
      {onRemove && (
        <>
          <div className="my-1 border-t border-sierra-border" />
          <button
            type="button"
            className="w-full px-4 py-2 text-left text-[13px] text-red-600 hover:bg-red-50"
            onClick={onRemove}
          >
            Remove role assignment
          </button>
        </>
      )}
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 7v4M8 5.5v.01" strokeLinecap="round" />
    </svg>
  )
}
