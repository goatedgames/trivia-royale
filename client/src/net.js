export default class WS {
  static init(url) {
    this.handlers = {};
    this.key = '';
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      console.log('WebSocket opened.');
    }
    this.ws.onclose = () => {
      console.log('WebSocket closed.');
    }
    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.eventName in this.handlers) {
        const subs = this.handlers[data.eventName];
        for (let i = 0; i < subs.length; i++) {
          subs[i](data);
        }
      }
    }

    this.onEvent('uuid-res', (data) => {
      this.key = data.id;
    });
  }

  static onEvent(eventName, handler) {
    if (!(eventName in this.handlers)) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
    return this;
  }

  static send(eventName, payload) {
    this.ws.send(JSON.stringify({
      eventName: eventName, 
      user: { id: this.key },
      ...payload
    }));
  }
}