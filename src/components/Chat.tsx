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
	selectUser,
}: {
	toggleSidebar: () => void;
	userMessage: WebRTCMessage[];
	sidebar: boolean;
	sendMessage: (content: string) => void;
	selectedUser: string | null;
	friends: FriendProfile[];
	selectUser: (uid: string) => void;
}) {
	return (
		<div
			className={`flex-1 h-dvh relative flex-col overflow-hidden ${
				selectedUser === null ? "hidden :flex" : "flex"
			}`}
		>
			<ChatHeader
				toggleSidebar={toggleSidebar}
				sidebar={sidebar}
				selectedUser={selectedUser}
				friends={friends}
				selectUser={selectUser}
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
