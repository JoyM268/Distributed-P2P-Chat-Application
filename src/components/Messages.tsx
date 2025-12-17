import { useEffect, useRef, useMemo } from "react";
import type { WebRTCMessage } from "@/types";
import useChatHistory from "@/hooks/useChatHistory";

function Messages({
	userMessage,
	selectedUser,
}: {
	userMessage: WebRTCMessage[];
	selectedUser: string | null;
}) {
	const endRef = useRef<HTMLDivElement | null>(null);
	const { history, loading } = useChatHistory(selectedUser);

	const displayMessages = useMemo(() => {
		if (!selectedUser) return [];

		const combined = [...history, ...userMessage];
		const relevant = combined.filter(
			(m) =>
				(m.senderId === "me" && m.receiverId === selectedUser) ||
				m.senderId === selectedUser
		);

		const unique = relevant.filter(
			(msg, index, self) =>
				index ===
				self.findIndex(
					(m) =>
						m.timestamp === msg.timestamp &&
						m.content === msg.content &&
						m.senderId === msg.senderId
				)
		);

		return unique.sort((a, b) => a.timestamp - b.timestamp);
	}, [history, userMessage, selectedUser]);

	useEffect(() => {
		const t = setTimeout(() => {
			endRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}, 100);
		return () => clearTimeout(t);
	}, [displayMessages.length, selectedUser]);

	return (
		<div className="flex-1 scroll-auto px-4 md:px-10 py-4 flex flex-col gap-2 overflow-auto relative">
			{loading && (
				<div className="text-center text-xs text-gray-400 py-2">
					Loading history...
				</div>
			)}

			{displayMessages.map((m, index) => {
				const isMe = m.senderId === "me";
				return (
					<div
						key={index}
						className={`w-full flex text-wrap ${
							isMe ? "justify-end" : "justify-start"
						}`}
					>
						<div
							className={`py-3 px-5 ${
								isMe
									? "bg-blue-500 rounded-br-none"
									: "bg-blue-800 rounded-bl-none"
							} text-white rounded-xl text-wrap wrap-break-word whitespace-pre-wrap max-w-[85%] md:max-w-[45%]`}
						>
							<p>{m.content}</p>
							<div className="flex justify-end pt-1">
								<span className="text-xs opacity-70">
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
