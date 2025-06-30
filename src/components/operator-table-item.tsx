import { IconDotsVertical } from '@tabler/icons-react'
import { DropdownMenuContent, DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useOperator } from '../hooks/useOperator'
import { toast } from 'sonner'
import { OperatorRenameDialog } from '@/components/operator-rename-dialog'
import { OperatorChangePasswordDialog } from '@/components/operator-change-password-dialog'
import type { AxiosError } from 'axios'

export interface OperatorTableItemProps extends React.HTMLAttributes<HTMLTableRowElement> {
  operator: {
    id: string
    name: string
  }
}

export const OperatorTableItem = ({ operator }: OperatorTableItemProps) => {
  const { updateOperatorNameMutation, generatePasswordMutation } = useOperator()
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  const handleRename = () => {
    setIsRenameDialogOpen(true)
  }

  const handleGeneratePassword = () => {
    generatePasswordMutation.reset()
    setIsPasswordDialogOpen(true)
  }

  const handleRenameSubmit = async (operatorId: string, newName: string) => {
    updateOperatorNameMutation.mutate(
      {
        operatorId,
        name: newName,
      },
      {
        onSuccess: () => {
          toast.success('Operator name updated successfully')
        },
        onError: (error: unknown) => {
          toast.error((error as Error).message)
        },
      },
    )
    setIsRenameDialogOpen(false)
  }

  const handlePasswordGenerateSubmit = async (operatorId: string) => {
    generatePasswordMutation.mutate(
      {
        operatorId,
      },
      {
        onSuccess: () => {
          toast.success('Password generated successfully')
        },
        onError: (error: unknown) => {
          const errorMessage =
            (error as AxiosError<{ message?: string }>).response?.data?.message ??
            (error as Error).message ??
            'Failed to generate password. Please try again.'
          toast.error(errorMessage)
          handlePasswordDialogClose()
        },
      },
    )
  }

  const handlePasswordDialogClose = () => {
    setIsPasswordDialogOpen(false)
  }

  return (
    <TableRow key={operator.id}>
      <TableCell className="px-6">{operator.id}</TableCell>
      <TableCell className="px-6">{operator.name}</TableCell>
      <TableCell className="flex justify-end px-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleRename}>Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={handleGeneratePassword}>Get new password</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>

      <OperatorRenameDialog
        isOpen={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        operator={operator}
        onSubmit={handleRenameSubmit}
      />
      <OperatorChangePasswordDialog
        isOpen={isPasswordDialogOpen}
        onOpenChange={handlePasswordDialogClose}
        operator={operator}
        onGeneratePassword={handlePasswordGenerateSubmit}
        generatedPassword={generatePasswordMutation.data?.data}
        isGenerating={generatePasswordMutation.isPending}
      />
    </TableRow>
  )
}
