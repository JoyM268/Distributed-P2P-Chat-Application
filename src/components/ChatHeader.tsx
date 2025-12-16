import type { FriendProfile } from "@/types";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ChevronLeft, ChevronRight, Wifi, WifiOff } from "lucide-react";
import { useMemo } from "react";

function ChatHeader({
	toggleSidebar,
	sidebar,
	selectedUser,
	friends,
}: {
	toggleSidebar: () => void;
	sidebar: boolean;
	selectedUser: string | null;
	friends: FriendProfile[];
}) {
	const friend = useMemo(() => {
		return friends.find((f) => f.uid === selectedUser);
	}, [friends, selectedUser]);

	return (
		<div className="flex justify-between py-2 border-b border-gray-400 px-3 sticky top-0 bg-white shrink-0 overflow-hidden">
			<div className="flex items-center gap-3">
				<div
					className="h-8 w-8 hover:border border-gray-400 cursor-pointer flex justify-center items-center rounded-lg"
					onClick={() => toggleSidebar()}
				>
					{sidebar ? <ChevronLeft /> : <ChevronRight />}
				</div>
				<div className="flex items-center gap-4">
					<Avatar
						className="w-10 h-10 border border-gray-400 text-black"
						key={friend?.status}
					>
						<AvatarFallback className="text-black">
							{friend?.username &&
								friend.username.toLocaleUpperCase().charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col gap-0.5">
						<span className="font-semibold">
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
