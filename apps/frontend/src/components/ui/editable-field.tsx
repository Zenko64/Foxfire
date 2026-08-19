import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface Props {
	value?: string;
	onSave: (value: string) => void;
	render?: React.ReactNode;
	editable?: boolean;
}

export function EditableField({
	value,
	editable = true,
	onSave,
	render,
}: Props) {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [data, setData] = useState<string>("");

	if (!editable) {
		return <>{render ?? value}</>;
	}

	return isEditing ? (
		<Input
			autoFocus
			value={data}
			onChange={(e) => setData(e.target.value)}
			onBlur={() => {
				onSave(data);
				setIsEditing(false);
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter") onSave(data);
				setIsEditing(false);
				if (e.key === "Escape") setIsEditing(false);
			}}
		/>
	) : (
		<Button variant="ghost" onClick={() => setIsEditing(true)}>
			{render ?? value}
		</Button>
	);
}
