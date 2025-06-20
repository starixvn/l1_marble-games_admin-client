import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const OperatorRenameDialog = ({
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
                <Label>Name</Label>
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