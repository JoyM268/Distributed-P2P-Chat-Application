import { useRef, useState, useMemo } from "react";
import { InputGroup } from "./ui/input-group";
import { Input } from "./ui/input";
import { SendHorizonalIcon } from "lucide-react";
import type { FriendProfile } from "@/types";

function Send({
	sendMessage,
	friends,
	selectedUser,
}: {
	sendMessage: (content: string) => void;
	friends: FriendProfile[];
	selectedUser: string | null;
}) {
	const [message, setMessage] = useState<string>("");
	const inputRef = useRef<HTMLInputElement>(null);

	const friend = useMemo(() => {
		return friends.find((f) => f.uid === selectedUser);
	}, [friends, selectedUser]);

	const isOnline = friend?.status?.toLowerCase().trim() === "online";

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (message.trim()) {
			sendMessage(message);
			setMessage("");
			inputRef.current?.focus();
		}
	};

	return (
		<div className="sticky bottom-0 border-t border-gray-200 px-4 md:px-10 py-4 bg-white z-10">
			{isOnline ? (
				<InputGroup>
					<form className="relative w-full" onSubmit={handleSend}>
						<Input
							type="text"
							placeholder={`Message ${friend?.name || "..."}`}
							className="w-full rounded-full border border-gray-300 py-3 pl-5 pr-14 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							ref={inputRef}
						/>

						<button
							type="submit"
							disabled={!message.trim()}
							className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							<SendHorizonalIcon className="w-5 h-5 ml-0.5" />
						</button>
					</form>
				</InputGroup>
			) : (
				<div className="w-full py-3 text-center bg-gray-50 text-gray-500 text-sm rounded-lg border border-gray-100 italic">
					{friend?.name || "User"} is currently offline
				</div>
			)}
		</div>
	);
}

export default Send;
