import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Signup() {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");

	return (
		<div className="pt-32 flex flex-col w-full text-center items-center gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-3xl font-semibold">Create an Account</h1>
				<p className="text-gray-700 text-sm">
					Join our community and start chatting today.
				</p>
			</div>
			<div className="max-w-7xl min-w-sm flex flex-col gap-5">
				<div className="flex flex-col gap-1">
					<Label htmlFor="username">Username</Label>
					<Input
						id="username"
						value={username}
						placeholder="Username"
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label htmlFor="confirm">Confirm Password</Label>
					<Input
						id="confirm"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Password"
					/>
				</div>
				<Button className="bg-blue-500 mt-1 cursor-pointer hover:bg-blue-500/85">
					Create Account
				</Button>
			</div>
			<div className="text-gray-600 text-xs -mt-3">
				Already have an account?{" "}
				<span className="text-blue-500 cursor-pointer">Login</span>
			</div>
		</div>
	);
}
