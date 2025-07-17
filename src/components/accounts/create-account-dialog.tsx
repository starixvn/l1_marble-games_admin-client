import type { Account, CreateAccountRequest } from '../../api/auth.api'
import { Dialog, DialogContent } from '../ui/dialog'
import { CopyAccountData } from './copy-account-data'
import { CreateAccountForm } from './create-account-form'

export function CreateAccountDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isCreating,
  createdAccount,
}: Readonly<{
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (request: CreateAccountRequest) => void
  isCreating: boolean
  createdAccount?: Account
}>) {
  const renderDialogContent = () => {
    if (createdAccount) {
      return <CopyAccountData account={createdAccount} onOpenChange={onOpenChange} />
    }

    return <CreateAccountForm onSubmit={onSubmit} isCreating={isCreating} onOpenChange={onOpenChange} />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>{renderDialogContent()}</DialogContent>
    </Dialog>
  )
}
