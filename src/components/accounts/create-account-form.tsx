import { Role, type CreateAccountRequest } from '@/api/auth.api'
import { Button } from '@/components/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function CreateAccountForm({
  onSubmit,
  isCreating,
  onOpenChange,
}: Readonly<{
  onSubmit: (request: CreateAccountRequest) => void
  isCreating: boolean
  onOpenChange: (open: boolean) => void
}>) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget) as Iterable<[CreateAccountRequest, FormDataEntryValue]>
    const request = Object.fromEntries(formData) as CreateAccountRequest
    onSubmit(request)
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Create Account</DialogTitle>
        <DialogDescription>Enter account username and role to create a new account</DialogDescription>
      </DialogHeader>
      <div className="grid gap-2 pb-4">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" placeholder="Enter username" required />
      </div>
      <div className="grid gap-2 pb-4">
        <Label htmlFor="role">Role</Label>
        <Select name="role" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Role).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create Account'}
        </Button>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogFooter>
    </form>
  )
}
