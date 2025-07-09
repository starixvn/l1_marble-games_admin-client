import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { usePasswordGenerate } from '@/hooks/usePasswordGenerate'

interface ChangePasswordProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ChangePassword({ open, onOpenChange }: Readonly<ChangePasswordProps>) {
  const { isPending, mutate, data } = usePasswordGenerate()

  const handleGeneratePassword = () => mutate()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>Generate new password</DialogDescription>
        </DialogHeader>
        <ChangePasswordContent password={data?.password} isGenerating={isPending} handleGeneratePassword={handleGeneratePassword} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{data ? 'Done' : 'Cancel'}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ChangePasswordContent({
  password,
  isGenerating,
  handleGeneratePassword,
}: Readonly<{
  password?: string
  isGenerating: boolean
  handleGeneratePassword: () => void
}>) {

  if (password) {
    return <CopyPasswordToClipboard password={password} />
  }
  return <GeneratePassword handleGeneratePassword={handleGeneratePassword} isGenerating={isGenerating} />
}
function CopyPasswordToClipboard({ password }: Readonly<{ password: string }>) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    toast.success('Password copied to clipboard')
  }
  return (
    <div className="grid gap-3 my-4">
      <div className="flex gap-2 justify-center">
        <Button type="button" variant="outline" onClick={copyToClipboard}>
          Copy password
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Make sure to save this password securely. It won't be shown again.
      </p>
    </div>
  )
}

function GeneratePassword({
  handleGeneratePassword,
  isGenerating,
}: Readonly<{
  handleGeneratePassword: () => void
  isGenerating: boolean
}>) {
  return (
    <div className="text-center py-4">
      <Button onClick={handleGeneratePassword} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate Password'}
      </Button>
    </div>
  )
}