import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LogOut, UserRoundPlus, UserRoundSearch } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/services/firebase";
import { ref, get, child } from "firebase/database";
import DiscoveredPeers from "./DiscoveredPeers";
import HandlePeers from "./RequestPeers";
import type { FriendProfile } from "@/types";

function Sidebar({
	isOpen,
	selectUser,
	toggleLogoutWarning,
	selectedUser,
	loading,
	friends,
}: {
	isOpen: boolean;
	selectUser: (uid: string) => void;
	selectedUser: string | null;
	toggleLogoutWarning: () => void;
	loading: boolean;
	friends: FriendProfile[];
}) {
	const [username, setUsername] = useState<string>("");
	const { currentUser } = useAuth();
	const [discover, setDiscover] = useState<boolean>(true);

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

	return (
		<motion.div
			initial={false}
			animate={{ x: isOpen ? 0 : "-100%" }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			className="border-r border-gray-400 min-w-xs h-screen sticky left-0 flex flex-col overflow-hidden"
		>
			<div className="border-b border-gray-400 px-3 py-3 flex items-center justify-between">
				<div className="flex gap-3 items-center">
					<Avatar className="w-10 h-10 border border-gray-500 text-black">
						<AvatarFallback>
							{username?.toLocaleUpperCase().charAt(0)}
						</AvatarFallback>
					</Avatar>

					<span className="font-semibold">{username}</span>
				</div>

				<div className="flex gap-2 items-center">
					<div
						className="rounded-full justify-center flex items-center hover:bg-gray-100 cursor-pointer p-2"
						onClick={() => setDiscover((discover) => !discover)}
					>
						{discover ? (
							<UserRoundPlus size={20} />
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
			{discover ? (
				<DiscoveredPeers
					selectUser={selectUser}
					selectedFriendId={selectedUser}
					friends={friends}
					loading={loading}
				/>
			) : (
				<HandlePeers />
			)}
		</motion.div>
	);
}

export default Sidebar;
