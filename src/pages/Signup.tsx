import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { auth, db, createUserWithEmailAndPassword } from "@/services/firebase";
import { FirebaseError } from "firebase/app";
import { ref, set, get } from "firebase/database";
import { NavLink } from "react-router-dom";

export default function Signup({
	setMenu,
}: {
	setMenu: Dispatch<SetStateAction<boolean>>;
}) {
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setMenu(false);
	}, [setMenu]);

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
		<div className="pt-24 sm:pt-32 flex flex-col w-full text-center items-center gap-6 px-6">
			<div className="flex flex-col gap-1 select-none">
				<h1 className="sm:text-3xl font-semibold text-2xl">
					Create an Account
				</h1>
				<p className="text-gray-700 sm:text-sm text-xs">
					Join our community and start chatting today.
				</p>
			</div>
			<form
				className="max-w-7xl min-w-full sm:min-w-sm flex flex-col gap-5"
				onSubmit={handleSubmit}
			>
				<div className="flex flex-col gap-1">
					<Label
						htmlFor="username"
						className="sm:text-base text-sm select-none"
					>
						Username
					</Label>
					<Input
						id="username"
						className="sm:text-base text-sm"
						value={username}
						placeholder="Username"
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label
						htmlFor="email"
						className="sm:text-base text-sm select-none"
					>
						Email
					</Label>
					<Input
						id="email"
						value={email}
						className="sm:text-base text-sm"
						placeholder="Email"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label
						htmlFor="password"
						className="sm:text-base text-sm select-none"
					>
						Password
					</Label>
					<Input
						id="password"
						className="sm:text-base text-sm"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label
						htmlFor="confirm"
						className="sm:text-base text-sm select-none"
					>
						Confirm Password
					</Label>
					<Input
						id="confirm"
						className="sm:text-base text-sm select-none"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Password"
					/>
				</div>
				<Button
					className="bg-blue-500 mt-1 cursor-pointer hover:bg-blue-500/85 sm:text-base text-sm select-none"
					disabled={loading}
				>
					{loading ? "Loading..." : "Create Account"}
				</Button>
			</form>
			<div className="text-gray-600 text-xs -mt-3 select-none">
				Already have an account?{" "}
				<NavLink to="/login" className="text-blue-500 cursor-pointer">
					Login
				</NavLink>
			</div>
		</div>
	);
}
