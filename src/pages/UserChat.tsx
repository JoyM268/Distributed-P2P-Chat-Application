import { AnimatePresence } from "motion/react";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import SelectPeerMessage from "@/components/SelectPeerMessage";
import { useState } from "react";
import type { UserMessageInterface } from "@/types";
import { messageData } from "@/data/dummy";

export default function UserChat({
	toggleLogoutWarning,
	toggleAddPeers,
}: {
	toggleLogoutWarning: () => void;
	toggleAddPeers: () => void;
}) {
	const [sidebar, setSidebar] = useState<boolean>(true);
	const [selectedUser, setSelectedUser] = useState<string | null>(null);
	const [userMessage, setUserMessage] = useState<UserMessageInterface | null>(
		null
	);

	function toggleSidebar() {
		setSidebar((sidebar) => !sidebar);
	}

	function selectUser(uid: string) {
		if (selectedUser && selectedUser === uid) {
			setSelectedUser(null);
			setUserMessage(null);
			return;
		}
		setSelectedUser(uid);
		setUserMessage(messageData.find((u) => u.uid === uid) || null);
	}

	function sendMessage(content: string) {
		const now = new Date();

		const timeString = now.toLocaleString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});

		const newMessage = {
			sent: true,
			content,
			time: timeString,
		};

		setUserMessage((prev) => {
			if (!prev) return prev;

			return {
				...prev,
				message: [...prev.message, newMessage],
			};
		});
	}

	return (
		<div className="flex relative">
			<AnimatePresence initial={false}>
				{sidebar && (
					<Sidebar
						isOpen={sidebar}
						selectUser={selectUser}
						toggleLogoutWarning={toggleLogoutWarning}
						selectedUser={selectedUser}
					/>
				)}
			</AnimatePresence>
			{userMessage ? (
				<Chat
					toggleSidebar={toggleSidebar}
					userMessage={userMessage}
					sidebar={sidebar}
					sendMessage={sendMessage}
				/>
			) : (
				<SelectPeerMessage
					sidebar={sidebar}
					toggleSidebar={toggleSidebar}
					toggleAddPeers={toggleAddPeers}
				/>
			)}
		</div>
	);
}
