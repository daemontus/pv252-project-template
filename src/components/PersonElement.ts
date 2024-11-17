import {
  attr,
  FASTElement,
  html,
  nullableNumberConverter,
  observable,
  when,
} from "@microsoft/fast-element";
import { PersonListItem } from "./PersonListItem.js";

export class PersonElement extends FASTElement {
  @attr({ converter: nullableNumberConverter })
  position: number = 0;

  @observable
  person?: PersonListItem;
}

const okState = html<PersonElement>`
  <person-item person="${(x) => x.person!}" />
`;

const loadingState = html`
    <person-item-loading "/>
`;

const errorState = html<PersonElement>`
  <person-item-error position="${(x) => x.position}" />
`;

const template = html<PersonElement>`
  <div class="box">
    ${when((x) => x.person?.isOk(), okState)}
    ${when((x) => x.person?.isLoading(), loadingState)}
    ${when((x) => x.person?.isError() ?? true, errorState)}
  </div>
`;

PersonElement.define({
  name: "person-element",
  template: template,
});
