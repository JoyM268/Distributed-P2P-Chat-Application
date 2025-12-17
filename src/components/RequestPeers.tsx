import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";

import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Check, X } from "lucide-react";
import { db } from "@/services/firebase";
import { ref, update, get, child } from "firebase/database";
import type { FriendProfile } from "@/types";

export default function RequestPeers({
	requests,
	loading,
}: {
	requests: FriendProfile[];
	loading: boolean;
}) {
	const [search, setSearch] = useState<string>("");
	const { currentUser } = useAuth();

	const [sending, setSending] = useState(false);

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

	const handleAccept = async (senderUid: string) => {
		if (!currentUser) return;
		const updates: any = {};
		updates[`friends/${currentUser.uid}/${senderUid}`] = true;
		updates[`friends/${senderUid}/${currentUser.uid}`] = true;
		updates[`friend_requests/${currentUser.uid}/${senderUid}`] = null;
		try {
			await update(ref(db), updates);
		} catch (error) {
			console.error("Error accepting friend request:", error);
		}
	};

	const handleReject = async (senderUid: string) => {
		if (!currentUser) return;
		const updates: any = {};
		updates[`friend_requests/${currentUser.uid}/${senderUid}`] = null;

		try {
			await update(ref(db), updates);
		} catch (error) {
			console.error("Error rejecting friend request:", error);
		}
	};

	return (
		<>
			<form
				className="px-4 py-4 border-b border-gray-200 flex flex-col justify-center gap-2"
				onSubmit={handleSendRequest}
			>
				<div className="relative border border-gray-400 rounded-md">
					<Input
						placeholder="Username"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<Button
					className="w-full bg-blue-500 mt-1 cursor-pointer hover:bg-blue-500/85"
					disabled={sending}
				>
					{sending ? "Sending..." : "Send Request"}
				</Button>
			</form>

			<div className="px-4 pt-4 pb-2">
				<span className="text-sm font-medium">Requests</span>
			</div>
			<div className="px-4 pb-4 flex-1 overflow-y-auto">
				{loading && (
					<div className="text-sm text-gray-500 text-center py-4">
						Loading...
					</div>
				)}

				{!loading && requests.length === 0 && (
					<div className="text-sm text-gray-500 text-center py-4">
						No friend requests.
					</div>
				)}
				{requests.map((request) => (
					<div
						key={request.uid}
						className={`flex items-center gap-3 py-2 px-1 rounded-lg transition-colors text-black"
					}`}
					>
						<div className="flex items-center justify-between w-full">
							<div className="flex gap-3 items-center">
								<Avatar className="w-10 h-10 border border-gray-400 text-black">
									<AvatarFallback className="bg-white">
										{request.name
											? request.name
													.charAt(0)
													.toUpperCase()
											: "?"}
									</AvatarFallback>
								</Avatar>
								<span className="font-semibold">
									{request.name || "Guest"}
								</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="bg-green-100 hover:bg-green-100/85 p-1.5 rounded-full items-center flex justify-center cursor-pointer">
									<Check
										size={20}
										className="text-green-600"
										onClick={() =>
											handleAccept(request.uid)
										}
									/>
								</div>
								<div className="bg-red-100 hover:bg-red-100/85 p-1.5 rounded-full items-center flex justify-center cursor-pointer">
									<X
										size={20}
										className="text-red-600"
										onClick={() =>
											handleReject(request.uid)
										}
									/>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
