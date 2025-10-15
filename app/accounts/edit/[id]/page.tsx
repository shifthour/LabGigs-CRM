import { RoleBasedSidebar } from "@/components/role-based-sidebar"
import { Header } from "@/components/header"
import { DynamicEditAccountContent } from "@/components/dynamic-edit-account-content"

export default function EditAccountPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <RoleBasedSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <DynamicEditAccountContent accountId={params.id} />
        </main>
      </div>
    </div>
  )
}
