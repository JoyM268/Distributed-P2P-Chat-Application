import Messages from "./Messages";
import Send from "./Send";
import ChatHeader from "./ChatHeader";
import type { FriendProfile, WebRTCMessage } from "@/types";

function Chat({
	toggleSidebar,
	userMessage,
	sidebar,
	sendMessage,
	selectedUser,
	friends,
}: {
	toggleSidebar: () => void;
	userMessage: WebRTCMessage[];
	sidebar: boolean;
	sendMessage: (content: string) => void;
	selectedUser: string | null;
	friends: FriendProfile[];
}) {
	return (
		<div className="flex-1 h-screen relative flex flex-col overflow-hidden">
			<ChatHeader
				toggleSidebar={toggleSidebar}
				sidebar={sidebar}
				selectedUser={selectedUser}
				friends={friends}
			/>
			<Messages userMessage={userMessage} selectedUser={selectedUser} />
			<Send
				sendMessage={sendMessage}
				friends={friends}
				selectedUser={selectedUser}
			/>
		</div>
	);
}

export default Chat;
