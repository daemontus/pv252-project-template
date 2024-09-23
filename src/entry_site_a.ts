import { initFactorialUi } from "./factorial.ts";
import { initMenu } from "./menu.ts";

initMenu(document.querySelector<HTMLElement>(".main-menu")!, "menu-site-a");
initFactorialUi(document.querySelector<HTMLElement>("#site-a")!);
