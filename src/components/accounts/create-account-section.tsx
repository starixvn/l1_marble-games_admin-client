import { useState } from 'react'
import { useCreateAccount } from '@/hooks/useAccounts'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CreateAccountDialog } from '@/components/accounts/create-account-dialog'
import type { CreateAccountRequest } from '@/api/auth.api'

export const CreateAccountSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { mutate, isPending, reset, data } = useCreateAccount()

  const handleCreateAccount = (request: CreateAccountRequest) => {
    mutate(request, {
      onSuccess: () => {
        toast.success('Account created successfully')
      },
      onError: () => {
        toast.error('Failed to create account')
      },
    })
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (open) {
      reset()
    }
  }

  return (
    <div className="md:pt-4 pr-2">
      <div className="flex justify-end">
        <Button onClick={() => handleDialogOpenChange(true)}>Create Account</Button>
      </div>
      <CreateAccountDialog
        isOpen={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleCreateAccount}
        isCreating={isPending}
        createdAccount={data}
      />
    </div>
  )
}
