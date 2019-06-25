import uuid = require('uuid/v1')
import WebSocket = require('ws')

import { Player } from "./player"
import { WSHandler } from "./wshandler"
import { Screen } from "./screen"

class Game {
    players: Map<string, Player>
    ws: WSHandler

    constructor(ws: WSHandler) {
        this.players = new Map()
        this.ws = ws
        this.ws.on('userJoin', (data) => this.handleUserJoin(data))
    }

    private handleUserJoin(data: any): void {
        const id = uuid()
        this.players.set(id, new Player(data.socket, data.username, id))
        this.send(id, 'idRes', { id: id })
        this.send(id, 'screenChange', { screen: Screen.LOBBY })

        const usernames = Array.from(this.players, ([, player]) => player.username)
        this.broadcast('lobbyUpd', { usernames: usernames })

        console.log(`User ${data.username} joined`)
    }

    send(id: string, eventName: string, payload: object) {
        this.ws.send(this.players.get(id).socket, eventName, payload)
    }

    broadcast(eventName: string, payload: object) {
        this.players.forEach((player, id) => {
            this.ws.send(player.socket, eventName, payload)
        })
    }
}

export { Game }