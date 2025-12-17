import { useAuth } from "@/hooks/useAuth";
import { Outlet, Navigate } from "react-router-dom";

export default function PublicRoutes() {
	const { currentUser } = useAuth();

	return currentUser === null ? <Outlet /> : <Navigate to="/chat" replace />;
}
