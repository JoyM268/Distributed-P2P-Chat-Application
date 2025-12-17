import { MessageSquare } from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

export default function MainHeader() {
	return (
		<div className="flex justify-between items-center px-4 py-3 text-blue-600 border-b border border-gray-300 fixed w-full z-20 bg-white">
			<NavLink to="/" className="flex gap-2  items-center cursor-pointer">
				<MessageSquare />{" "}
				<span className="font-semibold text-xl">P2P Chat</span>
			</NavLink>
			<div className="flex gap-6 font-semibold items-center">
				<NavLink
					to="/"
					className={({ isActive }) =>
						clsx("text-gray-600 cursor-pointer", {
							"text-gray-800": isActive,
						})
					}
				>
					Home
				</NavLink>
				<NavLink
					to="/login"
					className={({ isActive }) =>
						clsx("text-gray-600 cursor-pointer", {
							"text-gray-800": isActive,
						})
					}
				>
					Login
				</NavLink>
				<NavLink
					to="/signup"
					className="text-white px-3 py-1.5 bg-blue-600 rounded-lg cursor-pointer"
				>
					Get Started
				</NavLink>
			</div>
		</div>
	);
}
