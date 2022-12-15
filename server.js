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
game.start()

game.subscribe((command) =>{
    console.log(`> Emiting ${command.type}`)
    sockets.emit(command.type, command)
})

sockets.on('connection', (socket)=>{
    const playerId = socket.id
    console.log(`a Player conected: ${playerId}`)

    game.addPlayer({playerId: playerId})
    
    socket.emit('setup', game.state)

    socket.on('disconnect', ()=>{
        game.removePlayer({playerId: playerId})
        console.log(`a Player disconnect: ${playerId}`)
    })

    socket.on('move-player', (command)=>{
        command.playerId = playerId
        command.type = 'move-player'
        
        game.movePlayer(command)
    })
})

server.listen(3000, ()=>{
    console.log(`a server listening on port: 3000`)
})