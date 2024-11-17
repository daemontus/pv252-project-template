import { FASTElement, html } from "@microsoft/fast-element";

export class PersonItemLoading extends FASTElement {}

const template = html<PersonItemLoading>` <fluent-skeleton
  style="height: 66px; padding: 16px; box-sizing: border-box;"
  shape="rect"
  shimmer="true"
>
  Loading...
</fluent-skeleton>`;

PersonItemLoading.define({
  name: "person-item-loading",
  template,
});
