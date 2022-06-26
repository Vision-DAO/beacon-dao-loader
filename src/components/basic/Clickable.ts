/**
 * Adds a touchevent listener and a tap listener to the given element.
 */
export const Clickable = <T extends HTMLElement,>(elem: T, cb: () => void, hoverable?: boolean): T => {
	elem.addEventListener("touchend", cb);
	elem.addEventListener("click", cb);
	elem.style.cursor = "pointer";

	if (hoverable) {
		elem.style.transition = "0.3s opacity";
		elem.classList.add("hoverable");
	}

	return elem;
};
