import { BanIcon, Edit, Ghost, User } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { PostsFeed } from "@/components/posts/Feed";
import { ProfileEditDialog } from "@/components/profile/ProfileEditor";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/users/queries";
import { authClient } from "@/lib/auth";

export function ProfilePage() {
	const nav = useNavigate();
	const { username: usernamePathParam } = useParams();

	// State
	const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

	// Account data
	const { data: session, isPending } = authClient.useSession();
	const profileUsername = usernamePathParam ?? session?.user.username;
	const { data, error } = useUser(profileUsername ?? "");

	const isOwner = session?.user.username === data?.username;

	if (!usernamePathParam) {
		if (isPending) return null;
		if (!session)
			return (
				<div className="items-center justify-center flex flex-1 flex-col">
					<Empty>
						<EmptyHeader>
							<EmptyMedia>
								<BanIcon />
							</EmptyMedia>
							<EmptyTitle>Unauthorized</EmptyTitle>
							<EmptyDescription>
								You need an account to access this page.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				</div>
			);
		return <Navigate to={`/user/${session.user.username}`} replace />;
	}

	if (error?.status === 404 || !profileUsername) {
		return (
			<div className="items-center justify-center flex flex-1 flex-col">
				<Empty>
					<EmptyHeader>
						<EmptyMedia>
							<Ghost />
						</EmptyMedia>
						<EmptyTitle>404</EmptyTitle>
						<EmptyDescription>
							The requested user wasn't found.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</div>
		);
	}

	if (error && !data) {
		return (
			<div className="items-center justify-center flex flex-1 flex-col">
				<Empty>
					<EmptyHeader>
						<EmptyMedia>
							<BanIcon />
						</EmptyMedia>
						<EmptyTitle>Error</EmptyTitle>
						<EmptyDescription>
							Failed to load user. Please try again.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</div>
		);
	}

	if (!data) return null;
	return (
		<div className="main-center flex flex-col">
			<div className="flex flex-row p-8 justify-between">
				<div className="flex flex-row">
					{data?.image ? (
						<img alt="Avatar" src={data.image} className="size-32" />
					) : (
						<User className=" border p-4 size-20" />
					)}
					<div className="flex flex-col items-start justify-start pl-4">
						<p className="text-xl">{data?.displayUsername}</p>
						<p className="text-xs text-muted-foreground">@{data?.username}</p>
					</div>
				</div>
				<div className="flex flex-row">
					{isOwner && session && (
						<Dialog onOpenChange={setIsEditingProfile} open={isEditingProfile}>
							<DialogTrigger
								render={
									<Button variant="outline">
										<Edit />
										Edit
									</Button>
								}
							/>
							<ProfileEditDialog
								onSuccess={(data) => {
									setIsEditingProfile(false);
									if (data.username !== session.user.username)
										nav(`/user/${data.username}`);
								}}
							/>
						</Dialog>
					)}
				</div>
			</div>
			<Separator />
			<PostsFeed author={profileUsername} />
		</div>
	);
}
