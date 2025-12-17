import { useState, useEffect } from "react";
import { getHistoryFromDB } from "@/services/chatHistory";
import { useAuth } from "@/context/AuthContext";
import type { WebRTCMessage } from "@/types";

export default function useChatHistory(selectedFriendId: string | null) {
	const { currentUser } = useAuth();

	const [fetchedData, setFetchedData] = useState<{
		conversationId: string | null;
		messages: WebRTCMessage[];
	}>({
		conversationId: null,
		messages: [],
	});

	useEffect(() => {
		if (!selectedFriendId || !currentUser?.uid) return;

		let isMounted = true;

		getHistoryFromDB(currentUser.uid, selectedFriendId)
			.then((data) => {
				if (isMounted) {
					setFetchedData({
						conversationId: selectedFriendId,
						messages: data,
					});
				}
			})
			.catch((err) => console.error(err));

		return () => {
			isMounted = false;
		};
	}, [selectedFriendId, currentUser]);

	const isDataMismatch = fetchedData.conversationId !== selectedFriendId;
	const loading = selectedFriendId ? isDataMismatch : false;

	const history = isDataMismatch ? [] : fetchedData.messages;

	return { history, loading };
}
