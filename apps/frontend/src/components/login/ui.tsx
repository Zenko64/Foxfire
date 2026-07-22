import { cn } from "@/lib/utils";
import { Input as InputNative } from "../ui/input";

export function Input({
	isInvalid,
	className,
	...props
}: { isInvalid?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<InputNative
			{...props}
			className={cn("ring-inset", className)}
			aria-invalid={isInvalid}
		/>
	);
}
