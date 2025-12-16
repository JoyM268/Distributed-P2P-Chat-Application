import { useRef, useState } from "react";
import { InputGroup } from "./ui/input-group";
import { Input } from "./ui/input";
import { SendHorizonalIcon } from "lucide-react";

function Send({ sendMessage }: { sendMessage: (content: string) => void }) {
	const [message, setMessage] = useState<string>("");
	const inputRef = useRef<HTMLInputElement>(null);
	return (
		<div className="sticky bottom-0 border-t border-gray-400 px-20 py-4 bg-white overflow-hidden shrink-0">
			<InputGroup>
				<form
					className="relative w-full"
					onSubmit={(e) => {
						e.preventDefault();
						sendMessage(message);
						setMessage("");
						inputRef.current?.blur();
					}}
				>
					<Input
						type="text"
						placeholder="Message Pratham M..."
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
		</div>
	);
}

export default Send;
