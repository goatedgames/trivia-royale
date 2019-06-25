import WebSocket from 'ws'

class Player {
    socket: WebSocket
    username: string
    id: string
    lives: number
    reason: string
    answered: boolean
    eliminated: boolean

    constructor(socket: WebSocket, username: string, id: string) {
        this.socket  = socket
        this.username = username
        this.id = id
        this.lives = 3
        this.reason = ''
        this.eliminated = false
    }
}

export { Player }