import { useEffect, useRef } from "react";
import type { UserMessageInterface } from "@/types";

function Messages({ userMessage }: { userMessage: UserMessageInterface }) {
	const endRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const t = setTimeout(() => {
			endRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}, 50);
		return () => clearTimeout(t);
	}, [userMessage.message.length]);

	return (
		<div className="flex-1 scroll-auto px-10 py-4 flex flex-col gap-2 overflow-auto">
			{userMessage.message.map((m) => (
				<div
					className={`w-full flex  text-wrap ${
						m.sent ? "justify-end" : "justify-start"
					}`}
				>
					<div
						className={`py-3 px-5 ${
							m.sent
								? "bg-blue-500 rounded-br-none"
								: "bg-blue-800 rounded-bl-none"
						} text-white rounded-xl text-wrap wrap-break-word whitespace-pre-wrap max-w-[35%]`}
					>
						<p>{m.content}</p>
						<div className="flex justify-end pt-1">
							<span className="text-xs">{m.time}</span>
						</div>
					</div>
				</div>
			))}
			<div ref={endRef} />
		</div>
	);
}

export default Messages;
