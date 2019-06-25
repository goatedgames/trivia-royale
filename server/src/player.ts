import WebSocket = require('ws')

class Player {
    socket: WebSocket
    username: string
    id: string
    lives: number

    constructor(socket: WebSocket, username: string, id: string) {
        this.socket  = socket
        this.username = username
        this.id = id
        this.lives = 3
    }
}

export { Player }