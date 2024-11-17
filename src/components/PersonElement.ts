import {
  attr,
  FASTElement,
  html,
  nullableNumberConverter,
  observable,
  when,
} from "@microsoft/fast-element";
import { PersonListItem } from "./PersonListItem.js";
import { PeopleListContext } from "./PeopleListContextElement.js";

export class PersonElement extends FASTElement {
  @PeopleListContext
  context = PeopleListContext;

  @attr({ converter: nullableNumberConverter })
  position: number = 0;

  @observable
  person?: PersonListItem;
}

const okState = html<PersonElement>`
  <person-item person="${(x) => x.person}" />
`;

const loadingState = html<PersonElement>` <person-item-loading /> `;
const errorState = html<PersonElement>` <person-item-error /> `;

const template = html<PersonElement>`
  <div class="box">
    ${when((x) => x.person?.isOk(), okState)}
    ${when((x) => x.person?.isLoading(), loadingState)}
    ${when((x) => x.person?.isError(), errorState)}
  </div>
`;

PersonElement.define({
  name: "person-element",
  template: template,
});
