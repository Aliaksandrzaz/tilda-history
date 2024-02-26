class TildaLayout {
  blockIds = [""];

  constructor() {
    this.onAddNewBlock();
    this.setListenersToRemoveBtns();
  }

  clear() {
    const prtElement = document.getElementById("main");
    while (prtElement.firstChild) {
      prtElement.removeChild(prtElement.firstChild);
    }
  }

  /**
   * @param {SavedZeroBlock} data
   */
  build(data) {
    artboard__Build(JSON.parse(data.data));
  }

  setListenersToRemoveBtns() {
    setTimeout(() => {
      this.getAllRemoveBtns().forEach((deleteBtn) => {
        this.addListenerToRemoveBtn(deleteBtn);
      });
    }, 600)

  }

  onAddNewBlock() {
    const allRecords = document.getElementById("allrecords");

    if (!allRecords) return;

    const observer = new MutationObserver((mutationRecords) => {
      mutationRecords.forEach((record) => {
        record.addedNodes.forEach((node) => {
          const recordId = node.getAttribute(recordIdKey);
          const isBlockExist = !!this.blockIds.find((id) => id === recordId);

          if (node.dataset.recordType === "396" && !isBlockExist) {
            const deleteBtn = node.querySelector(
              ".tp-record-edit-icons-right__item-icon[title='Удалить']",
            );
            this.addListenerToRemoveBtn(deleteBtn);
            this.blockIds.push(recordId);
          }
        });
      });
    });

    // наблюдать за всем, кроме атрибутов
    observer.observe(allRecords, {
      childList: true, // наблюдать за непосредственными детьми
      subtree: false, // и более глубокими потомками
      characterDataOldValue: false, // передавать старое значение в колбэк
      addedNodes: true,
    });
  }

  addListenerToRemoveBtn(deleteBtn) {
    deleteBtn.addEventListener("click", this.removeBtnListener, {
      once: true,
    });
  }

  removeBtnListener = (e) => {
    const parent = e.currentTarget.closest(".record[data-record-type='396']");

    if (parent) {
      const recordId = parent.getAttribute(recordIdKey);
      this.removeObserver(recordId);

      eventStream.publish(eventActions.deleteZeroBlockPage, recordId);
    }
  };

  /**
   * @param {string} recordId
   */
  removeObserver(recordId) {
    this.blockIds = this.blockIds.filter((id) => id !== recordId);
  }

  removeListenersFromRemoveBtn() {
    this.getAllRemoveBtns().forEach((deleteBtn) => {
      deleteBtn.removeEventListener("click", this.removeBtnListener);
    });
  }

  getAllRemoveBtns() {
    return document.body.querySelectorAll(
      ".tp-record-edit-icons-right__item-icon[title='Удалить']",
    );
  }
}
