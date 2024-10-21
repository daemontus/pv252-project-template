import { attr, css, FASTElement, html, observable, when, repeat, Observable, Subscriber } from "@microsoft/fast-element";
import { reactive } from "@microsoft/fast-element/state.js";

import { allComponents, provideFluentDesignSystem } from '@fluentui/web-components';
import { loadFamousPeople, Person } from "./famous_people.js";
import { Context } from "@microsoft/fast-element/context.js";
provideFluentDesignSystem().register(allComponents);

// The probability of getting and error when loading a person.
const ERROR_RATE = 0.5;
// The time it takes to load one item (simulating data processing and network activity).
const LOAD_TIME = 1000;
// The number of items to be displayed in the list.
const ITEM_COUNT = 20;

class PersonListItem {
  data: Person | null = null;
  error: string | null = null;

  constructor(data: Person | null = null, error: string | null = null) {
    this.data = data;
    this.error = error;    
  }

  /**
   * True if the item is currently loading (i.e. it has no data).
   */
  isLoading(): boolean {
    return this.data === null && this.error === null;
  }

  /**
   * True if the item was loaded with an error.
   */
  isError(): boolean {
    return this.data === null && this.error !== null;
  }

  /**
   * True if the item is currently loaded properly and has data.
   */
  isOk(): boolean {
    return this.data !== null && this.error === null;
  }

  /**
   * Update the item with loaded person data.
   */
  setOk(data: Person) {
    this.data = data;
    this.error = null;
  }

  /**
   * Update the item with error string if loading failed.
   */
  setError(error: string) {
    this.data = null;
    this.error = error;
  }

  /**
   * Reset the data in this item to the default "loading" state.
   */
  setLoading() {
    this.data = null;
    this.error = null;
  }

}

export const PeopleListContext = Context.create<PeopleListContext>("Counter");
export interface PeopleListContext {
  // A list of "person-like" items. An item is either loading (no data available),
  // or it loaded with an error (an error string is provided), or it is fully loaded.
  people: PersonListItem[];

  // Indicates that at least one person in the list is still loading.
  isLoading: boolean;  

  // The number of loaded elements.
  loaded: number;

  // Refresh element at a given position.
  refresh(position: number): void;
}

export class PeopleListContextElement extends FASTElement implements PeopleListContext {

  @observable
  people: PersonListItem[] = [];

  @observable
  isLoading: boolean = false;

  @observable
  loaded: number = 0;

  // The full list of famous people that will serve as our "database". 
  // This is just dummy data. Normally, you would fetch it from server or 
  // retrieve it in some other way.
  allPeople = loadFamousPeople();

  constructor() {
    super();

    // Initialize the list with initial empty items.

    // The "reactive" part is very important! It means that not only is the
    // list itself observable, but also that the individual objects in that
    // list will notify upon change any templates that use them.
    let dummyData = [];
    for (let i=0; i<ITEM_COUNT; i++) {
      dummyData.push(reactive(new PersonListItem()));
    }
    this.people = dummyData;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Provide this element as context to the child components.
    PeopleListContext.provide(this, this);

    // This code simulates a long running "loading" script that
    // populates the "people" array one by one.
    
    this.isLoading = true;
    this.loaded = 0;
    const loadOne = () => {
      if (Math.random() > ERROR_RATE) {
        this.people[this.loaded].setOk(this.allPeople[this.loaded]);
        console.log("Loaded", this.people[this.loaded]);        
      } else {
        this.people[this.loaded].setError("Failed to load.");
        console.log("Failed to load.");
      }
      this.loaded += 1;
      if (this.loaded < this.people.length) {
        setTimeout(loadOne, LOAD_TIME);
      } else {
        this.isLoading = false;
      }
    }
    setTimeout(loadOne, LOAD_TIME);
  }

  refresh(position: number) {
    if (position >= 0 && position < this.people.length) {
      // Mark the entry as loading.
      if (this.people[position].isLoading()) {
        return; // Already refreshing.
      }
      this.people[position].setLoading();
      setTimeout(() => {
        if (Math.random() > 0.2) {
          this.people[position].setOk(this.allPeople[position]);
          console.log("Reloaded", this.people[position]);        
        } else {
          this.people[position].setError("Failed to load after refresh.");
          console.log("Failed to load.");
        }
      }, LOAD_TIME);
    }    
  }

}

PeopleListContextElement.define({
  name: "people-context",
  template: html`<slot></slot>`,
  styles: css``,
})

export class PersonElement extends FASTElement {
  // Some suggestions for properties you might want to use:

  // @PeopleListContext context!: PeopleListContext;

  // @attr position: number = 0;

  // @observable person: PersonListItem = new PersonListItem();
}

const personElementTemplate = html<PersonElement>``;

PersonElement.define({
  name: "person-item",
  template: personElementTemplate
})

export class PeopleList extends FASTElement {
  // Probably will need to access the context state:

  // @PeopleListContext data!: PeopleListContext;

  connectedCallback(): void {
    super.connectedCallback();

    // This may be the place where you want to add child elements
    // assuming they are not part of the template?
  }
}

const personListTemplate = html<PeopleList>`
<div></div>`

PeopleList.define({
  name: "people-list",
  template: personListTemplate
})