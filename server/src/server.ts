import 'source-map-support/register'

import express from 'express'

import { Game } from './game'
import { WSHandler } from './wsHandler'
import questionSet from '../cities.json'

const app = express()
const ws = new WSHandler(8080, app)
const game = new Game(ws, questionSet)