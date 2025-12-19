import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function Menu() {
	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			exit={{ y: -100 }}
			transition={{ duration: 0.4, ease: "easeInOut" }}
			className="fixed z-40 mt-15 bg-white w-full flex flex-col gap-1 justify-center text-center text-sm sm:hidden shadow-2xl"
		>
			<NavLink
				to="/"
				className={({ isActive }) =>
					clsx("border-b border-gray-300 py-1.5", {
						"text-blue-500  font-semibold": isActive,
					})
				}
			>
				Home
			</NavLink>
			<NavLink
				to="/login"
				className={({ isActive }) =>
					clsx("border-b border-gray-300 py-1.5", {
						"text-blue-500  font-semibold": isActive,
					})
				}
			>
				Login
			</NavLink>
			<NavLink
				to="/signup"
				className={({ isActive }) =>
					clsx("border-b border-gray-300 py-1.5", {
						"text-blue-500  font-semibold": isActive,
					})
				}
			>
				Signup
			</NavLink>
		</motion.nav>
	);
}
