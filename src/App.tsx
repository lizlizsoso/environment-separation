import { useState } from 'react'
import { EditUserModal } from './components/EditUserModal'
import { PrototypePanel } from './components/PrototypePanel'
import type { RemoveRowVariant } from './types/prototype'

function App() {
  const [modalOpen, setModalOpen] = useState(true)
  const [removeVariant, setRemoveVariant] =
    useState<RemoveRowVariant>('row-control')

  return (
    <div className="min-h-screen bg-sierra-overlay">
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="max-w-md text-center text-[13px] text-sierra-muted">
          Sierra Edit User modal prototype — visual mock with local interactivity.
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
        removeVariant={removeVariant}
      />

      <PrototypePanel
        removeVariant={removeVariant}
        onRemoveVariantChange={setRemoveVariant}
      />
    </div>
  )
}

export default App
