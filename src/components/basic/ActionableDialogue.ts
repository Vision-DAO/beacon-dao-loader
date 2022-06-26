import { Button } from "./Button";

/**
 * Success, info, alert, or warning.
 * Only warning so far.
 */
export enum DialogueStyle {
	Warning,
	Labeled
}

/**
 * See docs for component.
 */
interface DialogueProps {
	title: string,
	titleIconSrc?: string,
	msg: string,
	btnText?: string,
	btnIconSrc?: string,
	onClick?: () => void,
	style: DialogueStyle,
}

export type DialogueComponent = { node: Element, setLoading: (loading: boolean) => void };

/**
 * A component that renders a curved, closable dialogue displaying a message,
 * title, and button with some text.
 */
export const ActionableDialogue = (parent: Element = document.body, { title, titleIconSrc, msg, btnText, btnIconSrc, onClick, style = DialogueStyle.Warning }: DialogueProps): DialogueComponent => {
	const container = parent.appendChild(document.createElement("div"));
	container.classList.add("dialogue");
	container.style.backgroundColor = "var(--secondary-bg-color)";
	container.style.padding = "2em";
	container.style.borderRadius = "0.5rem";
	container.style.border = "1.5px solid var(--main-bg-lightened)";

	const headerContainer = container.appendChild(document.createElement("div"));
	headerContainer.style.width = "100%";
	headerContainer.style.display = "flex";
	headerContainer.style.flexFlow = "row nowrap";
	headerContainer.style.alignItems = "center";

	const headerImage = headerContainer.appendChild(document.createElement("img"));
	headerImage.style.filter = "invert(1)";
	headerImage.style.marginRight = "1rem";
	headerImage.style.height = "2.5em";

	const header = headerContainer.appendChild(document.createElement("h1"));
	header.innerText = title;
	header.style.margin = "0";

	const message = container.appendChild(document.createElement("p"));
	message.style.opacity = "0.7";
	message.innerText = msg;

	switch (style) {
	case DialogueStyle.Warning:
		headerImage.setAttribute("src", "assets/icons/warning.svg");

		break;
	case DialogueStyle.Labeled:
		if (titleIconSrc)
			headerImage.setAttribute("src", titleIconSrc);
		else
			container.removeChild(headerImage);

		break;
	}

	// Only render the button if there is text to fill it. Match the style
	if (!btnText) {
		return { node: container, setLoading: () => ({}) };
	}

	// A convenience method to hide the dialogue, and deallocate it
	const closeDialogue = () => {
		container.classList.remove("visible");

		setTimeout(() => {
			parent.removeChild(container);
		}, 300);
	};

	const { node: btn, setLoading } = Button(container, { label: btnText, onClick: onClick || closeDialogue, iconSrc: btnIconSrc });
	btn.style.marginTop = "1.5rem";

	return { node: container, setLoading };
};
