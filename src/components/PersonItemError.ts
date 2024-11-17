import { attr, FASTElement, html } from "@microsoft/fast-element";
import { PeopleListContext } from "./PeopleListContextElement.js";

export class PersonItemError extends FASTElement {
  @attr
  position: number = 0;

  @PeopleListContext data!: PeopleListContext;

  public refresh() {
    this.data?.refresh(this.position);
  }
}

const template = html<PersonItemError>` <fluent-card
  style="padding: 16px; margin-bottom: 16px; height: 66px;"
>
  <span style="display: inline-block; margin: 4px 16px 4px 16px;">
    Item failed to load.
  </span>
  <fluent-button
    appearance="accent"
    style="float: left;"
    @click="${(x) => x.refresh()}"
  >
    Refresh
  </fluent-button>
</fluent-card>`;

PersonItemError.define({
  name: "person-item-error",
  template,
});
