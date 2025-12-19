import { Menu, MessageSquare, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { type Dispatch, type SetStateAction } from "react";
import { motion } from "framer-motion";

export default function MainHeader({
	menu,
	setMenu,
}: {
	menu: boolean;
	setMenu: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<div className="flex justify-between items-center px-4 py-3 text-blue-600 border-b border border-gray-300 fixed w-full z-50 bg-white select-none">
			<NavLink to="/" className="flex gap-2 items-center cursor-pointer">
				<MessageSquare />
				<span className="font-semibold sm:text-xl text-lg">
					P2P Chat
				</span>
			</NavLink>
			<motion.div
				className="p-2 hover:bg-gray-100 rounded-full cursor-pointer font-semibold sm:hidden flex items-center justify-center"
				onClick={() => setMenu((prev) => !prev)}
				initial={false}
				animate={{ rotate: menu ? 180 : 0 }}
				transition={{ duration: 0.4, ease: "easeInOut" }}
			>
				{menu ? <X size={18} /> : <Menu size={18} />}
			</motion.div>
			<div className="gap-6 font-semibold items-center sm:flex hidden">
				<NavLink
					to="/"
					className={({ isActive }) =>
						clsx(
							"text-gray-600 cursor-pointer sm:text-base text-sm",
							{
								"text-gray-800": isActive,
							}
						)
					}
				>
					Home
				</NavLink>
				<NavLink
					to="/login"
					className={({ isActive }) =>
						clsx(
							"text-gray-600 cursor-pointer sm:text-base text-sm",
							{
								"text-gray-800": isActive,
							}
						)
					}
				>
					Login
				</NavLink>
				<NavLink
					to="/signup"
					className="text-white sm:px-3 sm:py-1.5 bg-blue-600 sm:rounded-lg rounded-md cursor-pointer sm:text-base text-sm py-1 px-2"
				>
					Get Started
				</NavLink>
			</div>
		</div>
	);
}
