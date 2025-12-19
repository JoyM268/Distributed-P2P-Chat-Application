import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { db } from "@/services/firebase";
import { ref, update, get, child } from "firebase/database";
import { useAuth } from "@/hooks/useAuth";

export default function AddPeers({
	addPeers,
	setAddPeers,
}: {
	addPeers: boolean;
	setAddPeers: Dispatch<SetStateAction<boolean>>;
}) {
	const [sending, setSending] = useState(false);
	const { currentUser } = useAuth();
	const [search, setSearch] = useState("");

	async function handleSendRequest(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const usernameInput = search.trim();
		if (!usernameInput || !currentUser) return;

		setSending(true);

		try {
			const usernameRef = child(ref(db), `usernames/${usernameInput}`);
			const snapshot = await get(usernameRef);

			if (!snapshot.exists()) {
				console.log("User not found!");
				setSending(false);
				return;
			}

			const targetUid = snapshot.val();

			if (targetUid === currentUser.uid) {
				console.log("You cannot add yourself.");
				setSending(false);
				return;
			}

			const friendCheckRef = child(
				ref(db),
				`friends/${currentUser.uid}/${targetUid}`
			);
			const friendCheckSnap = await get(friendCheckRef);

			if (friendCheckSnap.exists()) {
				console.log(`You are already friends with ${usernameInput}.`);
				setSending(false);
				return;
			}

			const requestCheckRef = child(
				ref(db),
				`friend_requests/${targetUid}/${currentUser.uid}`
			);
			const requestCheckSnap = await get(requestCheckRef);

			if (requestCheckSnap.exists()) {
				console.log("Request already sent.");
				setSending(false);
				return;
			}

			const updates: any = {};

			updates[`friend_requests/${targetUid}/${currentUser.uid}`] = true;

			await update(ref(db), updates);

			console.log(`Request sent to ${usernameInput}!`);
			setSearch("");
		} catch (error) {
			console.error("Error sending request:", error);
			console.log("Failed to send request.");
		} finally {
			setSending(false);
		}
	}

	return (
		<Dialog open={addPeers} onOpenChange={setAddPeers}>
			<DialogContent className="text-center">
				<DialogHeader>
					<DialogTitle className="font-semibold">
						Add Friends
					</DialogTitle>
				</DialogHeader>
				<div className="mt-1 flex flex-col gap-2 mb-2">
					<Label htmlFor="username">Enter the Username</Label>
					<Input
						id="username"
						placeholder="Username"
						className="border border-gray-500"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<DialogFooter>
					<DialogClose>
						<Button
							variant="outline"
							className="cursor-pointer select-none w-full"
						>
							Cancel
						</Button>
					</DialogClose>
					<form onSubmit={handleSendRequest}>
						<Button
							className="bg-blue-500 text-white hover:bg-blue-500/85 cursor-pointer select-none w-full"
							type="submit"
							disabled={sending}
						>
							{!sending ? "Send" : "Sending..."}
						</Button>
					</form>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
