import UIkit from "uikit";
import { initMenu } from "./menu.ts";
import { initFactorialUi } from "./factorial.ts";
import { initFibonacciUi } from "./fibonacci.ts";

initMenu(document.querySelector<HTMLElement>(".main-menu")!, "menu-home");
const site_a = document.querySelector<HTMLElement>("#site-a")!;
const site_b = document.querySelector<HTMLElement>("#site-b")!;
initFactorialUi(site_a);
initFibonacciUi(site_b);

site_a.onclick = () => {
  UIkit.notification("Going to factorials in 3s...", { pos: "bottom-right" });
  setTimeout(() => {
    UIkit.notification("Going to factorials in 2s...", { pos: "bottom-right" });
    setTimeout(() => {
      UIkit.notification("Going to factorials in 1s...", {
        pos: "bottom-right",
      });
      setTimeout(() => {
        location.href = "/site_a.html";
      }, 1000);
    }, 1000);
  }, 1000);
};

site_b.onclick = () => {
  UIkit.notification("Going to fibonacci in 3s...", { pos: "bottom-right" });
  setTimeout(() => {
    UIkit.notification("Going to fibonacci in 2s...", { pos: "bottom-right" });
    setTimeout(() => {
      UIkit.notification("Going to fibonacci in 1s...", {
        pos: "bottom-right",
      });
      setTimeout(() => {
        location.href = "/site_b.html";
      }, 1000);
    }, 1000);
  }, 1000);
};

console.log("Main site initialized...");

UIkit.notification("Hello World!", { pos: "bottom-right" });
