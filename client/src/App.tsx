import { useState } from "react";
import UserChat from "./pages/UserChat";
import HeroSection from "./pages/HeroSection";
import MainHeader from "./components/MainHeader";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LogoutWarning from "./components/LogoutWarning";
import AddPeers from "./components/AddPeers";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
	const [option, setOption] = useState<"main" | "login" | "signup">("main");
	const [logoutWarning, setLogoutWarning] = useState<boolean>(false);
	const [addPeers, setAddPeers] = useState<boolean>(false);

	function changeOption(newOption: "main" | "login" | "signup") {
		if (option !== newOption) {
			setOption(newOption);
		}
	}

	function logout() {
		setIsAuthenticated(false);
	}

	function toggleLogoutWarning() {
		setLogoutWarning((logoutWarning) => !logoutWarning);
	}

	function toggleAddPeers() {
		setAddPeers((addPeers) => !addPeers);
	}

	return (
		<>
			{isAuthenticated && (
				<UserChat
					toggleLogoutWarning={toggleLogoutWarning}
					toggleAddPeers={toggleAddPeers}
				/>
			)}
			{!isAuthenticated && (
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
