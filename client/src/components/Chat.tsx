import type { UserMessageInterface } from "@/types";
import Messages from "./Messages";
import Send from "./Send";
import ChatHeader from "./ChatHeader";

function Chat({
	toggleSidebar,
	userMessage,
	sidebar,
	sendMessage,
}: {
	toggleSidebar: () => void;
	userMessage: UserMessageInterface;
	sidebar: boolean;
	sendMessage: (content: string) => void;
}) {
	return (
		<div className="flex-1 h-screen relative flex flex-col overflow-hidden">
			<ChatHeader
				toggleSidebar={toggleSidebar}
				userMessage={userMessage}
				sidebar={sidebar}
			/>
			<Messages userMessage={userMessage} />
			<Send sendMessage={sendMessage} />
		</div>
	);
}

export default Chat;
