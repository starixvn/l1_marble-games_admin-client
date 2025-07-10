import { toast } from 'sonner'
import type { Account } from '@/api/auth.api'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function CopyAccountData({
  account,
  onOpenChange,
}: Readonly<{
  account: Account
  onOpenChange: (open: boolean) => void
}>) {
  const copyToClipboard = () => {
    if (!account) return

    navigator.clipboard.writeText(JSON.stringify(account, null, 2))
    toast.success('Account data copied to clipboard')
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Account created successfully</DialogTitle>
        <DialogDescription>Account data copied to clipboard. Use it to login.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 my-4">
        <div className="flex gap-2 justify-center">
          <Button type="button" variant="outline" onClick={copyToClipboard}>
            Copy account data
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Make sure to save this operator data securely. It won't be shown again.
        </p>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogFooter>
    </>
  )
}
