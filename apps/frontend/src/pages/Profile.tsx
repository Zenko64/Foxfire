import { User } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/users/queries";
import { authClient } from "@/lib/auth";
import { EditableField } from "../components/ui/editable-field";

export function Profile() {
	const { user: usernameParam } = useParams();
	const { data: session } = authClient.useSession();

	const [isModifying, setIsModifying] = useState<
		"avatar" | "displayName" | "username" | null
	>(null);

	const { data } = useUser(
		usernameParam ?? (session && session?.user.username) ?? "",
	);

	return (
		<div className="main-center flex flex-col">
			<div className="flex flex-row p-8">
				{data?.image ? (
					<img alt="Avatar" src={data.image} className="size-32" />
				) : (
					<User className=" border p-4 size-20" />
				)}
				<div className="flex flex-col items-start justify-start pl-4">
					<EditableField
						value={data?.displayUsername ?? ""}
						onSave={(v) => authClient.updateUser({ displayUsername: v })}
					/>
					<h3>{data?.username}</h3>
				</div>
			</div>
		</div>
	);
}
