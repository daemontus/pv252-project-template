import { FASTElement, html, repeat } from "@microsoft/fast-element";
import { PeopleListContext } from "./PeopleListContextElement.js";

export class PeopleList extends FASTElement {
  // Probably will need to access the context state:

  @PeopleListContext data!: PeopleListContext;

  connectedCallback(): void {
    super.connectedCallback();
    // This may be the place where you want to add child elements
    // assuming they are not part of the template?
    for (let i = 0; i < this.data.people.length; i++) {
      console.log("Item loading:", this.data.people[i].isLoading());
    }
  }
}

const personListTemplate = html<PeopleList>` <fluent-card>
  ${repeat(
    (x) => x.data.people,
    html`
      <person-element
        person="${(x) => x.person}"
        position="${(_, c) => c.index}"
        style="margin: 1rem"
      />
    `,
  )}
</fluent-card>`;

PeopleList.define({
  name: "people-list",
  template: personListTemplate,
});
