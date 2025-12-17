import { useAuth } from "@/hooks/useAuth";
import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoutes() {
	const { currentUser } = useAuth();

	return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}
