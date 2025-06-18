import { Button } from "@/components/ui/button";
import { AuthContext } from "@/contexts/auth.context";
import { useCallback, useContext } from "react";
import type { UseAuthReturn } from "@/hooks/useAuth";

const HomePage = () => {
  const { handleLogout } = useContext(AuthContext) as UseAuthReturn;


  const handleLogoutClick = useCallback(() => {
    handleLogout();
  }, [handleLogout]);

  return (
    <div>
      <Button onClick={handleLogoutClick}>Logout</Button>
    </div>
  );
};

export default HomePage;
