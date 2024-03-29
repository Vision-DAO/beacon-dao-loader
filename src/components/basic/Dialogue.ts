/**
 * Success, info, alert, or warning.
 * Only warning so far.
 */
export enum DialogueStyle {
  Warning,
  Labeled,
  Secondary,
}

/**
 * See docs for component.
 */
export interface DialogueProps {
  title: string;
  titleIconSrc?: string;
  msg: string;
  style: DialogueStyle[];
}

export type DialogueComponent = { node: HTMLElement; close: () => void };

/**
 * A component that renders a curved, closable dialogue displaying a message,
 * and a title.
 */
export const Dialogue = (
  parent: Element = document.body,
  { title, titleIconSrc, msg, style = [DialogueStyle.Warning] }: DialogueProps
): DialogueComponent => {
  const container = parent.appendChild(document.createElement("div"));
  container.classList.add("dialogue");
  container.style.backgroundColor = "var(--secondary-bg-color)";
  container.style.padding = "2em";
  container.style.borderRadius = "0.5rem";
  container.style.border = "1.5px solid var(--main-bg-lightened)";
  container.style.opacity = "100%";
  container.style.transition = "0.3s";

  if (style.includes(DialogueStyle.Secondary))
    container.style.backgroundColor = "var(--main-bg-color)";

  const headerContainer = container.appendChild(document.createElement("div"));
  headerContainer.style.width = "100%";
  headerContainer.style.display = "flex";
  headerContainer.style.flexFlow = "row nowrap";
  headerContainer.style.alignItems = "center";

  const headerImage = headerContainer.appendChild(
    document.createElement("img")
  );
  headerImage.style.filter = "invert(1)";
  headerImage.style.marginRight = "1rem";
  headerImage.style.height = "2.5em";

  const header = headerContainer.appendChild(document.createElement("h1"));
  header.innerText = title;
  header.style.margin = "0";

  const message = container.appendChild(document.createElement("p"));
  message.style.opacity = "0.7";
  message.innerText = msg;

  if (style.includes(DialogueStyle.Warning))
    headerImage.setAttribute("src", "assets/icons/warning.svg");

  if (style.includes(DialogueStyle.Labeled)) {
    if (titleIconSrc) headerImage.setAttribute("src", titleIconSrc);
    else container.removeChild(headerImage);
  }

  // A convenience method to hide the dialogue, and deallocate it
  const closeDialogue = () => {
    container.classList.remove("visible");

    setTimeout(() => {
      parent.removeChild(container);
    }, 300);
  };

  return { node: container, close: closeDialogue };
};
