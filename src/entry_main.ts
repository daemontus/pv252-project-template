import {
  allComponents,
  provideFluentDesignSystem,
} from "@fluentui/web-components";

import "./components/PeopleList.js";
import "./components/PersonElement.js";
import "./components/ProgressBar.js";
import "./components/PeopleListContextElement.js";
import "./components/PersonItem.js";
import "./components/PersonItemError.js";
import "./components/PersonItemLoading.js";
import { DesignToken } from "@microsoft/fast-foundation";

provideFluentDesignSystem().register(allComponents);
DesignToken.registerRoot(document.body);
