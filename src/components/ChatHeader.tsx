import type { UserMessageInterface } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ChevronLeft, ChevronRight, Wifi, WifiOff } from "lucide-react";

function ChatHeader({
	toggleSidebar,
	userMessage,
	sidebar,
}: {
	toggleSidebar: () => void;
	userMessage: UserMessageInterface;
	sidebar: boolean;
}) {
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
						key={userMessage.img ?? userMessage.name}
					>
						{userMessage.img && (
							<AvatarImage
								src={userMessage.img}
								alt={userMessage.name}
							/>
						)}
						<AvatarFallback className="text-black">
							{userMessage.name.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col gap-0.5">
						<span className="font-semibold">
							{userMessage.name}
						</span>
						<span
							className={`flex text-xs ${
								userMessage.status === "Online"
									? "text-green-600"
									: "text-red-600"
							} gap-1`}
						>
							{userMessage.status === "Online" ? (
								<Wifi className="w-4 h-4" />
							) : (
								<WifiOff className="w-4 h-4" />
							)}
							{userMessage.status}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChatHeader;
