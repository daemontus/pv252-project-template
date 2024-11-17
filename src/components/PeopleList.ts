import { FASTElement, html, repeat } from "@microsoft/fast-element";
import { PeopleListContext } from "./PeopleListContextElement.js";
import { PersonElement } from "./PersonElement.js";

export class PeopleList extends FASTElement {
  // Probably will need to access the context state:

  @PeopleListContext data!: PeopleListContext;

  connectedCallback(): void {
    super.connectedCallback();
    // This may be the place where you want to add child elements
    // assuming they are not part of the template?
  }
}

const personListTemplate = html<PeopleList>` <div class="fa-list">
  ${repeat(
    (x) => x.data.people,
    html<PersonElement>`
      <person-element
        person="${(x) => x.person}"
        position="${(_, c) => c.index}"
        style="margin: 1rem"
      />
    `,
    { recycle: true },
  )}
</div>`;

PeopleList.define({
  name: "people-list",
  template: personListTemplate,
});
