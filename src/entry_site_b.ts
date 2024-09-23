import { initFibonacciUi } from "./fibonacci.ts";
import { initMenu } from "./menu.ts";

initMenu(document.querySelector<HTMLElement>(".main-menu")!, "menu-site-b");
initFibonacciUi(document.querySelector<HTMLElement>("#site-b")!);
