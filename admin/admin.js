const host = window.location.origin.replace(/^http/, 'ws')
console.log(host)

ws = new WebSocket(host)

ws.onopen = function () {
  console.log("Opened WebSocket")
}

ws.onclose = function (e) {
  console.log("closed")
}

ws.onerror = function (e) {
  console.log("error")
}

function send(eventName, payload) {
  const merged = {
    eventName: eventName,
    ...payload
  }
  ws.send(JSON.stringify(merged))
}

function sendStartGame() {
  send('startReq', {})
}