import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { auth, db, createUserWithEmailAndPassword } from "@/services/firebase";
import { FirebaseError } from "firebase/app";
import { ref, set, get } from "firebase/database";
import { NavLink } from "react-router-dom";

export default function Signup() {
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (password !== confirmPassword) {
			console.log("Passwords do not match");
			return;
		}

		setLoading(true);

		const normalizedUsername = username.trim().toLowerCase();

		try {
			const usernameRef = ref(db, `usernames/${normalizedUsername}`);
			const snapshot = await get(usernameRef);

			if (snapshot.exists()) {
				console.log("Username already taken");
				return;
			}

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			const user = userCredential.user;

			await set(ref(db, `users/${user.uid}`), {
				username: normalizedUsername,
				email: user.email,
				createdAt: Date.now(),
			});

			await set(usernameRef, user.uid);

			console.log("Successfully Signed Up");
		} catch (err) {
			if (err instanceof FirebaseError) {
				console.log(err.message);
			} else {
				console.log(err);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="pt-32 flex flex-col w-full text-center items-center gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-3xl font-semibold">Create an Account</h1>
				<p className="text-gray-700 text-sm">
					Join our community and start chatting today.
				</p>
			</div>
			<form
				className="max-w-7xl min-w-sm flex flex-col gap-5"
				onSubmit={handleSubmit}
			>
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
				<Button
					className="bg-blue-500 mt-1 cursor-pointer hover:bg-blue-500/85"
					disabled={loading}
				>
					{loading ? "Loading..." : "Create Account"}
				</Button>
			</form>
			<div className="text-gray-600 text-xs -mt-3">
				Already have an account?{" "}
				<NavLink to="/login" className="text-blue-500 cursor-pointer">
					Login
				</NavLink>
			</div>
		</div>
	);
}
