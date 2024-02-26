class UrlWatcher {
  add() {
    window.navigation.addEventListener("navigate", async (event) => {
      const { url } = event.destination;
      if (this.isZeroBlockUrl(url)) {
        this.zeroBlockOpen();
      }

      if (this.isZeroBlockUrl(location.href) && !this.isZeroBlockUrl(url)) {
        this.zeroBlockClose();
      }
    });
  }

  zeroBlockOpen() {
    eventStream.publish(eventActions.openZeroBlockPage, "");
  }

  zeroBlockClose() {
    eventStream.publish(eventActions.closeZeroBlockPage, "");
  }

  /**
   * @param {string} url
   * @return boolean
   */
  isZeroBlockUrl(url) {
    return url.includes("zero") && url.includes("recordid=");
  }
}
