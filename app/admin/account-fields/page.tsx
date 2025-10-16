import { RoleBasedSidebar } from "@/components/role-based-sidebar"
import { Header } from "@/components/header"
import { AccountFieldsManager } from "@/components/account-fields-manager"
import { ProtectedRoute } from "@/components/protected-route"

export default function AccountFieldsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex h-screen bg-gray-50">
        <RoleBasedSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <AccountFieldsManager />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
