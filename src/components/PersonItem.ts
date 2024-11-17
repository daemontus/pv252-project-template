import { attr, FASTElement, html, observable } from "@microsoft/fast-element";
import { PeopleListContext } from "./PeopleListContextElement.js";
import { PersonListItem } from "./PersonListItem.js";

export class PersonItem extends FASTElement {
  @observable
  person?: PersonListItem;

  @attr
  position: number = 0;

  @PeopleListContext
  data = PeopleListContext;

  public getGoogleMapsSearchUrl(): string {
    return `https://maps.google.com/maps/place/${this.person?.data?.LON},${this.person?.data?.LAT}`;
  }

  public refresh() {
    this.data?.initialValue?.refresh(this.position);
  }
}

const template = html<PersonItem>`
    <fluent-card style="padding: 16px; margin-bottom: 16px;">
        <fluent-breadcrumb>
            <fluent-breadcrumb-item>${(x) => x.person?.data?.continentName}</fluent-breadcrumb-item>
            <fluent-breadcrumb-item>${(x) => x.person?.data?.countryName}</fluent-breadcrumb-item>
            <fluent-breadcrumb-item>${(x) => x.person?.data?.birthcity}</fluent-breadcrumb-item>
        </fluent-breadcrumb>
        <h2 style="margin-top: 0;">${(x) => x.person?.data?.name}</h2>
        <fluent-divider role="separator"/>
        <p>
        <p>This person was born in ${(x) => x.person?.data?.birthyear}
            and is/was working as ${(x) => x.person?.data?.occupation} in the
            ${(x) => x.person?.data?.industry} industry.</p>
        </p>
        <fluent-divider role="separator" style="margin-bottom: 16px;"/>
        <a href="${(x) => x.getGoogleMapsSearchUrl()}" target="_blank">
            <fluent-button appearance="accent">Show on map</fluent-button>
        </a>
        <fluent-button appearance="outline" @click="${(x) => x.refresh()}">Refresh</fluent-button>
    </fluent-card>
`;

PersonItem.define({
  name: "person-item",
  template,
});
