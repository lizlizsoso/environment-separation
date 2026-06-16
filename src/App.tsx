import { useState } from 'react'
import { EditUserModal } from './components/EditUserModal'
import { PrototypePanel } from './components/PrototypePanel'
import { UserDetailsPage } from './components/UserDetailsPage'
import { UsersOverviewPage } from './components/UsersOverviewPage'
import {
  isFullPageVariant,
  isRemoveRowVariant,
  type PrototypeVariant,
} from './types/prototype'

function App() {
  const [modalOpen, setModalOpen] = useState(true)
  const [variant, setVariant] = useState<PrototypeVariant>('overview-page')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const showOverview = variant === 'overview-page' && !selectedUser
  const showDetails =
    variant === 'details' ||
    (variant === 'overview-page' && selectedUser !== null)

  function handleVariantChange(nextVariant: PrototypeVariant) {
    setVariant(nextVariant)
    if (nextVariant !== 'overview-page') {
      setSelectedUser(null)
    }
  }

  function handleBackFromDetails() {
    setSelectedUser(null)
    if (variant === 'details') {
      setVariant('overview-page')
    }
  }

  return (
    <div
      className={
        isFullPageVariant(variant) || selectedUser
          ? 'min-h-screen'
          : 'min-h-screen bg-sierra-overlay'
      }
    >
      {showOverview && (
        <UsersOverviewPage
          onUserSelect={(name) => setSelectedUser(name)}
        />
      )}

      {showDetails && (
        <UserDetailsPage
          key={selectedUser ?? 'Wayne Fan'}
          fullName={selectedUser ?? 'Wayne Fan'}
          onBack={handleBackFromDetails}
        />
      )}

      {!showOverview && !showDetails && (
        <>
          <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
            <p className="max-w-md text-center text-[13px] text-sierra-muted">
              Sierra Edit User modal prototype — visual mock with local
              interactivity.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-md border border-sierra-border bg-white px-4 py-2 text-[13px] font-medium text-sierra-text shadow-sm hover:bg-neutral-50"
            >
              Open Edit user
            </button>
          </main>

          <EditUserModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            removeVariant={isRemoveRowVariant(variant) ? variant : 'row-control'}
          />
        </>
      )}

      <PrototypePanel
        variant={variant}
        onVariantChange={handleVariantChange}
      />
    </div>
  )
}

export default App
