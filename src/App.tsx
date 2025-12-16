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

function App() {
	const [option, setOption] = useState<"main" | "login" | "signup">("main");
	const [logoutWarning, setLogoutWarning] = useState<boolean>(false);
	const [addPeers, setAddPeers] = useState<boolean>(false);
	const { currentUser, authLoading } = useAuth();

	function changeOption(newOption: "main" | "login" | "signup") {
		if (option !== newOption) {
			setOption(newOption);
		}
	}

	async function logout() {
		try {
			await signOut(auth);
		} catch (err) {
			console.log(err);
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
