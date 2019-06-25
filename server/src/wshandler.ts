import WebSocket = require('ws')
import express = require('express')

type HandlerFunction = (data: any) => void

class WSHandler {
    server: WebSocket.Server
    handlers: Map<string, HandlerFunction>

    constructor(port: number, app: express.Express) {
        this.handlers = new Map()
        this.server = new WebSocket.Server({ server: app.listen(port) })
        this.server.on('connection', socket => {
            socket.on('message', msg => {
                const data = JSON.parse(msg.toString())
                if (this.handlers.has(data.eventName)) {
                    const f = this.handlers.get(data.eventName)
                    data.socket = socket
                    f(data)
                }
            })
        })
    }

    public on(eventName: string, handler: HandlerFunction) {
        this.handlers.set(eventName, handler)
    }

    public send(socket: WebSocket, eventName: string, payload: object) {
        socket.send(JSON.stringify({
            eventName: eventName, ...payload
        }))
    }
}

export {WSHandler, HandlerFunction}