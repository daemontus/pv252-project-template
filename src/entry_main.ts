import { initMenu } from "./menu.ts";
import { loadFamousPeople, renderPerson } from "./famous_people.ts";

initMenu(document.querySelector<HTMLElement>(".main-menu")!, "menu-home");

const start = performance.now();

const people = loadFamousPeople();

const data_loaded = performance.now();

const naive_list: HTMLElement = document.getElementById("naive-list")!;
for (const person of people.slice(0, 100)) {
  naive_list.appendChild(renderPerson(person));
}

const finished = performance.now();

console.log(
  "Main site initialized...",
  data_loaded - start,
  finished - data_loaded,
);
