import { FASTElement, html, when } from "@microsoft/fast-element";
import { PeopleListContext } from "./PeopleListContextElement.js";

export class ProgressBar extends FASTElement {
  @PeopleListContext
  data!: PeopleListContext;
}

const template = html<ProgressBar>`
  ${when(
    (x) => x.data.isLoading,
    html<ProgressBar>`
      <fluent-card style="padding: 16px; margin-bottom: 16px;">
        <span style="display: block; margin-bottom: 8px;">
          Loaded ${(x) => x.data.loaded}/${(x) => x.data.people.length}:
        </span>
        <fluent-progress
          max="${(x) => x.data.people.length}"
          value="${(x) => x.data.loaded}"
        />
      </fluent-card>
    `,
  )}
`;

ProgressBar.define({
  name: "progress-bar",
  template,
});
