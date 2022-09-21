import { Button } from "./Button";
import {
	DialogueStyle,
	Dialogue,
	DialogueProps as StdDialogueProps,
} from "./Dialogue";

/**
 * See docs for component.
 */
interface DialogueProps {
	btnText?: string;
	btnIconSrc?: string;
	onClick?: () => void;
}

export type DialogueComponent = {
	node: HTMLElement;
	setLoading: (loading: boolean) => void;
};

/**
 * A component that renders a curved, closable dialogue displaying a message,
 * title, and button with some text.
 */
export const ActionableDialogue = (
	parent: Element = document.body,
	{
		title,
		titleIconSrc,
		msg,
		btnText,
		btnIconSrc,
		onClick,
		style = [DialogueStyle.Warning],
	}: DialogueProps & StdDialogueProps
): DialogueComponent => {
	const { node: container, close: closeDialogue } = Dialogue(parent, {
		title,
		titleIconSrc,
		msg,
		style,
	});

	// Only render the button if there is text to fill it. Match the style
	if (!btnText) {
		return { node: container, setLoading: () => ({}) };
	}

	const { node: btn, setLoading } = Button(container, {
		label: btnText,
		onClick: onClick || closeDialogue,
		iconSrc: btnIconSrc,
	});
	btn.style.marginTop = "1.5rem";

	return { node: container, setLoading };
};
