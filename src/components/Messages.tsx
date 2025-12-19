import { useEffect, useRef, useMemo } from "react";
import type { WebRTCMessage } from "@/types";
import useChatHistory from "@/hooks/useChatHistory";
import { Spinner } from "./ui/spinner";

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
		if (displayMessages.length === 0) return;
		const t = setTimeout(() => {
			endRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}, 100);
		return () => clearTimeout(t);
	}, [displayMessages.length, selectedUser]);

	return (
		<div
			className={`h-full scroll-auto px-4 md:px-10 py-4 flex flex-col gap-2 overflow-auto relative bg-gray-50 ${
				loading ? "justify-center items-center" : ""
			}`}
		>
			{loading && (
				<div className="justify-center flex items-center gap-2">
					<Spinner />
					<div className="text-xs font-semibold text-gray-400 py-2">
						Loading...
					</div>
				</div>
			)}

			{displayMessages.map((m, index) => {
				const isMe = m.senderId === "me";
				const prev =
					index > 0
						? new Date(
								displayMessages[index - 1].timestamp
						  ).toDateString()
						: null;
				const todayDate = new Date();
				const yesterdayDate = new Date(todayDate);
				yesterdayDate.setDate(todayDate.getDate() - 1);
				const yesterday = yesterdayDate.toDateString();
				const today = todayDate.toDateString();
				const currDate = new Date(m.timestamp);
				const curr = currDate.toDateString();
				const formattedDate = currDate.toLocaleDateString([], {
					day: "numeric",
					month: "short",
					year:
						currDate.getFullYear() !== todayDate.getFullYear()
							? "numeric"
							: undefined,
				});
				let flag = false;
				if (prev !== curr) {
					flag = true;
				}

				return (
					<>
						{flag && (
							<div className="flex justify-center">
								<div className="text-xs bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-2xl text-gray-700">
									{yesterday == curr
										? "Yesterday"
										: today == curr
										? "Today"
										: formattedDate}
								</div>
							</div>
						)}
						<div
							key={`${m.senderId}-${m.timestamp}`}
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
										{new Date(
											m.timestamp
										).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</div>
							</div>
						</div>
					</>
				);
			})}
			<div ref={endRef} />
		</div>
	);
}

export default Messages;
