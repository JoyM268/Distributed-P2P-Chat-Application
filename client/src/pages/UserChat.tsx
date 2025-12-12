import { AnimatePresence } from "motion/react";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import SelectPeerMessage from "@/components/SelectPeerMessage";
import { useState } from "react";
import type {
	UserInterface,
	ProfileInterface,
	UserMessageInterface,
} from "@/types";
import { userData, profileData, messageData } from "@/data/dummy";

export default function UserChat({
	toggleLogoutWarning,
	toggleAddPeers,
}: {
	toggleLogoutWarning: () => void;
	toggleAddPeers: () => void;
}) {
	const [sidebar, setSidebar] = useState<boolean>(true);
	const [users, setUsers] = useState<UserInterface[]>(userData);
	const [profile, setProfile] = useState<ProfileInterface>(profileData);
	const [userMessage, setUserMessage] = useState<UserMessageInterface | null>(
		null
	);

	function toggleSidebar() {
		setSidebar((sidebar) => !sidebar);
	}

	function selectUser(user: string) {
		if (userMessage !== null && user == userMessage.name) {
			setUserMessage(null);
			return;
		}
		setUserMessage(messageData.find((u) => u.name === user) || null);
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
						users={users}
						selectUser={selectUser}
						userMessage={userMessage}
						profile={profile}
						toggleLogoutWarning={toggleLogoutWarning}
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
