import uuid from 'uuid/v1'

import { Player } from "./player"
import { Question, QuestionSet } from "./questionSet"
import { WSHandler } from "./wsHandler"
import { Screen } from './screen'
import * as utils from './utils'
import WebSocket from 'ws'

class Game {
    players: Map<string, Player>
    matches: Map<string, [string, string | null]>
    ws: WSHandler
    questionSet: QuestionSet
    questionIdx: number

    constructor(ws: WSHandler, questionSet: any) {
        this.players = new Map()
        this.matches = new Map()
        this.questionSet = questionSet
        this.questionIdx = 0

        this.ws = ws
        this.ws.on('userJoin', this.handleUserJoin)
        this.ws.on('lobbyReq', this.handleLobbyRequest)
        this.ws.on('QReq', this.handleQuestionRequest)
        this.ws.on('ans', this.handleAnswer)
        this.ws.on('livesReq', this.handleLivesRequest)
        this.ws.on('reasonReq', this.handleReasonRequest)
        this.ws.on('matchReq', this.handleMatchRequest)
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
        const player = this.players.get(data.user.id)
        player.answered = true
        if (this.currentQ.correct.includes(data.i + 1)) {
            const match = this.matches.get(data.user.id)
            // if match[1], there is an opponent
            if (match[1]) {
                const oppo = this.players.get(match[1])
                const elimMsg = `You were eliminated by ${player.username}.`
                const lostMsg = `${player.username} answered correctly before you.`
                this.playerWrong(oppo, elimMsg, lostMsg)
                player.reason = `You won your battle against ${oppo.username}.`
            } else {
                player.reason = 'You won your battle, but not the war.'
            }
            this.ws.send(socket, 'screenChange', { screen: Screen.WAIT })
        } else {
            this.playerWrong(player, 'You ran out of lives.', 'You lost a life.')
        }
    }

    private handleLivesRequest = (data: any, socket: WebSocket) => {
        const player = this.players.get(data.user.id)
        this.ws.send(socket, 'livesRes', { lives: player.lives })
    }

    private handleReasonRequest = (data: any, socket: WebSocket) => {
        const player = this.players.get(data.user.id)
        this.ws.send(socket, 'reasonRes', { msg: player.reason })
    }

    private handleMatchRequest = (data: any, socket: WebSocket) => {
        const id = data.user.id
        const match = this.matches.get(id)
        const me = this.players.get(match[0])
        const oppo = match[1] ? this.players.get(match[1]) : null

        this.ws.send(socket, 'matchRes', { 
            myName: me.username, 
            myLives: me.lives,
            oppoName: oppo ? oppo.username : 'You are alone.',
            oppoLives: oppo ? oppo.lives : 9999
        })
    }

    private playerWrong(player: Player, elimMsg: string, wrongMsg: string) {
        player.lives--
        player.answered = true
        if (player.lives <= 0) {
            this.ws.send(player.socket, 'screenChange', { screen: Screen.LOST })
            player.reason = elimMsg
            player.eliminated = true
        } else {
            this.ws.send(player.socket, 'screenChange', { screen: Screen.WAIT })
            player.reason = wrongMsg
        }
    }

    private start = () => {
        this.startRound()
    }

    private end = () => {
        // this.broadcast('screenChange', { screen: Screen.SPLASH })
        this.players.forEach((player) => {
            player.socket.close()
        })
    }

    private startRound = () => {
        this.players.forEach((player: Player) => {
            player.answered = false
        })

        // Setup matches
        this.matches.clear()
        const ids = Array.from(this.players, ([k, v]) => k)
        utils.shuffle(ids)
        for (let i = 0; i < ids.length; i += 2) {
            const arr = ids.slice(i, i + 2)
            const p1 = arr[0]
            const p2 = (arr.length > 1) ? arr[1] : null
            // First in pair is me
            this.matches.set(p1, [p1, p2])
            if (p2) this.matches.set(p2, [p2, p1])
        }

        this.broadcast('screenChange', { screen: Screen.BATTLE })
        setTimeout(this.endRound, 5000)
    }

    private endRound = () => {
        this.broadcast('screenChange', { screen: Screen.WAIT })
        this.players.forEach((player: Player) => {
            if (!player.answered) {
                this.playerWrong(player, 'You ran out of lives.', 'You ran out of time and lost a life.')
            }
        })

        this.questionIdx++
        if (this.playersLeft() === 1 || this.questionIdx >= this.questionSet.questions.length) {
            this.broadcast('screenChange', { screen: Screen.VICTORY })
            this.end()
        } else {
            setTimeout(this.startRound, 5000)
        }
    }

    private playersLeft(): number {
        let left = 0
        this.players.forEach((player) => {
            if (!player.eliminated) left++
        })
        return left
    }

    private broadcast(eventName: string, payload: object): void {
        this.players.forEach((player, id) => {
            if (!player.eliminated)
                this.ws.send(player.socket, eventName, payload)
        })
    }
}

export { Game }