import UIkit from "uikit";
import { initMenu } from "./menu.ts";

initMenu(document.querySelector<HTMLElement>(".main-menu")!, "menu-home");

console.log("Main site initialized...");

UIkit.notification("Hello World!", { pos: "bottom-right" });
