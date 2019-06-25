import uuid from 'uuid/v1'

import { Player } from "./player"
import { WSHandler } from "./wshandler"
import { Screen } from "./screen"
import WebSocket from 'ws'

class Game {
    players: Map<string, Player>
    ws: WSHandler

    constructor(ws: WSHandler) {
        this.players = new Map()
        this.ws = ws
        this.ws.on('userJoin', this.handleUserJoin)
        this.ws.on('lobbyReq', this.lobbyResponse)
        // this.ws.on('QReq', (data) => this.questionResponse(data))
    }

    private handleUserJoin = (data: any, socket: WebSocket) => {
        const id = uuid()
        this.players.set(id, new Player(socket, data.username, id))
        this.ws.send(socket, 'idRes', { id: id })
        this.ws.send(socket, 'screenChange', { screen: Screen.LOBBY })

        const usernames = Array.from(this.players, ([, player]) => player.username)
        this.broadcast('lobbyUpd', { usernames: usernames })

        console.log(`User ${data.username} joined`)
    }

    private lobbyResponse = (data: any, socket: WebSocket) => {
        const usernames = Array.from(this.players, ([, player]) => player.username)
        this.ws.send(socket, 'lobbyUpd', { usernames: usernames })
    }

    private questionResponse(data: any): void {

    }

    private broadcast(eventName: string, payload: object): void {
        this.players.forEach((player, id) => {
            this.ws.send(player.socket, eventName, payload)
        })
    }
}

export { Game }