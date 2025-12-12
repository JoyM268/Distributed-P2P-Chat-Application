import { MessageSquare } from "lucide-react";

export default function MainHeader({
	option,
	changeOption,
}: {
	option: "main" | "login" | "signup";
	changeOption: (newOption: "main" | "login" | "signup") => void;
}) {
	return (
		<div className="flex justify-between items-center px-4 py-3 text-blue-600 border-b border border-gray-300 fixed w-full z-20 bg-white">
			<div
				className="flex gap-2  items-center cursor-pointer"
				onClick={() => {
					changeOption("main");
				}}
			>
				<MessageSquare />{" "}
				<span className="font-semibold text-xl">P2P Chat</span>
			</div>
			<div className="flex gap-6 font-semibold">
				<button
					className={`text-gray-600 cursor-pointer ${
						option === "main" ? "text-gray-800" : ""
					}`}
					onClick={() => {
						changeOption("main");
					}}
				>
					Home
				</button>
				<button
					className={`text-gray-600 cursor-pointer ${
						option === "login" ? "text-gray-800" : ""
					}`}
					onClick={() => {
						changeOption("login");
					}}
				>
					Login
				</button>
				<button
					className="text-white px-3 py-1.5 bg-blue-600 rounded-lg cursor-pointer"
					onClick={() => {
						changeOption("signup");
					}}
				>
					Get Started
				</button>
			</div>
		</div>
	);
}
