import type { FriendProfile } from "@/types";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	Wifi,
	WifiOff,
} from "lucide-react";
import { useMemo } from "react";

function ChatHeader({
	toggleSidebar,
	sidebar,
	selectedUser,
	friends,
	selectUser,
}: {
	toggleSidebar: () => void;
	sidebar: boolean;
	selectedUser: string | null;
	friends: FriendProfile[];
	selectUser: (uid: string) => void;
}) {
	const friend = useMemo(() => {
		return friends.find((f) => f.uid === selectedUser);
	}, [friends, selectedUser]);

	return (
		<div className="flex justify-between py-2 border-b border-gray-400 px-3 sticky top-0 bg-white shrink-0 overflow-hidden">
			<div className="flex items-center gap-3">
				<div
					className="p-2 rounded-full hover:bg-gray-100 cursor-pointer sm:hidden"
					onClick={() => selectedUser && selectUser(selectedUser)}
				>
					<ArrowLeft className="text-gray-700" size={18} />
				</div>
				<div
					className="h-8 w-8 hover:border border-gray-400 cursor-pointer justify-center items-center rounded-lg sm:flex hidden"
					onClick={() => toggleSidebar()}
				>
					{sidebar ? <ChevronLeft /> : <ChevronRight />}
				</div>
				<div className="flex items-center gap-4">
					<Avatar
						className="w-10 h-10 border border-gray-400 text-gray-600 font-semibold select-none"
						key={friend?.status}
					>
						<AvatarFallback>
							{friend?.username &&
								friend.username.toLocaleUpperCase().charAt(0)}
						</AvatarFallback>
					</Avatar>

					<div className="flex flex-col gap-0.5">
						<span className="font-semibold text-gray-700">
							{friend?.username}
						</span>
						<span
							className={`flex text-xs ${
								friend?.status === "Online"
									? "text-green-600"
									: "text-red-600"
							} gap-1`}
						>
							{friend?.status === "Online" ? (
								<Wifi className="w-4 h-4" />
							) : (
								<WifiOff className="w-4 h-4" />
							)}
							{friend?.status}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChatHeader;
