import {
  attr,
  FASTElement,
  html,
  nullableNumberConverter,
  Observable,
  observable,
  repeat,
  Subscriber,
} from "@microsoft/fast-element";
import { reactive } from "@microsoft/fast-element/state.js";
import { Context } from "@microsoft/fast-element/context.js";

/*
  The following is an example of a "basic" list rendered only using templates.
 */

/**
 * This list implements the more common, but less flexible list component
 * design pattern, where items are rendered inside the list template
 * (here, using the `repeat` directive).
 *
 * This approach is reasonably simple, especially for lists that either (a)
 * don't have a lot of mutable state (or any mutable state), or (b) have simple
 * items and are short, so that they can be conceptually viewed
 * as a single UI component.
 *
 * However, it also has several disadvantages:
 *  * If one item changes, the list has to be fully re-drawn. This can be
 *    somewhat optimized, but is to some extent unavoidable.
 *  * If the list items are complex, that rendering logic is now
 *    part of the list element and is not reusable.
 *  * The list items are part of the shadow DOM of this HTML element, meaning
 *    they cannot be accessed or modified by outside JavaScript (this could
 *    also be a good thing, but usually isn't what we expect a "list" to do).
 *
 * This could be partially resolved by also declaring a separate
 * `BasicListItem` element that would be responsible for rendering the items,
 * making the rendering logic (somewhat) reusable. However, then we have to
 * deal with two problems:
 *
 *  (a) In our templates, how do we "pass" individual item data to
 *      the corresponding `BasicListItem`? Usually, `BasicListItem` would have
 *      attributes using which we can change its state, but this becomes rather
 *      messy if each item uses a lot of data;
 *  (b) To change the state of an item, `BasicListItem` needs to somehow notify
 *      the `BasicList` element, where the state is actually stored. That means
 *      it either needs a direct reference to the `BasicList` element, or it
 *      needs to emit events that can be captured by `BasicList`.
 *
 * For a simple example list this one, a basic list is perhaps sufficient.
 * But as you can see, this can quickly become
 * a complex architectural problem...
 */
export class BasicCheckboxList extends FASTElement {
  @observable
  checkedState: boolean[] = [];

  @attr({ converter: nullableNumberConverter })
  items: number | null = 0;

  public itemsChanged(_oldValue: number | null, newValue: number | null) {
    const targetLength = newValue!;
    // Update the number of state items in response to attribute change.
    while (this.checkedState.length > targetLength) {
      this.checkedState.pop();
    }
    while (this.checkedState.length < targetLength) {
      this.checkedState.push(false);
    }
  }

  public toggleOne(position: number, value: boolean) {
    console.log("[Basic] Toggled", position, value);
    this.checkedState[position] = value;

    // Importantly, at this point, only an item inside the checkState list
    // has changed, which isn't enough to cause HTML templates to update
    // (the checkedState list object is still the same, only it's internal
    // state was mutated). So instead, we explicitly "notify" everyone that
    // is observing the changes of checkedState that the array has changed.
    Observable.notify(this, "checkedState");
  }
}

const basicListTemplate = html<BasicCheckboxList>`
  ${(list) => console.log("Redrawing basic list...", list.checkedState)}
  <div>
    ${repeat(
      (list) => list.checkedState,
      html<boolean, BasicCheckboxList>`
        <div>
          <fluent-checkbox
            ?checked="${(isChecked) => isChecked}"
            @click="${(isChecked, ctx) =>
              ctx.parent.toggleOne(ctx.index, !isChecked)}"
          >
            Item is checked: ${(isChecked) => isChecked}
          </fluent-checkbox>
        </div>
      `,
      { positioning: true },
    )}
  </div>
`;
BasicCheckboxList.define({
  name: "basic-checkbox-list",
  template: basicListTemplate,
});

/*
  The following is an example of a list rendered using
  a shared "context" object.
 */

/* Type of state held by one list item. */
interface CheckboxListItem {
  isChecked: boolean;
}

/* Type of state held by the whole item list. */
interface CheckboxList {
  checkedState: CheckboxListItem[];

  toggleOne(position: number, value: boolean): void;
}

/* A "provider" responsible for serving context to child components. */
const CheckboxListProvider = Context.create<CheckboxList>("CheckboxList");

/**
 * The HTML element that is responsible for rendering one item in the list.
 * It gets the item state from the `context` object, and renders a simple
 * template showing the checkbox and a label. Note that the `position`
 * attribute is nullable for the sake of completeness: We can't have
 * required attributes on HTML elements, but in this demo we always ensure
 * that the value of this element is set.
 */
export class ContextListItem extends FASTElement {
  @CheckboxListProvider context!: CheckboxList;

  // Here, position stands in for a proper "item ID". Usually, what we would
  // have is a collection of items identified through some unique ID. We would
  // then use that ID to access data provided by our context.
  @attr({ converter: nullableNumberConverter })
  position: number | null = 0;

  public state(): CheckboxListItem {
    if (this.position !== null) {
      return this.context.checkedState[this.position];
    } else {
      return { isChecked: false };
    }
  }

  public toggle() {
    if (this.position == null) {
      return; // Cannot toggle when not assigned a position.
    }

    const current = this.context.checkedState[this.position].isChecked;
    this.context.toggleOne(this.position, !current);
  }
}

ContextListItem.define({
  name: "context-list-item",
  // The template for the list item is responsible for showing the text
  // and the checkbox. It gets this data from the context property.
  template: html<ContextListItem>`
    <div>
        <fluent-checkbox
                ?checked="${(x) => x.state().isChecked}"
                @click="${(x) => x.toggle()}"
      >
            Item is checked: ${(x) => x.state().isChecked}
      </fluent-checkbox>
    </div>
  `,
});

/**
 * `ContextCheckboxList` (together with `CheckboxList` interface and the
 * `ContextListItem` element) provide an alternative solution
 * to the state management problem.
 *
 * Of course, this is an absurdly complicated solution if each item in the
 * list is just a checkbox. But it should demonstrate how to approach the
 * problem if the state of the list items is complicated, or if the list items
 * need to interact with other parts of the application state.
 *
 */
export class ContextCheckboxList extends FASTElement implements CheckboxList {
  @attr({ converter: nullableNumberConverter })
  items: number | null = 0;

  @observable
  checkedState: CheckboxListItem[] = [];

  connectedCallback() {
    super.connectedCallback();

    // Register this element as the provider of the
    // `CheckboxList` implementation.
    CheckboxListProvider.provide(this, this);

    // Create necessary child elements.
    this.updateItemCount(this.items);

    // Whenever "items" changes, call updateItemCount to ensure the
    // list has the right amount of elements.
    Observable.getNotifier(this).subscribe(
      <Subscriber>{
        handleChange(subject: ContextCheckboxList): void {
          subject.updateItemCount(subject.items);
        },
      },
      "items",
    );
  }

  /**
   * Update the number of child elements and state items to match the
   * one requested by the items attribute.
   *
   * This method should only be called once the list element is connected
   * to the UI hierarchy (i.e. after `connectedCallback`) to ensure that the
   * child elements can access the context object.
   *
   * @param count
   */
  updateItemCount(count: number | null) {
    console.log("[Context] New item count:", count);
    const targetLength = count ?? 0;
    while (this.children.length > targetLength) {
      this.removeChild(this.lastChild!);
      this.checkedState.pop();
    }
    while (this.children.length < targetLength) {
      // Here, `reactive` makes each list item "observable", meaning any
      // HTML templates that use it will be redrawn when the value changes.
      this.checkedState.push(reactive({ isChecked: false }));

      const newItem = new ContextListItem();
      newItem.position = this.children.length;
      this.appendChild(newItem);
    }
  }

  toggleOne(position: number, value: boolean) {
    console.log("[Context] Toggled", position, value);
    if (!this.checkedState[position]) return;
    this.checkedState[position].isChecked = value;
  }
}

ContextCheckboxList.define({
  name: "context-checkbox-list",
  // The HTML for the list itself is just a <div> with a <slot> inside to
  // put all the child elements in.
  template: html` <div>
    <slot></slot>
  </div>`,
});

/*
  Finally, we make the Add/Remove buttons work in a very rudimentary way.
 */

const basicAdd = document.getElementById("basic-add")!;
if (basicAdd) {
  basicAdd.onclick = () => {
    const list = document.querySelector<BasicCheckboxList>(
      "#basic-checkbox-list",
    )!;
    list.items! += 1;
  };
}

const basicRemove = document.getElementById("basic-remove");
if (basicRemove) {
  basicRemove.onclick = () => {
    const list = document.querySelector<BasicCheckboxList>(
      "#basic-checkbox-list",
    )!;
    if (list.items! > 0) {
      list.items! -= 1;
    }
  };
}

const contextAdd = document.getElementById("context-add")!;
if (contextAdd) {
  contextAdd.onclick = () => {
    const list = document.querySelector<ContextCheckboxList>(
      "#context-checkbox-list",
    )!;
    list.items! += 1;
  };
}

const contextRemove = document.getElementById("context-remove");
if (contextRemove) {
  contextRemove!.onclick = () => {
    const list = document.querySelector<ContextCheckboxList>(
      "#context-checkbox-list",
    )!;
    if (list.items! > 0) {
      list.items! -= 1;
    }
  };
}
