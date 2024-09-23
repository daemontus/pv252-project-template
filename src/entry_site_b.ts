import { initFibonacciUi } from "./fibonacci.ts";
import { initMenu } from "./menu.ts";

initMenu(document.querySelector(".main-menu")!, "menu-site-b");
initFibonacciUi(document.querySelector("#site-b"));
