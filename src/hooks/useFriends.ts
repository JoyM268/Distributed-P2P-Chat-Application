import { useEffect, useState, useRef } from "react";
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

const useFriends = ({ currentUserId }: { currentUserId: string | null }) => {
	const [friends, setFriends] = useState<FriendProfile[]>([]);
	const [loading, setLoading] = useState(true);

	const unsubscribeListRef = useRef<(() => void) | null>(null);
	const statusUnsubsRef = useRef<(() => void)[]>([]);

	useEffect(() => {
		if (!currentUserId) {
			const timeoutId = setTimeout(() => {
				setFriends([]);
				setLoading(false);
			}, 0);
			return () => clearTimeout(timeoutId);
		}

		const initTimer = setTimeout(() => {
			setLoading(true);
			const friendsListRef = ref(db, `friends/${currentUserId}`);
			const unsubscribeFriendsList = onValue(
				friendsListRef,
				async (snapshot) => {
					statusUnsubsRef.current.forEach((unsub) => unsub());
					statusUnsubsRef.current = [];

					const friendsData = snapshot.val();

					if (!friendsData) {
						setFriends([]);
						setLoading(false);
						return;
					}

					const friendUids = Object.keys(friendsData);

					try {
						const profiles = await Promise.all(
							friendUids.map(async (uid) => {
								const userSnap = await get(
									child(ref(db), `users/${uid}`)
								);
								if (userSnap.exists()) {
									const val = userSnap.val();
									return {
										uid,
										...val,
										name:
											val.username || val.name || "Guest",
										status: "Offline",
									};
								}
								return {
									uid,
									name: "Guest",
									status: "Offline",
								};
							})
						);

						setFriends(profiles);
						setLoading(false);

						profiles.forEach((profile) => {
							const statusRef = ref(db, `status/${profile.uid}`);

							const unsub = onValue(statusRef, (statusSnap) => {
								const statusData = statusSnap.val();
								const newStatus =
									statusData?.state || "Offline";

								setFriends((prevFriends) =>
									prevFriends.map((f) =>
										f.uid === profile.uid
											? { ...f, status: newStatus }
											: f
									)
								);
							});

							statusUnsubsRef.current.push(unsub);
						});
					} catch (error) {
						console.error("Error loading friends:", error);
						setLoading(false);
					}
				}
			);

			unsubscribeListRef.current = unsubscribeFriendsList;
		}, 0);

		return () => {
			clearTimeout(initTimer);
			if (unsubscribeListRef.current) unsubscribeListRef.current();
			statusUnsubsRef.current.forEach((unsub) => unsub());
			statusUnsubsRef.current = [];
		};
	}, [currentUserId]);

	return { friends, loading };
};

export default useFriends;
