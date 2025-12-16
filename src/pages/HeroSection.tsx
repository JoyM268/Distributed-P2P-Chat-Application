import { ArrowRight } from "lucide-react";

export default function HeroSection() {
	return (
		<div className="pt-40 z-0 w-full flex justify-center items-center flex-col gap-4">
			<div className="flex flex-col font-bold text-6xl text-center gap-1">
				<h1>Secure.</h1>
				<h1>Decentralized.</h1>
				<h1 className="text-blue-600">Real-Time Chat.</h1>
			</div>
			<p className="text-gray-700 w-md text-center">
				Peer-to-peer messaging with zero server storage. Your data never
				touches our servers.
			</p>
			<div className="flex gap-5">
				<button className="text-white font-semibold bg-blue-500 px-3 py-2 rounded-lg cursor-pointer">
					Get Started
				</button>
				<button className="flex items-center gap-1.5 font-semibold cursor-pointer">
					<span>Learn More</span>
					<ArrowRight size={12} strokeWidth={3} />
				</button>
			</div>
		</div>
	);
}
