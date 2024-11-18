import {
  allComponents,
  provideFluentDesignSystem,
} from "@fluentui/web-components";

import "./components/PeopleList.js";
import "./components/PersonElement.js";
import "./components/ProgressBar.js";
import "./components/PeopleListContextElement.js";
import { DesignToken } from "@microsoft/fast-foundation";

provideFluentDesignSystem().register(allComponents);

// Note: This is not necessary if we are not using "themes" in Fluent design.
// Commenting it out makes the document more readable, because it removes
// the inline CSS realted to themes (in other words, comment this out 
// when debugging).
DesignToken.registerRoot(document.body);
