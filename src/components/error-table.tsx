import { Button } from "./ui/button";

export function ErrorTable({
  onClick
}: Readonly<{
  onClick?: () => void
}>) {
  const handleTryAgain = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="text-center space-y-4">
        <p className="text-lg text-muted-foreground">
          Something went wrong
        </p>
        <Button 
          variant="outline" 
          onClick={handleTryAgain}
          className="text-foreground font-medium"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
