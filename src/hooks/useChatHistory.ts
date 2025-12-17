import { useState, useEffect } from "react";
import { getHistoryFromDB } from "@/services/chatHistory";
import type { WebRTCMessage } from "@/types";

export default function useChatHistory(selectedFriendId: string | null) {
	const [fetchedData, setFetchedData] = useState<{
		conversationId: string | null;
		messages: WebRTCMessage[];
	}>({
		conversationId: null,
		messages: [],
	});

	useEffect(() => {
		if (!selectedFriendId) return;

		let isMounted = true;
		getHistoryFromDB(selectedFriendId)
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
	}, [selectedFriendId]);

	const isDataMismatch = fetchedData.conversationId !== selectedFriendId;
	const loading = selectedFriendId ? isDataMismatch : false;

	const history = isDataMismatch ? [] : fetchedData.messages;

	return { history, loading };
}
