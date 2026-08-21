import { UserIcon } from "lucide-react";
import type { User } from "@/hooks/users/queries";
import { DialogContent } from "../ui/dialog";

export function ProfileEditDialog({ user }: { user: User }) {
	return (
		<DialogContent>
			{user.image ? (
				<img alt="Avatar" src={user.image} className="size-15" />
			) : (
				<UserIcon className=" border p-4 size-15" />
			)}
		</DialogContent>
	);
}
