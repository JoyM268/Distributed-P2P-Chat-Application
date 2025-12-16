import { AnimatePresence } from "motion/react";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import SelectPeerMessage from "@/components/SelectPeerMessage";
import { useState } from "react";
import useWebRTC from "@/hooks/useWebRTC";
import useFriends from "@/hooks/useFriends";
import { useAuth } from "@/context/AuthContext";

export default function UserChat({
	toggleLogoutWarning,
	toggleAddPeers,
}: {
	toggleLogoutWarning: () => void;
	toggleAddPeers: () => void;
}) {
	const [sidebar, setSidebar] = useState<boolean>(true);
	const [selectedUser, setSelectedUser] = useState<string | null>(null);
	const { currentUser } = useAuth();
	const { friends, loading } = useFriends({
		currentUserId: currentUser?.uid || null,
	});

	const { sendMessage, messages } = useWebRTC(
		currentUser?.uid || null,
		friends
	);

	function toggleSidebar() {
		setSidebar((sidebar) => !sidebar);
	}

	function selectUser(uid: string) {
		if (selectedUser && selectedUser === uid) {
			setSelectedUser(null);
			return;
		}
		setSelectedUser(uid);
	}

	function handleSend(content: string) {
		console.log("handleSend called with:", { selectedUser, content });
		if (selectedUser && content.trim()) {
			console.log("Calling sendMessage with selectedUser:", selectedUser);
			sendMessage(selectedUser, content.trim());
		} else {
			console.log(
				"Not sending - selectedUser:",
				selectedUser,
				"content:",
				content
			);
		}
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
						friends={friends}
						loading={loading}
					/>
				)}
			</AnimatePresence>
			{selectedUser ? (
				<Chat
					toggleSidebar={toggleSidebar}
					userMessage={messages}
					sidebar={sidebar}
					sendMessage={handleSend}
					selectedUser={selectedUser}
					friends={friends}
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
