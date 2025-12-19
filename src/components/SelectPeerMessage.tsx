import {
	MessagesSquare,
	UserRoundPlus,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

function SelectPeerMessage({
	sidebar,
	toggleSidebar,
	toggleAddPeers,
}: {
	sidebar: boolean;
	toggleSidebar(): void;
	toggleAddPeers(): void;
}) {
	return (
		<div className="w-full hidden sm:block bg-gray-100">
			<div className="flex justify-between py-3 border-b border-gray-400 px-3 sticky top-0 bg-white shrink-0">
				<div
					className="h-8 w-8 hover:border border-gray-400 cursor-pointer flex justify-center items-center rounded-lg"
					onClick={() => toggleSidebar()}
				>
					{sidebar ? <ChevronLeft /> : <ChevronRight />}
				</div>
			</div>
			<div className="flex justify-center items-center mt-28 flex-col gap-4">
				<div className="rounded-full bg-white p-10 flex justify-center items-center text-blue-600 border border-white shadow-md">
					<MessagesSquare size={60} />
				</div>
				<div className="flex flex-col items-center justify-center gap-4">
					<div className="flex flex-col items-center gap-1.5">
						<h1 className="font-semibold text-2xl">
							It's quite here...
						</h1>
						<p className="text-wrap text-gray-600 px-2 text-center">
							Pick a peer to chat with, or add a new one to start
							a conversation.
						</p>
					</div>
					<button
						className="flex gap-2 items-center bg-blue-500 px-3 py-3 text-white rounded-xl cursor-pointer hover:bg-blue-500/85"
						onClick={() => toggleAddPeers()}
					>
						<UserRoundPlus />
						Add Peers
					</button>
				</div>
			</div>
		</div>
	);
}

export default SelectPeerMessage;
