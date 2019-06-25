import uuid from 'uuid/v1'

import { Player } from "./player"
import { Question, QuestionSet } from "./questionSet"
import { WSHandler } from "./wsHandler"
import { Screen } from "./screen"
import WebSocket from 'ws'

class Game {
    players: Map<string, Player>
    ws: WSHandler
    questionSet: QuestionSet
    questionIdx: number

    constructor(ws: WSHandler, questionSet: any) {
        this.players = new Map()
        this.questionSet = questionSet
        this.questionIdx = 0

        this.ws = ws
        this.ws.on('userJoin', this.handleUserJoin)
        this.ws.on('lobbyReq', this.handleLobbyRequest)
        this.ws.on('QReq', this.handleQuestionRequest)
        this.ws.on('ans', this.handleAnswer)
        this.ws.on('startReq', this.start)
    }

    private get currentQ(): Question {
        return this.questionSet.questions[this.questionIdx]
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

    private handleLobbyRequest = (data: any, socket: WebSocket) => {
        const usernames = Array.from(this.players, ([, player]) => player.username)
        this.ws.send(socket, 'lobbyUpd', { usernames: usernames })
    }

    private handleQuestionRequest = (data: any, socket: WebSocket) => {
        this.ws.send(socket, 'newQ', {
            q: this.currentQ.question,
            choices: this.currentQ.choices,
            url: this.currentQ.imgURL
        })
    }

    private handleAnswer = (data: any, socket: WebSocket) => {
        if (this.currentQ.correct.includes(data.i + 1)) {
            this.ws.send(socket, 'screenChange', { screen: Screen.VICTORY })
        } else {
            this.ws.send(socket, 'screenChange', { screen: Screen.LOST })
        }
    }

    private start = () => {
        this.startRound()
    }

    private end = () => {
        this.broadcast('screenChange', { screen: Screen.SPLASH })
    }

    private startRound = () => {
        this.broadcast('screenChange', { screen: Screen.BATTLE })
        setTimeout(this.endRound, 5000)
    }

    private endRound = () => {
        this.broadcast('screenChange', { screen: Screen.WAIT })
        this.questionIdx++
        if (this.questionIdx >= this.questionSet.questions.length) {
            this.end()
        } else {
            setTimeout(this.startRound, 5000)
        }
    }

    private broadcast(eventName: string, payload: object): void {
        this.players.forEach((player, id) => {
            this.ws.send(player.socket, eventName, payload)
        })
    }
}

export { Game }