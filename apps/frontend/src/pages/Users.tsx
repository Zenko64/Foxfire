import { Ghost, User, UserSearch } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardHeader } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDebounce } from "@/hooks/useDebounce";
import { useUsers } from "@/hooks/users/queries";

export function UsersPage() {
	const [search, setSearch] = useState<string>("");

	const { data: users } = useUsers(useDebounce(search, 300));
	const nav = useNavigate();

	return (
		<div className="main-center flex flex-col">
			<div className="flex flex-row justify-between items-center p-2">
				<Input
					value={search}
					placeholder="Search users..."
					onChange={(e) => setSearch(e.target.value)}
					className="w-full sm:w-1/3"
				/>
			</div>
			<Separator />
			<div className="flex flex-col p-4 gap-2">
				{users && users.length > 0 ? (
					users?.map((u) => (
						<Card
							className="hover:cursor-pointer"
							onClick={() => nav(`/user/${u.username}`)}
						>
							<CardHeader>
								<div className="flex flex-row gap-2">
									{u?.image ? (
										<img alt="Avatar" src={u.image} className="size-32" />
									) : (
										<User className=" border p-4 size-20" />
									)}
									<div className="flex flex-col">
										<span className="text-lg font-semibold">
											{u.displayUsername}
										</span>
										<span className="text-xs text-muted-foreground font-mono">
											@{u.username}
										</span>
									</div>
								</div>
							</CardHeader>
						</Card>
					))
				) : !search && !users ? (
					<Empty>
						<EmptyHeader>
							<EmptyMedia>
								<UserSearch />
							</EmptyMedia>
							<EmptyTitle>Find Users</EmptyTitle>
							<EmptyDescription>
								Search for people you know to see their posts.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : (
					<Empty>
						<EmptyHeader>
							<EmptyMedia>
								<Ghost />
							</EmptyMedia>
							<EmptyTitle>No Results</EmptyTitle>
							<EmptyDescription>
								We looked everywhere, and found nothing...
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				)}
			</div>
		</div>
	);
}
