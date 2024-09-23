import settings_icon from "./img/settings.svg";

export function initMenu(container: HTMLElement, selected: string) {
  const icon: HTMLImageElement = container.querySelector(".menu-icon")!;
  icon.src = settings_icon;
  const selection = container.getElementsByClassName(selected);
  if (selection.length > 0) {
    selection[0].classList.add("uk-active");
  }
}
