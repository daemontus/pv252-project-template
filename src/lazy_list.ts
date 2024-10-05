const template = document.createElement("template");
template.innerHTML = `
<style>
div.list {
  height: var(--height);
  width: var(--width);  
  border: var(--border);
  padding: var(--padding);
  overflow: scroll;
}
</style>
<div class="list">My list content</div>
`;

export class LazyList extends HTMLElement {
  static register() {
    customElements.define("lazy-list", LazyList);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }
}
