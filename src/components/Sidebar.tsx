import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LogOut, UserRoundPlus, UserRoundSearch } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/services/firebase";
import { ref, get, child } from "firebase/database";
import DiscoveredPeers from "./DiscoveredPeers";
import type { FriendProfile } from "@/types";
import useFriendRequests from "@/hooks/useFriendRequests";
import RequestPeers from "./RequestPeers";

function useIsDesktop() {
	const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 640);
	useEffect(() => {
		const check = () => setIsDesktop(window.innerWidth >= 640);
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);
	return isDesktop;
}

function Sidebar({
	isOpen,
	selectUser,
	toggleLogoutWarning,
	selectedUser,
	loadingFriends,
	friends,
	toggleAddPeers,
}: {
	isOpen: boolean;
	selectUser: (uid: string) => void;
	selectedUser: string | null;
	toggleLogoutWarning: () => void;
	loadingFriends: boolean;
	friends: FriendProfile[];
	toggleAddPeers: () => void;
}) {
	const [username, setUsername] = useState<string>("");
	const { currentUser } = useAuth();
	const [discover, setDiscover] = useState<boolean>(true);
	const { requests, loading } = useFriendRequests(currentUser?.uid ?? null);
	const isDesktop = useIsDesktop();

	useEffect(() => {
		if (currentUser) {
			const uid = currentUser.uid;
			const dbRef = ref(db);
			get(child(dbRef, `users/${uid}`)).then((snapshot) => {
				const userData = snapshot.val();
				setUsername(userData?.username);
			});
		}
	}, [currentUser]);

	const sidebarWidth = isDesktop ? (isOpen ? "20rem" : "0rem") : "100%";

	return (
		<motion.div
			initial={false}
			animate={{
				width: sidebarWidth,
				opacity: isDesktop && !isOpen ? 0 : 1,
			}}
			transition={{ duration: 0.3, ease: "easeInOut" }}
			className={`border-r border-gray-400 h-screen sticky left-0 flex-col overflow-hidden bg-white z-20 shrink-0 ${
				selectedUser ? "hidden sm:flex" : "flex w-full sm:w-auto"
			}`}
		>
			<div
				className={`flex flex-col h-full ${
					isDesktop ? "w-80 min-w-[20rem]" : "w-full"
				}`}
			>
				<div className="border-b border-gray-400 px-3 py-3 flex items-center justify-between shrink-0">
					<div className="flex gap-3 items-center">
						<Avatar className="w-10 h-10 border border-gray-500 text-gray-600 font-semibold select-none">
							<AvatarFallback>
								{username?.toLocaleUpperCase().charAt(0)}
							</AvatarFallback>
						</Avatar>
						<span className="font-semibold text-gray-700 truncate max-w-[100px]">
							{username}
						</span>
					</div>

					<div className="flex gap-2 items-center">
						<div
							className="rounded-full justify-center flex items-center hover:bg-gray-100 cursor-pointer p-2 relative"
							onClick={() => setDiscover((prev) => !prev)}
						>
							{discover ? (
								<>
									{requests.length !== 0 && (
										<div className="px-1 absolute bg-red-500 rounded-full z-30 bottom-1 right-1 text-[0.6rem] text-white font-semibold">
											{requests.length}
										</div>
									)}
									<UserRoundPlus size={20} />
								</>
							) : (
								<UserRoundSearch size={20} />
							)}
						</div>
						<div
							className="rounded-full justify-center flex items-center hover:bg-gray-100 cursor-pointer p-2"
							onClick={() => toggleLogoutWarning()}
						>
							<LogOut size={20} />
						</div>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto w-full">
					{discover ? (
						<DiscoveredPeers
							selectUser={selectUser}
							selectedFriendId={selectedUser}
							friends={friends}
							loading={loadingFriends}
							toggleAddPeers={toggleAddPeers}
						/>
					) : (
						<RequestPeers loading={loading} requests={requests} />
					)}
				</div>
			</div>
		</motion.div>
	);
}

export default Sidebar;
