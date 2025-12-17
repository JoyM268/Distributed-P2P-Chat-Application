import { useEffect } from "react";
import { db } from "@/services/firebase";
import {
	ref,
	onValue,
	onDisconnect,
	set,
	serverTimestamp,
} from "firebase/database";
import { useAuth } from "@/hooks/useAuth";

export default function usePresence() {
	const { currentUser } = useAuth();

	useEffect(() => {
		if (!currentUser) return;

		const connectedRef = ref(db, ".info/connected");
		const myStatusRef = ref(db, `status/${currentUser.uid}`);

		const unsubscribe = onValue(connectedRef, (snap) => {
			if (snap.val() === true) {
				onDisconnect(myStatusRef)
					.set({
						state: "Offline",
						last_changed: serverTimestamp(),
					})
					.then(() => {
						set(myStatusRef, {
							state: "Online",
							last_changed: serverTimestamp(),
						});
					});
			}
		});

		return () => unsubscribe();
	}, [currentUser]);
}
