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
  @attr({ converter: nullableNumberConverter })
  position: number = 0;

  @observable
  person: PersonListItem | null = null;

  @PeopleListContext
  data!: PeopleListContext;

  public getGoogleMapsSearchUrl(): string {
    return `https://maps.google.com/maps/place/${this.person?.data?.LON},${this.person?.data?.LAT}`;
  }

  public refresh() {
    this.data?.refresh(this.position);
  }
}

const okState = html<PersonElement>`
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

const loadingState = html<PersonElement>`
  <fluent-skeleton
    style="height: 66px; padding: 16px; box-sizing: border-box; margin-bottom: 16px;"
    shape="rect"
    shimmer="true"
  >Loading...</fluent-skeleton>
`;

const errorState = html<PersonElement>` <fluent-card
  style="padding: 16px; margin-bottom: 16px; height: 66px;"
>
  <span style="display: inline-block; margin: 4px 16px 4px 16px;">
    Item failed to load.
  </span>
  <fluent-button
    appearance="accent"
    style="float: left;"
    @click="${(x) => x.refresh()}"
  >
    Refresh
  </fluent-button>
</fluent-card>`;

const template = html<PersonElement>`
  <div class="box">
    ${when((x) => x.person?.isOk(), okState)}
    ${when((x) => x.person?.isLoading(), loadingState)}
    ${when((x) => x.person?.isError() ?? true, errorState)}
  </div>
`;

PersonElement.define({
  name: "person-element",
  template: template,
});
