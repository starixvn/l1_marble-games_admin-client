import { IconDotsVertical } from "@tabler/icons-react";
import { DropdownMenuContent, DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { TableCell, TableRow } from "./ui/table";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { useOperator } from "../hooks/useOperator";

export interface OperatorTableItemProps extends React.HTMLAttributes<HTMLTableRowElement>  {
    operator: {
      id: string;
      name: string;
    }
}

export const OperatorTableItem = ({ operator }: OperatorTableItemProps) => {
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const { updateOperatorNameMutation } = useOperator();
    const handleRename = () => {
        setIsRenameDialogOpen(true);
    }

    const handleRenameSubmit = async (operatorId: string, newName: string) => {
      await updateOperatorNameMutation.mutateAsync({
        operatorId,
        name: newName,
      });
      setIsRenameDialogOpen(false);
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
                <DropdownMenuItem>Get new password</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
          
          <OperatorRenameDialog
            isOpen={isRenameDialogOpen}
            onOpenChange={setIsRenameDialogOpen}
            operator={operator}
            onSubmit={handleRenameSubmit}
          />
        </TableRow>
    )
}

const OperatorRenameDialog = ({
  isOpen,
  onOpenChange,
  operator,
  onSubmit
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  operator: {
    id: string;
    name: string;
  }
  onSubmit: (operatorId: string, newName: string) => void;
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formObject = Object.fromEntries(formData) as { operatorId: string; name: string };
    onSubmit(formObject.operatorId, formObject.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename Operator</DialogTitle>
            <DialogDescription>
              Change the name for operator {operator.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 my-4">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name" 
              />
              <Input 
                type="hidden" 
                name="operatorId" 
                value={operator.id} 
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}