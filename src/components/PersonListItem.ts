import { Person } from "../famous_people.js";

export class PersonListItem {
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
