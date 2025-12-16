import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signInWithEmailAndPassword, auth } from "@/services/firebase";
import { FirebaseError } from "firebase/app";

export default function Login() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	async function handleSubmit() {
		setLoading(true);
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			console.log("Successfully Logged In", userCredential.user.uid);
		} catch (err) {
			if (err instanceof FirebaseError) {
				console.log(err.message);
			} else {
				console.log("Error Occured");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="pt-32 flex flex-col w-full text-center items-center gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-3xl font-semibold">Welcome Back</h1>
				<p className="text-gray-700 text-sm">
					Sign in to continue to your conversations.
				</p>
			</div>
			<div className="max-w-7xl min-w-sm flex flex-col gap-5">
				<div className="flex flex-col gap-1">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						value={email}
						placeholder="Email"
						onChange={(e) => setEmail(e.target.value)}
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
				<Button
					className="bg-blue-500 mt-1 cursor-pointer hover:bg-blue-500/85"
					onClick={handleSubmit}
					disabled={loading}
				>
					{loading ? "Loading..." : "Login"}
				</Button>
			</div>
			<div className="text-gray-600 text-xs -mt-3">
				Don't have an account?{" "}
				<span className="text-blue-500 cursor-pointer">Signup</span>
			</div>
		</div>
	);
}
