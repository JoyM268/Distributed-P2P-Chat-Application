import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { signInWithEmailAndPassword, auth } from "@/services/firebase";
import { FirebaseError } from "firebase/app";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";

export default function Login({
	setMenu,
}: {
	setMenu: Dispatch<SetStateAction<boolean>>;
}) {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setMenu(false);
	}, [setMenu]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		try {
			await signInWithEmailAndPassword(auth, email, password);
			toast.success("Successfully logged in.");
		} catch (err) {
			if (err instanceof FirebaseError) {
				console.log(err.message);
			} else {
				console.log("Error Occured");
			}
			toast.error("An error occured, please try again later.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="pt-32 flex flex-col w-full text-center items-center gap-6 px-6">
			<div className="flex flex-col gap-1 select-none">
				<h1 className="sm:text-3xl font-semibold text-2xl">
					Welcome Back
				</h1>
				<p className="text-gray-700 sm:text-sm text-xs">
					Sign in to continue to your conversations.
				</p>
			</div>
			<form
				className="max-w-7xl min-w-full sm:min-w-sm flex flex-col gap-5"
				onSubmit={handleSubmit}
			>
				<div className="flex flex-col gap-1 ">
					<Label
						className="sm:text-base text-sm select-none"
						htmlFor="email"
					>
						Email
					</Label>
					<Input
						id="email"
						value={email}
						placeholder="Email"
						className="sm:text-base text-sm"
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
						type="password"
						value={password}
						className="sm:text-base text-sm"
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
					/>
				</div>
				<Button
					className="bg-blue-500 mt-1 cursor-pointer hover:bg-blue-500/85 sm:text-base text-sm select-none"
					disabled={loading}
				>
					{loading ? "Loading..." : "Login"}
				</Button>
			</form>
			<div className="text-gray-600 text-xs -mt-3 select-none">
				Don't have an account?{" "}
				<NavLink to="/signup" className="text-blue-500 cursor-pointer">
					Signup
				</NavLink>
			</div>
		</div>
	);
}
