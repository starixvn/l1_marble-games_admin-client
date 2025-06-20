import { AdminLayout } from '@/components/layouts/admin-layot'

export default function Page() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-full">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-center ">
          Use the sidebar to navigate to start
        </h4>
      </div>
    </AdminLayout>
  )
}
