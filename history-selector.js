class HistorySelector {
  /**
   * @param {string[]} timestamps
   */
  async add(timestamps) {
    const contentPlace = await isElementLoaded(
      ".tn-mainmenu__content .tn-rightbtns-wrapper",
    );
    const selector = this.create(timestamps);
    contentPlace.before(selector);

    return selector;
  }

  /**
   * @param {string[]} timestamps
   */
  create(timestamps) {
    const select = document.createElement("select");
    timestamps.forEach((timestamp) => {
      const option = this.createOption(timestamp);
      select.append(option);
    });

    if (!timestamps.length) {
      select.append(this.createEmptyOption())
    }

    return select;
  }

  /**
   * @param {string} timestamp
   */
  createOption(timestamp) {
    const option = document.createElement("option");
    const date = new Date(timestamp);
    option.value = timestamp;
    option.label = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    return option;
  }

  /**
   * @param {string} timestamp
   * @param {HTMLSelectElement} selector
   */
  addNewOption(timestamp, selector) {
    const option = this.createOption(timestamp);
    selector.prepend(option);
    selector.value = timestamp;
  }

  createEmptyOption() {
    const option = document.createElement("option");
    option.selected = true;
    option.disabled = true;
    option.hidden = true;
    option.style.display = "none";
    option.value = "";
    option.textContent = "Пусто"

    return option;
  }
}
