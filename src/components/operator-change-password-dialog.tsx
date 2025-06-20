import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";


export const OperatorChangePasswordDialog = ({
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