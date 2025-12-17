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

function Sidebar({
	isOpen,
	selectUser,
	toggleLogoutWarning,
	selectedUser,
	loadingFriends,
	friends,
}: {
	isOpen: boolean;
	selectUser: (uid: string) => void;
	selectedUser: string | null;
	toggleLogoutWarning: () => void;
	loadingFriends: boolean;
	friends: FriendProfile[];
}) {
	const [username, setUsername] = useState<string>("");
	const { currentUser } = useAuth();
	const [discover, setDiscover] = useState<boolean>(true);
	const { requests, loading } = useFriendRequests(currentUser?.uid ?? null);

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
					<Avatar className="w-10 h-10 border border-gray-500 text-gray-600 font-semibold">
						<AvatarFallback>
							{username?.toLocaleUpperCase().charAt(0)}
						</AvatarFallback>
					</Avatar>

					<span className="font-semibold text-gray-700">
						{username}
					</span>
				</div>

				<div className="flex gap-2 items-center">
					<div
						className="rounded-full justify-center flex items-center hover:bg-gray-100 cursor-pointer p-2 relative"
						onClick={() => setDiscover((discover) => !discover)}
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
			{discover ? (
				<DiscoveredPeers
					selectUser={selectUser}
					selectedFriendId={selectedUser}
					friends={friends}
					loading={loadingFriends}
				/>
			) : (
				<RequestPeers loading={loading} requests={requests} />
			)}
		</motion.div>
	);
}

export default Sidebar;
