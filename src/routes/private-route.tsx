import { useContext } from "react";
import { AuthContext } from "@/contexts/auth.context";
import type { UseAuthReturn } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useContext(AuthContext) as UseAuthReturn;
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isLoading && !isAuthenticated) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} />;
    }

    return children;
}
