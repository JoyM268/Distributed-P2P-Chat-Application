import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { db } from "@/services/firebase";
import { ref, update, get, child } from "firebase/database";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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
				toast.error("User not found!");
				return;
			}

			const targetUid = snapshot.val();

			if (targetUid === currentUser.uid) {
				toast.info("You cannot add yourself.");
				return;
			}

			const friendCheckRef = child(
				ref(db),
				`friends/${currentUser.uid}/${targetUid}`
			);
			const friendCheckSnap = await get(friendCheckRef);

			if (friendCheckSnap.exists()) {
				toast.info(
					`You are already friends with ${usernameInput.trim()}.`
				);
				return;
			}

			const requestCheckRef = child(
				ref(db),
				`friend_requests/${targetUid}/${currentUser.uid}`
			);
			const requestCheckSnap = await get(requestCheckRef);

			if (requestCheckSnap.exists()) {
				toast.info("Request already sent.");
				return;
			}

			const updates: any = {};

			updates[`friend_requests/${targetUid}/${currentUser.uid}`] = true;

			await update(ref(db), updates);

			toast.success(`Request sent to ${usernameInput.trim()}!`);
			setSearch("");
			setAddPeers(false);
		} catch (error) {
			console.error("Error sending request:", error);
			toast.error("Failed to send request.");
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

				<form onSubmit={handleSendRequest} className="space-y-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="username">Enter the Username</Label>
						<Input
							id="username"
							placeholder="Username"
							className="border border-gray-500"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<DialogClose asChild>
							<Button
								type="button"
								variant="outline"
								className="w-full border border-gray-400 cursor-pointer"
							>
								Cancel
							</Button>
						</DialogClose>

						<Button
							type="submit"
							disabled={sending}
							className="w-full bg-blue-500 text-white hover:bg-blue-500/85 cursor-pointer"
						>
							{!sending ? "Send" : "Sending..."}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
