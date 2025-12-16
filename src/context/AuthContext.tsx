import { useState, useEffect, createContext, useContext } from "react";
import { type User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";

interface AuthContextType {
	currentUser: User | null;
	authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [authLoading, setAuthLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setAuthLoading(false);
		});

		return unsubscribe;
	}, []);

	const value = { currentUser, authLoading };

	return (
		<AuthContext.Provider value={value}>
			{!authLoading && children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
