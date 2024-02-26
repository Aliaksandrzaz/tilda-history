class App {
  /**
   * @param {DB} db
   * @param {HistorySelector} historySelector
   * @param {TildaLayout} tildaLayout
   * @param {UrlWatcher} urlWatcher
   */

  selector;

  constructor(db, historySelector, tildaLayout, urlWatcher) {
    this.db = db;
    this.historySelector = historySelector;
    this.tildaLayout = tildaLayout;
    this.urlWatcher = urlWatcher;
    this.onOpenZeroBlockPage();
    this.onCloseZeroBlockPage();
    this.onDeleteZeroBlockPage();
    this.onAddZeroBlockPage();
    this.onAddRecord();
  }

  async start() {
    await this.initDb();
    this.urlWatcher.add();
    await this.addAfterPageLoad();
  }

  async initDb() {
    await this.db.init();
  }

  async addAfterPageLoad() {
    const recordId = getRecordId();
    if (recordId) {
      const timestamps = await this.db.getTimestamps(recordId);
      this.selector = await this.historySelector.add(timestamps);
      this.selector?.addEventListener("change", this.selectorOnChange);
    }
  }

  selectorOnChange = async () => {
    this.tildaLayout.clear();
    const data = await this.db.get(+this.selector.value);
    await this.tildaLayout.build(data);
  };

  onCloseZeroBlockPage() {
    eventStream.on(eventActions.closeZeroBlockPage, () => {
      this.selector?.removeEventListener("change", this.selectorOnChange);
      this.tildaLayout.setListenersToRemoveBtns();
    });
  }

  onOpenZeroBlockPage() {
    eventStream.on(eventActions.openZeroBlockPage, () => {
      this.addAfterPageLoad();
      this.tildaLayout.removeListenersFromRemoveBtn();
    });
  }

  onDeleteZeroBlockPage() {
    eventStream.on(eventActions.deleteZeroBlockPage, (blockId) => {
      this.db.removeAllBlockRecord(blockId);
    });
  }

  onAddZeroBlockPage() {
    eventStream.on(eventActions.addZeroBlockPage, () => {});
  }

  onAddRecord() {
    eventStream.on(eventActions.addRecord, (record) => {
      this.db.add(record);
      this.historySelector.addNewOption(record.timestamp, this.selector);
    });
  }
}

try {
  const db = new DB();
  const historySelector = new HistorySelector();
  const tildaLayout = new TildaLayout();
  const urlWatcher = new UrlWatcher();

  const app = new App(db, historySelector, tildaLayout, urlWatcher);
  app.start();
} catch (e) {
  console.error(e)
}

