import 'source-map-support/register'

import WebSocket = require('ws')
import express = require('express')
import uuid = require('uuid/v1')

const questions = require('./cities.json').questionSet

const GameState = {
  LOBBY: 1,
  BATTLE: 2,
  WAIT: 3
}

function send(socket: any, eventName: string, payload: any) {
  const merged = { eventName: eventName, ...payload}
  socket.send(JSON.stringify(merged))
}

function shuffle(array: Array<any>) {
  let counter = array.length;

  while (counter > 0) {
      let index = Math.floor(Math.random() * counter);

      counter--;

      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
  }

  return array;
}

class Game {
  players: Map<string, any>
  state: any
  roundNumber: number
  roundStart: number
  waitStart: number
  questions: Array<any>
  duration: number
  answers: any
  matches: any

  constructor(questions: any, duration: number) {
    this.players = new Map()
    this.state = GameState.LOBBY
    this.roundNumber = 0
    this.roundStart = 0
    this.waitStart = 0
    this.questions = questions
    shuffle(this.questions)
    this.duration = duration
  }

  get currentQ() {
    return this.questions[this.roundNumber]
  }

  addPlayer(player: Player) {
    this.players.set(player.id, player)
  }

  broadcast(eventName: string, data: any) {
    for (const p of this.players.values()) {
      send(p.socket, eventName, data)
    }
  }

  handleAnswerRes(id: string, idx: number) {
    this.answers.set(id, idx)
    const p = this.players.get(id)
    if (p === null) return

    const m = p.match
    if (!m.q.correct.includes(idx + 1)) {
      p.lives--
      if (p.lives <= 0) {
        send(p.socket, 'elim', { reason: 'Out of lives.' })
        this.players.delete(id)
      } else {
        send(p.socket, 'round-end', { msg: 'You got the question wrong.' })
      }
    } else {
      if (!m.solo) {
        const other = (id === m.p1.id) ? m.p2 : m.p1
        other.lives--
        this.answers.set(other.id, -2)
        if (other.lives <= 0) {
          const msg = { reason: 'Out of lives. You were eliminated by: ' + p.username }
          send(other.socket, 'elim', msg)
          this.players.delete(other.id)
        } else {
          send(other.socket, 'round-end', { msg: 'You lost the battle against: ' + p.username})
        }
        send(p.socket, 'round-end', { msg: 'You won your battle against: ' + other.username})
      } else {
        send(p.socket, 'round-end', { msg: 'You won your battle, but not the war'})
      }
    }
  }

  startRound() {
    this.answers = new Map()
    for (const k of this.players.keys()) {
      this.answers.set(k, -1)
    }

    this.matches = []
    const players = Array.from(this.players, ([k, v]) => v)
    shuffle(players)
    for (let i = 0; i < players.length; i += 2) {
      const arr = players.slice(i, i + 2)
      this.matches.push(new Match(this.currentQ, arr[0], (arr.length > 1) ? arr[1] : null))
    }

    for (const m of this.matches) {
      m.startRound(this)
    }

    this.state = GameState.BATTLE
    this.roundStart = Date.now()
  }

  roundShouldEnd() {
    let allAnswered = true
    for (const p of this.players.values()) {
      if (this.answers.get(p.id) === -1) {
        allAnswered = false
        break
      }
    }
    if (allAnswered) return true

    return Date.now() - this.roundStart > this.duration
  }

  advanceRound() {
    for (const p of this.players.values()) {
      const ans = this.answers.get(p.id)
      const correct = this.currentQ.correct.includes(ans + 1)
      // if (correct) {
      //   send(p.socket, 'round-end', {})
      // } else if (ans === -1) {
      if (ans === -1) {

        // Didn't answer
        p.lives--
        if (p.lives <= 0) {
          send(p.socket, 'elim', { reason: 'You ran out of time!' })
          this.players.delete(p.id)
        }
      }
    }

    if (this.players.size === 1 || this.players.size === 0) {
      this.roundNumber = this.questions.length
    }
    this.roundNumber++
  }

  isFinished() {
    return this.roundNumber >= this.questions.length
  }

  start() {
    this.broadcast('game-start', {})
  }

  end() {
    this.broadcast('game-winner', {})
    this.broadcast('game-end', {})
    for (const p of this.players.values()) {
      p.socket.close()
    }
  }

  tick() {
    const left = this.duration - (Date.now() - this.roundStart)
    this.broadcast('round-tick', { timeLeft: left })
  }

  print() {
    console.log(`${this.players.size} Connected clients:`)
    for (const player of this.players.values()) {
      console.log(player.toString())
    }
  }
}

class Match {
  q: any;
  p1: Player;
  p2: Player;
  solo: boolean;

  constructor(q: any, p1: Player, p2: Player | null) {
    this.q = q
    this.p1 = p1
    this.p2 = p2
    this.solo = (p2 === null)

    this.p1.match = this
    if (!this.solo) this.p2.match = this
  }

  startRound() {
    const q = {
      question: this.q.question,
      choices: this.q.choices,
      url: this.q.imgURL
    }
    if (this.solo) {
      send(this.p1.socket, 'round-start', {
        q: q,
        lives: this.p1.lives,
        opponent: 'answer this correctly or else (you are alone)'
      })
    } else {
      send(this.p1.socket, 'round-start', {
        q: q,
        lives: this.p1.lives,
        opponent: {
          username: this.p2.username,
          lives: this.p2.lives
        }
      })
      send(this.p2.socket, 'round-start', {
        q: q,
        lives: this.p2.lives,
        opponent: {
          username: this.p1.username,
          lives: this.p1.lives
        }
      })
    }
  }
}

class Player {
  match: Match | null
  socket: any
  lives: number
  username: string
  id: string;

  constructor(socket: any, username: string, id: string) {
    this.socket = socket
    this.username = username
    this.id = id
    this.match = null
    this.lives = 3
  }

  toString() {
    return `username: ${this.username}`
  }
}

const app = express()
// app.use(express.static('../cairo'))

// const adminApp = express()
// adminApp.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'admin.html'))
// })
// adminApp.use(express.static(path.join(__dirname, 'admin')))
// adminApp.listen(5000)

const wss = new WebSocket.Server({ server: app.listen(8080) })
// const questions = [
//   {
//     question: `What is Mr. Cook's first name?`,
//     choices: [
//       'Quentin', 'Darrin', 'Cameron', 'Travis Scott'
//     ],
//     answer: 1,
//     duration: 10000
//   },
//   {
//     question: "What org did Kampy play for?",
//     choices: [
//       'FaZe', 'Optic', 'BLMS', 'Liquid'
//     ],
//     answer: 0,
//     duration: 10000
//   }
// ]
const game = new Game(questions, 20000)

wss.on('connection', socket => {
  socket.on('message', message => {
    // console.log(`Message from a client: ${message}`)
    const data = JSON.parse(message.toString())
    switch (data.eventName) {
      case 'user-join':
        const id = uuid()
        game.addPlayer(new Player(socket, data.username, id))
        send(socket, 'uuid-res', { id: id })
        console.log(`User ${data.username} joined`)
        break
      case 'lobby-req':
        const li = Array.from(game.players, ([key, value]) => value.username)
        send(socket, 'lobby-res', { users: li })
        break
      case 'game-start-req':
        game.start()
        game.startRound()
        break
      case 'round-res':
        game.handleAnswerRes(data.user.id, data.idx)
        break
      case 'admin-start-game':
        game.start()
        game.startRound()
        break
      default:
        console.log(`Bad eventName: ${data.eventName}`)
    }
  })
})

function tick() {
  if (game.isFinished()) {
    clearInterval(intervalId)
    return
  }

  if (game.state === GameState.BATTLE) {
    if (game.roundShouldEnd()) {
      const ans = game.currentQ.choices[game.currentQ.correct[0] - 1]
      game.advanceRound()
      if (game.isFinished()) {
        clearInterval(intervalId)
        game.end()
      } else {
        game.state = GameState.WAIT
        game.waitStart = Date.now()
        game.broadcast('round-wait', { correctChoice: ans })
      }
    } else {
      game.tick()
    }
  }

  if (game.state === GameState.WAIT) {
    const delay = 5000
    if (Date.now() - game.waitStart > delay) {
      game.state = GameState.BATTLE
      game.startRound()
    }
  }
}

// const ticksPerSec = 2
const ticksPerSec = 10
const intervalId = setInterval(tick, 1000 / ticksPerSec)