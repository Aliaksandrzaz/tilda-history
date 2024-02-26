const slice = [].slice;

function EventStream() {
  if (!(this instanceof EventStream)) {
    return new EventStream();
  }

  this.nextSubscriptionIndex = 0;
  this.callbacks = {};
}

EventStream.prototype.unregisterCallback = function unregisterCallback(callback) {
    const that = this;
    Object.keys(this.callbacks).forEach(function (key) {
      that.callbacks[key] = that.callbacks[key].filter(function (c) {
        return c.subscription !== callback;
      });
    });
}

EventStream.prototype.unregisterAllCallbacks = function unregisterAllCallbacks() {
    this.callbacks = {};
};

EventStream.prototype.unregisterCallbacksForEvent = function unregisterCallbacksForEvent(event) {
    if(this.callbacks[event]) {
        this.callbacks[event] = []
    }
}

EventStream.prototype.on = function on(event, callback) {
    if (!this.callbacks[event]) {
        this.callbacks[event] = [];
    }

    this.callbacks[event].push({
        subscription: callback,
        index: this.nextSubscriptionIndex
    });

    const currentIndex = this.nextSubscriptionIndex;
    const that = this;
    this.nextSubscriptionIndex += 1;

    return function() {
        that.callbacks[event] = that.callbacks[event].filter(function(callback) {
            return callback.index !== currentIndex;
        });
    };
};

EventStream.prototype.publish = function publish() {
    const event = arguments[0];
    const args = arguments.length >= 2 ? slice.call(arguments, 1) : [];
    if (this.callbacks && this.callbacks[event]) {
      this.callbacks[event].forEach(function (callback) {
        callback.subscription.apply(null, args);
      });
    }
};
