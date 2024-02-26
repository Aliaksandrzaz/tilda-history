class DB {
  dbPromise;
  dbName = "zeroBlock";

  async init() {
    this.dbPromise = await idb.openDB("ZeroBlock", 1, {
      upgrade: (db) => {
        db.createObjectStore(this.dbName, {
          keyPath: "id",
          autoIncrement: true,
        });
      },
    });
  }

  /**
   * @param {SavedZeroBlock} param
   */
  add({ blockId, data, timestamp }) {
    this.dbPromise.add(this.dbName, { blockId, data, timestamp });
  }

  /**
   * @param {string} blockId
   * @return {Promise<Array<string>>}
   */
  async getTimestamps(blockId) {
    const data = await this.dbPromise.getAll(this.dbName);

    return data
      .filter((item) => item.blockId === blockId)
      .map((item) => item.timestamp)
      .sort((prev, curr) => curr - prev);
  }

  /**
   * @param {number} timestamp
   * @return {Promise<SavedZeroBlock>}
   */
  async get(timestamp) {
    const data = await this.dbPromise.getAll(this.dbName);

    return data.find((item) => item.timestamp === timestamp);
  }

  /**
   * @param {string} blockId
   */
  async removeAllBlockRecord(blockId) {
    const data = await this.dbPromise.getAll(this.dbName);
    const tx = this.dbPromise.transaction(this.dbName, "readwrite");

    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].blockId === blockId) {
        result.push(tx.store.delete(data[i].id));
      }
    }

    Promise.all(result);
  }
}
