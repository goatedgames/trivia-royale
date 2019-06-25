import 'source-map-support/register'

import express from 'express'

import { Game } from './game'
import { WSHandler } from './wsHandler'
import questionSet from '../cities.json'

const app = express()
const ws = new WSHandler(3000, app)
const game = new Game(ws, questionSet)

app.use(express.static(__dirname + './../../../client/build/'))
// app.listen(3000)

// const hostApp = express()
// hostApp.use(express.static(__dirname + './../admin'))
// hostApp.listen(7000)