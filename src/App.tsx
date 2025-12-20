import { useState } from "react";
import UserChat from "./pages/UserChat";
import HeroSection from "./pages/HeroSection";
import MainHeader from "./components/MainHeader";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LogoutWarning from "./components/LogoutWarning";
import AddPeers from "./components/AddPeers";
import { useAuth } from "./hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import usePresence from "./hooks/usePresence";
import { ref, set, serverTimestamp } from "firebase/database";
import { db } from "@/services/firebase";
import { Spinner } from "./components/ui/spinner";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import Menu from "./components/Menu";
import { AnimatePresence } from "motion/react";
import { Toaster } from "./components/ui/sonner";

function App() {
	const [logoutWarning, setLogoutWarning] = useState<boolean>(false);
	const [addPeers, setAddPeers] = useState<boolean>(false);
	const { authLoading } = useAuth();
	const [menu, setMenu] = useState(false);
	usePresence();

	async function logout() {
		try {
			if (auth.currentUser) {
				const userStatusRef = ref(db, `status/${auth.currentUser.uid}`);

				await set(userStatusRef, {
					state: "Offline",
					last_changed: serverTimestamp(),
				});
			}
			await signOut(auth);
		} catch (error) {
			console.error("Error logging out:", error);
		}
	}

	function toggleLogoutWarning() {
		setLogoutWarning((logoutWarning) => !logoutWarning);
	}

	function toggleAddPeers() {
		setAddPeers((addPeers) => !addPeers);
	}

	if (authLoading) {
		return (
			<div className="flex h-full text-gray-700 gap-2 justify-center w-full items-center">
				<Spinner />
				<div>Loading...</div>
			</div>
		);
	}

	return (
		<>
			<Toaster
				position="top-center"
				toastOptions={{
					duration: 3000,
				}}
			/>
			<Routes>
				<Route element={<ProtectedRoutes />}>
					<Route
						path="/chat/:username?"
						element={
							<UserChat
								toggleLogoutWarning={toggleLogoutWarning}
								toggleAddPeers={toggleAddPeers}
							/>
						}
					/>
				</Route>
				<Route element={<PublicRoutes />}>
					<Route
						path="/"
						element={
							<>
								<MainHeader menu={menu} setMenu={setMenu} />
								<AnimatePresence>
									{menu && <Menu />}
								</AnimatePresence>
								<HeroSection setMenu={setMenu} />
							</>
						}
					/>
					<Route
						path="/login"
						element={
							<>
								<MainHeader menu={menu} setMenu={setMenu} />
								<AnimatePresence>
									{menu && <Menu />}
								</AnimatePresence>
								<Login setMenu={setMenu} />
							</>
						}
					/>
					<Route
						path="/signup"
						element={
							<>
								<MainHeader menu={menu} setMenu={setMenu} />
								<AnimatePresence>
									{menu && <Menu />}
								</AnimatePresence>
								<Signup setMenu={setMenu} />
							</>
						}
					/>
				</Route>
			</Routes>
			<LogoutWarning
				logoutWarning={logoutWarning}
				setLogoutWarning={setLogoutWarning}
				logout={logout}
			/>
			<AddPeers setAddPeers={setAddPeers} addPeers={addPeers} />
		</>
	);
}

export default App;
