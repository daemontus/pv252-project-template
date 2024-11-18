import { FASTElement, html } from "@microsoft/fast-element";
import { PeopleListContext } from "./PeopleListContextElement.js";
import { PersonElement } from "./PersonElement.js";

export class PeopleList extends FASTElement {
  // Probably will need to access the context state:

  @PeopleListContext data!: PeopleListContext;

  connectedCallback(): void {
    super.connectedCallback();
    for (let i = 0; i < this.data.people.length; i++) {
      console.log("Item loading:", this.data.people[i].isLoading());
    }

    this.data.people.forEach((personItem, index) => {
      const personElement = document.createElement(
        "person-element",
      ) as PersonElement;
      personElement.position = index;
      personElement.person = personItem;
      this.appendChild(personElement);
    });
  }
}

const personListTemplate = html<PeopleList>`<slot></slot>`;

PeopleList.define({
  name: "people-list",
  template: personListTemplate,
});
