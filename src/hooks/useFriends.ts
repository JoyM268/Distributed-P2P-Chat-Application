// useFriends.ts
import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { ref, onValue, get, child } from "firebase/database";

interface FriendProfile {
	uid: string;
	name?: string;
	username?: string;
	avatar?: string;
	status?: string;
	[key: string]: any;
}

const useFriends = (currentUserId: string | null) => {
	const [friends, setFriends] = useState<FriendProfile[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!currentUserId) {
			setFriends([]);
			setLoading(false);
			return;
		}

		setLoading(true);

		const friendsListRef = ref(db, `friends/${currentUserId}`);

		const unsubscribe = onValue(
			friendsListRef,
			async (snapshot) => {
				if (!snapshot.exists()) {
					setFriends([]);
					setLoading(false);
					return;
				}

				const friendsData = snapshot.val();
				if (typeof friendsData !== "object") {
					setFriends([]);
					setLoading(false);
					return;
				}

				const friendUids = Object.keys(friendsData);

				try {
					const profiles = await Promise.all(
						friendUids.map(async (uid) => {
							const userRef = child(ref(db), `users/${uid}`);
							const userSnap = await get(userRef);

							if (!userSnap.exists()) {
								return {
									uid,
									name: "Unknown User",
									status: "offline",
								};
							}

							const userData = userSnap.val();

							return {
								uid,
								...userData,
								name:
									userData.username ||
									userData.name ||
									"Unknown User",
								status: userData.status || "offline",
							};
						})
					);

					setFriends(profiles);
				} catch (error) {
					console.error("Error fetching friend profiles:", error);
				} finally {
					setLoading(false);
				}
			},
			(error) => {
				console.error("Firebase Read Error:", error);
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, [currentUserId]);

	return { friends, loading };
};

export default useFriends;
