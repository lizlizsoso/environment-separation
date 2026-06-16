import type { ReactNode } from 'react'

export function AppSidebar() {
  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-sierra-border bg-[#fafafa]">
      <div className="flex h-[66px] items-center border-b border-sierra-border px-4">
        <span className="text-[14px] font-semibold text-sierra-text">
          Agent Studio
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 text-[13px]">
        <SidebarSection title="Preferences">
          <SidebarItem>General</SidebarItem>
        </SidebarSection>

        <SidebarSection title="Administration">
          <SidebarItem>Agents</SidebarItem>
          <SidebarItem>Organization</SidebarItem>
          <SidebarItem active>Users and Roles</SidebarItem>
          <SidebarItem>API playground</SidebarItem>
          <SidebarItem>Organization playbook</SidebarItem>
          <SidebarItem>Secret upload links</SidebarItem>
        </SidebarSection>

        <SidebarSection title="Voice">
          <SidebarItem>Agents</SidebarItem>
          <SidebarItem>Organization</SidebarItem>
          <SidebarItem>Users and Roles</SidebarItem>
          <SidebarItem>API playground</SidebarItem>
          <SidebarItem>Organization playbook</SidebarItem>
          <SidebarItem>Inbound PSTN</SidebarItem>
        </SidebarSection>
      </nav>
    </aside>
  )
}

function SidebarSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="mb-4">
      <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wide text-sierra-muted">
        {title}
      </p>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  )
}

function SidebarItem({
  children,
  active = false,
}: {
  children: ReactNode
  active?: boolean
}) {
  return (
    <li>
      <span
        className={`block rounded-md px-2 py-1.5 ${
          active
            ? 'bg-neutral-200/70 font-medium text-sierra-text'
            : 'text-sierra-muted'
        }`}
      >
        {children}
      </span>
    </li>
  )
}
