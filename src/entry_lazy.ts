import { initMenu } from "./menu.ts";
import { LazyList } from "./lazy_list.ts";
import { Person, loadFamousPeople, renderPerson } from "./famous_people.ts";

LazyList.register();
initMenu(document.querySelector<HTMLElement>(".main-menu")!, "menu-lazy-list");
const list = document.querySelector<LazyList<Person>>("#lazy-list")!;
list.setRenderer(renderPerson);
list.setData(loadFamousPeople().slice(0, 100));

console.log("Lazy site initialized...");
