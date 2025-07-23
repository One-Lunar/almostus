const app = require('express')() 
const http = require('http') 
const { Server } = require('socket.io') 
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
})

const rooms = new Map()

io.on('connection', (socket) => {
    console.log("User connected", socket.id)

   socket.on('join-room', (roomId) => {
    const roomKey = roomId.toString() 
    socket.join(roomKey) 

    let users = rooms.get(roomKey) || new Set() 
    users.add(socket.id)  
    rooms.set(roomKey, users)  

    io.to(roomKey).emit('msg', `Welcome ${socket.id} to room ${roomKey}`) 

    io.to(roomKey).emit('room-info', Array.from(rooms.get(roomKey))) 
}) 

socket.on('playlist', (data) => {
    console.log(data)
    const roomKey = data && data?.roomId?.toString()
    io.to(roomKey).emit('msg', `${socket.id} selected playlist ${data.playlistId}`)
    io.to(roomKey).emit('playlist-add', data.playlistId)
})
socket.on('set-current-idx', (data) => {
    console.log(data)
    const roomKey = data && data?.roomId?.toString()
    io.to(roomKey).emit('msg', `${socket.id} selected index ${data.currentIdx}`)
    io.to(roomKey).emit('current-idx', data.currentIdx)
})
socket.on('playing', (data) => {
    console.log(data)
    const roomKey = data &&data?.roomId?.toString()
    io.to(roomKey).emit('msg', `${socket.id} is playing :  ${data.playing}`)
    io.to(roomKey).emit('playing', data.playing)
})


    

    socket.on('disconnect', () => {
    rooms.forEach((users, roomId) => {
        if (users.has(socket.id)) {
            users.delete(socket.id) 


            io.to(roomId).emit('room-info', Array.from(users)) 


            if (users.size === 0) {
                rooms.delete(roomId) 
            } else {
                rooms.set(roomId, users)  
            }
        }
    }) 

    console.log("User disconnected", socket.id) 
}) 

})

module.exports = {app, server}