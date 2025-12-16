import { useEffect, useRef } from "react";
import type { WebRTCMessage } from "@/types";

function Messages({
	userMessage,
	selectedUser,
}: {
	userMessage: WebRTCMessage[];
	selectedUser: string | null;
}) {
	const endRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const t = setTimeout(() => {
			endRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}, 50);
		return () => clearTimeout(t);
	}, [userMessage.length]);

	return (
		<div className="flex-1 scroll-auto px-10 py-4 flex flex-col gap-2 overflow-auto">
			{userMessage.map((m) => {
				if (
					!(
						(selectedUser &&
							m.senderId === "me" &&
							selectedUser === m.receiverId) ||
						(selectedUser && m.senderId == selectedUser)
					)
				)
					return null;
				return (
					<div
						className={`w-full flex  text-wrap ${
							m.senderId == "me" ? "justify-end" : "justify-start"
						}`}
					>
						<div
							className={`py-3 px-5 ${
								m.senderId == "me"
									? "bg-blue-500 rounded-br-none"
									: "bg-blue-800 rounded-bl-none"
							} text-white rounded-xl text-wrap wrap-break-word whitespace-pre-wrap max-w-[35%]`}
						>
							<p>{m.content}</p>
							<div className="flex justify-end pt-1">
								<span className="text-xs">
									{new Date(m.timestamp).toLocaleTimeString(
										[],
										{
											hour: "2-digit",
											minute: "2-digit",
										}
									)}
								</span>
							</div>
						</div>
					</div>
				);
			})}
			<div ref={endRef} />
		</div>
	);
}

export default Messages;
