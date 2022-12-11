import express from 'express'
import http from 'http'
import createGame from './public/game.js'
//import socketio from 'socket.io'
import {Server} from "socket.io"

const app = express()
const server = http.createServer(app)
const sockets = new Server(server)


app.use(express.static('public'))

const game = createGame()


console.log(game.state)

sockets.on('connection', (socket)=>{
    const playerId = socket.id
    console.log(`a Player conected on Server with id: ${playerId}`)
    
    socket.emit('setup', game.state)
})

server.listen(3000, ()=>{
    console.log(`a server listening on port: 3000`)
})