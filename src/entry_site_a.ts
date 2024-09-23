import { initFactorialUi } from "./factorial.ts";
import { initMenu } from "./menu.ts";

initMenu(document.querySelector(".main-menu")!, "menu-site-a");
initFactorialUi(document.querySelector("#site-a"));
