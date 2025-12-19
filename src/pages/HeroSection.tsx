import { ArrowRight } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { NavLink } from "react-router-dom";

export default function HeroSection({
	setMenu,
}: {
	setMenu: Dispatch<SetStateAction<boolean>>;
}) {
	useEffect(() => {
		setMenu(false);
	}, [setMenu]);

	return (
		<div className="pt-40 z-0 w-full flex justify-center items-center flex-col gap-4 px-3">
			<div className="flex flex-col font-bold text-4xl sm:text-6xl text-center gap-1">
				<h1>Secure.</h1>
				<h1>Decentralized.</h1>
				<h1 className="text-blue-600">Real-Time Chat.</h1>
			</div>
			<p className="text-gray-700 text-center sm:text-base text-sm">
				Peer-to-peer messaging with zero server storage. Your data never
				touches our servers.
			</p>
			<div className="flex gap-5">
				<NavLink
					to="/signup"
					className="text-white font-semibold bg-blue-500 sm:px-3 sm:py-2 sm:text-base px-2 py-1.5 text-sm rounded-lg cursor-pointer"
				>
					Get Started
				</NavLink>
				<a
					href="https://github.com/JoyM268/Distributed-P2P-Chat-Application"
					className="flex items-center gap-1.5 font-semibold cursor-pointer sm:text-base text-sm"
				>
					<span>Learn More</span>
					<ArrowRight size={12} strokeWidth={3} />
				</a>
			</div>
		</div>
	);
}
