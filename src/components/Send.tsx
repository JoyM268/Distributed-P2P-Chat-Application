import { useRef, useState } from "react";
import { InputGroup } from "./ui/input-group";
import { Input } from "./ui/input";
import { SendHorizonalIcon } from "lucide-react";
import type { FriendProfile } from "@/types";
import { useMemo } from "react";
import { toast } from "sonner";

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

	return (
		<div
			className={`bottom-0 border-t border-gray-400 px-5 sm:px-20 py-4 overflow-hidden shrink-0 ${
				friend?.status?.toLocaleLowerCase() !== "online"
					? "bg-gray-50"
					: "bg-white"
			}`}
		>
			{friend?.status?.toLocaleLowerCase() === "online" ? (
				<InputGroup>
					<form
						className="relative w-full"
						onSubmit={(e) => {
							e.preventDefault();
							if (message.trim()) {
								sendMessage(message);
							} else {
								toast.error("Meessage cannot be empty.");
							}
							setMessage("");
							inputRef.current?.blur();
						}}
					>
						<Input
							type="text"
							placeholder={`Message ${friend?.username}...`}
							className="w-full rounded-md border border-gray-400 py-3 pl-4 pr-14"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							ref={inputRef}
						/>

						<button
							type="submit"
							className="absolute right-1 top-1 bottom-1 aspect-square bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors px-2 py-1 cursor-pointer"
						>
							<SendHorizonalIcon className="w-5 h-5" />
						</button>
					</form>
				</InputGroup>
			) : (
				<div className="w-full text-center font-semibold text-red-600">
					User is offline
				</div>
			)}
		</div>
	);
}

export default Send;
