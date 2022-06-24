/**
 * A component that binds to the DOM, and shows the Vision logo, with a title:
 * Vision DAO.
 */
export default (parent: Node = document.body): Node => {
	const container = parent.appendChild(document.createElement("div"));

	const img = container.appendChild(document.createElement("img"));
	img.setAttribute("width", "30vw");
	img.setAttribute("src", "assets/Vision_Eye_Black.png");
	img.setAttribute("alt", "The Vision Logo");
	img.style.width = "30vw";
	img.style.filter = "invert(1)";

	return container;
};
