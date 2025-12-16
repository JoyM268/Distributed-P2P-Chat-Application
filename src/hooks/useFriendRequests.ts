import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { ref, onValue, get, child } from "firebase/database";

interface FriendRequest {
	uid: string;
	name: string;
	avatar?: string;
	email?: string;
	timestamp?: number;
}

const useFriendRequests = (currentUserId: string | null) => {
	const [requests, setRequests] = useState<FriendRequest[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!currentUserId) {
			setRequests([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		const requestsRef = ref(db, `friend_requests/${currentUserId}`);

		const unsubscribe = onValue(
			requestsRef,
			async (snapshot) => {
				const data = snapshot.val();

				if (!data) {
					setRequests([]);
					setLoading(false);
					return;
				}

				const requestKeys = Object.keys(data);

				try {
					const loadedRequests = await Promise.all(
						requestKeys.map(async (senderUid) => {
							const requestInfo = data[senderUid];
							const userRef = child(
								ref(db),
								`users/${senderUid}`
							);
							const userSnap = await get(userRef);

							if (userSnap.exists()) {
								const userData = userSnap.val();
								return {
									uid: senderUid,
									name:
										userData.username ||
										userData.name ||
										"Guest",
									avatar:
										userData.avatar || userData.img || "",
									email: userData.email,
									timestamp: requestInfo.timestamp,
								};
							} else {
								return { uid: senderUid, name: "Guest" };
							}
						})
					);

					setRequests(
						loadedRequests.filter(
							(r): r is FriendRequest => r !== null
						)
					);
				} catch (error) {
					console.error("Error fetching friend requests:", error);
				} finally {
					setLoading(false);
				}
			},
			(error) => {
				console.error("Firebase Friend Request Error:", error);
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, [currentUserId]);

	return { requests, loading };
};

export default useFriendRequests;
