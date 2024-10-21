import { css, FASTElement, html, observable, Observable, Subscriber } from "@microsoft/fast-element";
import { Context } from "@microsoft/fast-element/context.js";

/*

    WARNING: To use these elements, you have to make sure they are loaded properly, e.g. by instantiating
    the classes in your main script. Here, we instead add the file as an import of the main module 
    directly in `webpack.config.js`.

 */

export const CounterContext = Context.create<CounterContext>("Counter");
export interface CounterContext {
  count: number;
  increment(): void;
  decrement(): void;
}

export class CounterContextElement extends FASTElement implements CounterContext {  
  @observable
  count: number = 0;

  increment(): void {
    this.count += 1;
  }
  decrement(): void {
    this.count -= 1;
  }

  connectedCallback(): void {
    super.connectedCallback();
    CounterContext.provide(this, this);
    
    // Example of how to explicitly subscribe to a FAST observable.
    // For example if we want to update some content "imperatively"
    // instead of regenerating the component using a template.
    // (Note that we can use this method anywhere where we have 
    // access to  a CounterContextElement, not just here.)
    Observable.getNotifier(this).subscribe(<Subscriber>{
      handleChange(subject: any, _args: any): void {
        // Here, "_args" would be the property that changed. But since we
        // are only listening to changes in "count", we don't need to actually
        // check it.
        console.log(subject.count);
      }
    }, "count");

  }
}

CounterContextElement.define({
  name: "counter-context",
  template: html`<div style='display:block; text-align: center;'><slot></slot></div>`,
  styles: css``,
})

export class CounterDisplay extends FASTElement {
  @CounterContext context!: CounterContext;
}

CounterDisplay.define({
  name: "counter-display",
  template: html<CounterDisplay>`
    <fluent-badge appearance="accent">${(x) => x.context.count}</fluent-badge>
  `,
})

export class CounterUp extends FASTElement {
  @CounterContext context!: CounterContext;
}

CounterUp.define({
  name: "counter-up",
  template: html<CounterDisplay>`
    <fluent-button @click=${(x,c) => x.context.increment()}><slot></slot></fluend-button>
  `,
})

export class CounterDown extends FASTElement {
  @CounterContext context!: CounterContext;
}

CounterUp.define({
  name: "counter-down",
  template: html<CounterDisplay>`
    <fluent-button @click=${(x,c) => x.context.decrement()}><slot></slot></fluend-button>
  `,
})