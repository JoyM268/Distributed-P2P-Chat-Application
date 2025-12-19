import { AnimatePresence } from "motion/react";
import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import SelectPeerMessage from "@/components/SelectPeerMessage";
import { useEffect, useState } from "react";
import useWebRTC from "@/hooks/useWebRTC";
import useFriends from "@/hooks/useFriends";
import { useAuth } from "@/hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";

export default function UserChat({
	toggleLogoutWarning,
	toggleAddPeers,
}: {
	toggleLogoutWarning: () => void;
	toggleAddPeers: () => void;
}) {
	const { username } = useParams<{ username?: string }>();
	const navigate = useNavigate();

	const { currentUser } = useAuth();
	const { friends, loading } = useFriends({
		currentUserId: currentUser?.uid || null,
	});
	const user = friends.find((f) => f.username === username);
	const selectedUser = user?.uid ?? null;

	useEffect(() => {
		if (username && !loading && !user) {
			navigate("/chat", { replace: true });
		}
	}, [username, loading, user, navigate]);

	const [sidebar, setSidebar] = useState(true);

	const { sendMessage, messages } = useWebRTC(
		currentUser?.uid || null,
		friends
	);

	function toggleSidebar() {
		setSidebar((s) => !s);
	}

	function selectUser(uid: string) {
		if (uid === selectedUser) {
			navigate("/chat", { replace: true });
			return;
		}

		const friend = friends.find((f) => f.uid === uid);
		if (friend) {
			navigate(`/chat/${friend.username}`);
		} else {
			navigate("/chat", { replace: true });
		}
	}

	function handleSend(content: string) {
		if (selectedUser && content.trim()) {
			sendMessage(selectedUser, content.trim());
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
						toggleAddPeers={toggleAddPeers}
						loadingFriends={loading}
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
					selectUser={selectUser}
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
