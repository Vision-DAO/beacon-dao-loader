import { Component } from "./Component";

export interface BlockInputProps {
	placeholder: string;
	init?: string;
	onChange: (v: string) => void;
}

/**
 * Displays an input following the material UI guidelines for inputs.
 */
export const BlockInput = ({
	placeholder,
	init,
	onChange,
}: BlockInputProps): Component => {
	return (parent) => {
		const input = parent.appendChild(document.createElement("input"));

		input.placeholder = placeholder;

		if (init) input.value = init;

		input.onchange = (e) => {
			const target = e.target as HTMLInputElement;

			onChange(target.value);
		};

		input.className = "input hoverable";

		return input;
	};
};
