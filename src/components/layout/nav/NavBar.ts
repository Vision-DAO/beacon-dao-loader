export interface Page {
	cb: () => void,
	onClose: () => void,
	iconSrc: string,
}

/**
 * A component that uses some strategy to render a switchable navigation bar.
 */
export type NavBar = (parent: HTMLElement, pages: { [name: string]: Page }) => HTMLElement;

/**
 * A method that implements functionality for switching to the current context-
 * activated page.
 */
export type PageSwitcher = () => void;

/**
 * A function that creates a new PageSwitcher by registering the given
 * deallocation strategy.
 */
export type PageSwitcherMaker = (onClose: () => void) => PageSwitcher;

/**
 * A utility class that sets up subscribers and publishers for switching
 * between pages.
 */
export const NavBarContext = (cb: (switchToPage: PageSwitcherMaker) => void) => {
	const listeners: (() => void)[] = [];

	cb((onClose): PageSwitcher => {
		const i = listeners.length;
		listeners.push(onClose);
		
		return () => {
			listeners.filter((_listener, index) => index !== i)
				.forEach((listener) => listener());
		};
	});
};
