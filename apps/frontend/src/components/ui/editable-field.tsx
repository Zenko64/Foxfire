import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface Props extends React.ComponentPropsWithRef<typeof Input> {
	render?: React.ReactNode;
	editable?: boolean;
}

export function EditableField({
	editable = true,
	render,
	value,
	onBlur,
	...inputAttrs
}: Props) {
	const [isEditing, setIsEditing] = useState<boolean>(false);

	if (!editable) {
		return <>{render ?? value}</>;
	}

	return isEditing ? (
		<Input
			{...inputAttrs}
			autoFocus
			value={value}
			onBlur={(e) => {
				setIsEditing(false);
				if (onBlur) onBlur(e);
			}}
			onKeyDown={(e) => {
				if (e.key == "Enter") {
					setIsEditing(false);
				}
				if (e.key === "Escape") {
					setIsEditing(false);
				}
			}}
		/>
	) : (
		<Button
			variant="link"
			onClick={() => {
				setIsEditing(true);
			}}
		>
			{render ?? value}
		</Button>
	);
}
