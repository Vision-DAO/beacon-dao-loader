/**
 * A component that binds to the DOM, and shows the Vision logo, with a title:
 * Vision DAO.
 */
export default () => {
    const node = document.querySelector("#logosquare");
    if (node === null)
        return null;
    const instance = node.children[0].cloneNode(true);
    document.appendChild(instance);
    return instance;
};
