export default class WS {
  static init(url) {
    this.handlers = new Map();
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
      if (this.handlers.has(data.eventName)) {
        this.handlers.get(data.eventName)(data)
      }
    }

    this.onEvent('idRes', (data) => {
      this.key = data.id;
    });
  }

  static onEvent(eventName, handler) {
    this.handlers.set(eventName, handler)
    return this;
  }

  static remove(eventName) {
    this.handlers.delete(eventName)
  }

  static send(eventName, payload) {
    this.ws.send(JSON.stringify({
      eventName: eventName, 
      user: { id: this.key },
      ...payload
    }));
  }
}