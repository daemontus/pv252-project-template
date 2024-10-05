import pantheon from "./pantheon.tsv";

export type Person = {
  name: string;
  birthyear: string;
  birthcity: string | null;
  countryName: string | null;
  continentName: string | null;
  LAT: string | null;
  LON: string | null;
  occupation: string | null;
  industry: string | null;
  gender: "Male" | "Female" | null;
};

export function loadFamousPeople(): Person[] {
  // Make a shallow copy.
  const data = Array.from(pantheon) as Person[];
  // Sort data by year of birth.
  data.sort(
    (a: Person, b: Person) => parseInt(b.birthyear) - parseInt(a.birthyear),
  );
  return data;
}

export function renderPerson(person: Person): HTMLElement {
  const template = document.getElementById(
    "person-template",
  )! as HTMLTemplateElement;
  const element = template.content.cloneNode(true) as HTMLElement;

  const name = element.querySelector(".person-name");
  const continent = element.querySelector(".person-continent");
  const country = element.querySelector(".person-country");
  const city = element.querySelector(".person-city");
  const occupation = element.querySelector(".person-occupation");
  const industry = element.querySelector(".person-industry");
  const geo_link =
    element.querySelector<HTMLAnchorElement>(".person-geo-link")!;
  const birth_year = element.querySelector(".person-year");

  name.textContent = person.name;
  birth_year.textContent = String(person.birthyear);
  occupation.textContent = person.occupation;
  industry.textContent = person.industry;
  if (person.continentName !== null && person.continentName !== "Unknown") {
    continent.textContent = person.continentName;
  } else {
    continent.remove();
  }
  if (person.countryName !== null && person.countryName !== "Unknown") {
    country.textContent = person.countryName;
  } else {
    country.remove();
  }
  if (person.birthcity !== null && person.birthcity !== "Unknown") {
    city.textContent = person.birthcity;
  } else {
    city.remove();
  }
  if (person.LAT === null || person.LON === null) {
    geo_link.remove();
  } else {
    geo_link.href = `https://maps.google.com/?q=${person.LAT},${person.LON}`;
  }
  return element;
}
