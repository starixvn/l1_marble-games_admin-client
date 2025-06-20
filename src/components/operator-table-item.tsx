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
import { toast } from "sonner";

export interface OperatorTableItemProps extends React.HTMLAttributes<HTMLTableRowElement>  {
    operator: {
      id: string;
      name: string;
    }
}

export const OperatorTableItem = ({ operator }: OperatorTableItemProps) => {
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const { updateOperatorNameMutation, generatePasswordMutation } = useOperator();
    
    const handleRename = () => {
        setIsRenameDialogOpen(true);
    }

    const handleGeneratePassword = () => {
        generatePasswordMutation.reset();
        setIsPasswordDialogOpen(true);
    }

    const handleRenameSubmit = async (operatorId: string, newName: string) => {
      updateOperatorNameMutation.mutate({
        operatorId,
        name: newName,
      }, {
        onSuccess: () => {
          toast.success("Operator name updated successfully");
        },
        onError: (error: any) => {
          toast.error(error.message);
        }
      });
      setIsRenameDialogOpen(false);
    }

    const handlePasswordGenerateSubmit = async (operatorId: string) => {
      generatePasswordMutation.mutate({
        operatorId,
      }, {
        onSuccess: () => {
          toast.success("Password generated successfully");
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message ?? 
                              error?.message ??
                              "Failed to generate password. Please try again.";
          toast.error(errorMessage);
          handlePasswordDialogClose();
        }
      });
    }

    const handlePasswordDialogClose = () => {
      setIsPasswordDialogOpen(false);
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

          <OperatorPasswordDialog
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

const OperatorPasswordDialog = ({
  isOpen,
  onOpenChange,
  operator,
  onGeneratePassword,
  generatedPassword,
  isGenerating
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  operator: {
    id: string;
    name: string;
  }
  onGeneratePassword: (operatorId: string) => Promise<void>;
  generatedPassword?: string;
  isGenerating: boolean;
}) => {

  const handleGeneratePassword = async () => {
    await onGeneratePassword(operator.id);
  };

  const handleClose = () => {
    onOpenChange();
  };

  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(JSON.stringify(generatedPassword, null, 2));
      toast.success("Operator data copied to clipboard");
    }
  };

  const renderDialogContent = () => 
   {
    if (generatedPassword) {
      return (
        <div className="grid gap-3 my-4">
          <div className="flex gap-2 justify-center">
            <Button 
              type="button" 
              variant="outline" 
              onClick={copyToClipboard}
            >
              Copy operator data
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Make sure to save this password securely. It won't be shown again.
          </p>
        </div>
      );
    }

    return (
      <div className="text-center py-4">
        <Button 
          onClick={handleGeneratePassword} 
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Password"}
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate New Password</DialogTitle>
          <DialogDescription>
            Generate a new password for operator {operator.name} ({operator.id})
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          {renderDialogContent()}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>
              {generatedPassword ? "Done" : "Cancel"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}