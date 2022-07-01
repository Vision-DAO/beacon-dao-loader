import { Component } from "./Component";

export interface ReactiveProps<TContent, TEvent = TContent> {
	updater: (v: TContent, node: HTMLElement) => void,

	// An initial or default value
	init: Promise<TContent>,

	stream: (listener: (e: TEvent) => void) => void,
	transformer: (event: TEvent) => TContent,

	// Items to show while loading
	loadingContent?: Component,
}

/**
 * Transforms a T | null type into a T type by falling back to a "not found"
 * display element that replaces the active one.
 */
export const NullTransformer = <T,>(active: HTMLElement, alt: HTMLElement, v: T | null): T => {
	// Revert to the 404 content
	if (v === null) {
		active.style.opacity = "0%";
		alt.style.opacity = "100%";

		return {} as T;
	}

	alt.style.opacity = "0%";
	active.style.opacity = "100%";

	return v;
};

/**
 * A strategy for updating a reactive component that sets its text to a new
 * value.
 */
export const TextElemUpdater = (val: string, elem: HTMLElement) => {
	elem.innerText = val;
};

/**
 * Monad that maps a component to a reactive component with the indicated props.
 */
export const ReactiveComponent = <TContent, TEvent = TContent>(elem: Component,
	props: ReactiveProps<TContent, TEvent>): Component => 
		(parent: Node) => Reactive(elem(parent), props);

/**
 * A wrapper for components that needs to transition between loading, and
 * multiple viewing states.
 *
 * Displays a shimmering white box on loading state, then transitions smoothly
 * the found value.
 *
 * Listens to an event handler whose event value can be transformed into the
 * specified content value.
 */
export const Reactive = <TContent, TEvent = TContent>(elem: HTMLElement, {
	updater,
	init,
	stream,
	transformer,
	loadingContent
}: ReactiveProps<TContent, TEvent>): HTMLElement => {
	let loader: HTMLElement | null = null;

	(async () => {
		const initContent = await init;

		// Once the initial content is loaded, remove the loading anim
		elem.classList.remove("shimmer-loading");

		if (loader !== null) {
			elem.removeChild(loader);
		} else {
			elem.style.width = "auto";
		}

		updater(initContent, elem);

		stream((e) => {
			updater(transformer(e), elem);
		});
	})();

	elem.style.maxWidth = "100%";

	if (!loadingContent) {
		elem.innerHTML = "&nbsp;";
		elem.classList.add("shimmer-loading");
		elem.style.width = "15em";

		return elem;
	}

	loader = loadingContent(elem);

	return elem;
};
