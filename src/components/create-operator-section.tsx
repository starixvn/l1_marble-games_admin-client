import { Button } from '@/components/ui/button'
import { CreateOperatorDialog } from './create-operator-dialog'
import { useState } from 'react'
import { useOperator } from '../hooks/useOperator'
import { toast } from 'sonner'

export const CreateOperatorSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { createOperatorMutation } = useOperator()

  const handleCreateOperator = (name: string) => {
    createOperatorMutation.mutate(
      { name },
      {
        onSuccess: () => {
          toast.success('Operator created successfully')
        },
        onError: () => {
          toast.error('Failed to create operator')
        },
      },
    )
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (open) {
      createOperatorMutation.reset()
    }
  }

  return (
    <div className="@container/main">
      <div className="md:pt-4 pr-2">
        <div className="flex justify-end">
          <Button onClick={() => handleDialogOpenChange(true)}>Create Operator</Button>
        </div>
      </div>
      <CreateOperatorDialog
        isOpen={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleCreateOperator}
        isCreating={createOperatorMutation.isPending}
        createdOperator={createOperatorMutation.data?.data}
      />
    </div>
  )
}
