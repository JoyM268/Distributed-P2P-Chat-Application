import { useState } from "react";
import UserChat from "./pages/UserChat";
import HeroSection from "./pages/HeroSection";
import MainHeader from "./components/MainHeader";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LogoutWarning from "./components/LogoutWarning";
import AddPeers from "./components/AddPeers";
import { useAuth } from "./context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import usePresence from "./hooks/usePresence";
import { ref, set, serverTimestamp } from "firebase/database";
import { db } from "@/services/firebase"; // Adjust path as needed

function App() {
	const [option, setOption] = useState<"main" | "login" | "signup">("main");
	const [logoutWarning, setLogoutWarning] = useState<boolean>(false);
	const [addPeers, setAddPeers] = useState<boolean>(false);
	const { currentUser, authLoading } = useAuth();
	usePresence();

	function changeOption(newOption: "main" | "login" | "signup") {
		if (option !== newOption) {
			setOption(newOption);
		}
	}

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
			<div className="pt-40 text-center text-xl text-gray-700">
				Loading Application...
			</div>
		);
	}

	return (
		<>
			{currentUser && (
				<UserChat
					toggleLogoutWarning={toggleLogoutWarning}
					toggleAddPeers={toggleAddPeers}
				/>
			)}
			{!currentUser && (
				<div>
					<MainHeader option={option} changeOption={changeOption} />
					{option === "main" && <HeroSection />}
					{option === "login" && <Login />}
					{option === "signup" && <Signup />}
				</div>
			)}
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
