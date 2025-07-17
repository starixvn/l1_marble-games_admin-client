import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export const CreateOperatorDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isCreating,
  createdOperator,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (name: string) => void
  isCreating: boolean
  createdOperator?: object
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const formObject = Object.fromEntries(formData) as { name: string }
    onSubmit(formObject.name)
  }

  const copyToClipboard = () => {
    if (createdOperator) {
      const operatorWithoutName = { ...createdOperator } as Record<string, unknown>
      delete operatorWithoutName.name
      navigator.clipboard.writeText(JSON.stringify(operatorWithoutName, null, 2))
      toast.success('Operator data copied to clipboard')
    }
  }

  const renderDialogContent = () => {
    if (createdOperator) {
      return (
        <div className="grid gap-3 my-4">
          <div className="flex gap-2 justify-center">
            <Button type="button" variant="outline" onClick={copyToClipboard}>
              Copy operator data
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Make sure to save this operator data securely. It won't be shown again.
          </p>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-3 my-4">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Enter operator name" required />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Operator'}
          </Button>
        </DialogFooter>
      </form>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{createdOperator ? 'Operator Created Successfully' : 'Create Operator'}</DialogTitle>
          <DialogDescription>
            {createdOperator ? `Operator has been created successfully` : 'Enter the name for the new operator'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">{renderDialogContent()}</div>

        {createdOperator && (
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Done</Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
