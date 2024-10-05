import { initMenu } from "./menu.ts";
import { LazyList } from "./lazy_list.ts";

LazyList.register();
initMenu(document.querySelector<HTMLElement>(".main-menu")!, "menu-lazy-list");

console.log("Lazy site initialized...");
