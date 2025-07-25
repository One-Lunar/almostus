const app = require('express')()  
const http = require('http')  
const { Server } = require('socket.io')  
const server = http.createServer(app)  
require('dotenv').config()

const io = new Server(server, {
  cors: {
    // origin: "https://almostus.vercel.app/"
    origin: process.env.ENV == "development" ? "http://localhost:5173" : "https://almostus.vercel.app"
  },
})  
console.log(process.env.ENV, process.env.ENV == "development" ? "it is development" : "it is production")

const rooms = new Map()   // Map<roomId, { users: Set, playlistId: string|null, currentIndex: number|null }>
const randomNames = [
  "Unclean Apple",
  "Confused Pickle",
  "Dizzy Waffle",
  "Spicy Pillow",
  "Angry Toaster",
  "Snoring Cactus",
  "Moody Banana",
  "Fluffy Lizard",
  "Funky Stapler",
  "Grumpy Marshmallow",
  "Lost Avocado",
  "Dramatic Turnip",
  "Soggy Notebook",
  "Wiggly Sock",
  "Awkward Pancake",
  "Sweaty Remote",
  "Invisible Donut",
  "Noisy Burrito",
  "Tired Cupcake",
  "Greasy Unicorn",
  "Suspicious Hamster",
  "Slippery Taco",
  "Deflated Balloon",
  "Polite Chainsaw",
  "Lukewarm Muffin",
  "Stinky Penguin",
  "Burping Keyboard",
  "Flatulent Koala",
  "Anxious Tomato",
  "Crispy Cloud",
  "Sarcastic Orange",
  "Wobbly Chair",
  "Lazy Jalapeño",
  "Snarky Bubble",
  "Panicked Noodle",
  "Forgetful Spoon",
  "Itchy Jellybean",
  "Oblivious Ferret",
  "Drowsy Pretzel",
  "Cranky Milkshake",
  "Unicorn Sneeze",
  "Yawning Blender",
  "Ticklish Brick",
  "Meh Pineapple",
  "Half-Baked Turntable",
  "Mildly Concerned Trout",
  "Jumpy Eggplant",
  "Mysterious Sock",
  "Regretful Watermelon",
  "Quirky Zucchini"
]

io.on('connection', (socket) => {
  console.log("User connected", socket.id)  

  socket.on('join-room', (roomId) => {
    const roomKey = roomId.toString()  
    socket.join(roomKey)  

    let room = rooms.get(roomKey)  
    if (!room) {
      room = {
        users: new Map(),
        playlistId: null,
        currentIndex: -1,
      }  
    }

    room.users.set(socket.id, randomNames[Math.floor(Math.random() * randomNames.length)])  
    rooms.set(roomKey, room)  

    io.to(roomKey).emit('msg', `Welcome ${room.users.get(socket.id)} to room ${roomKey}`)  
    io.to(roomKey).emit('room-info', Array.from(room.users))  

    // Send the room state ONLY to the new user
    io.to(roomKey).emit('room-state', {
      playlistId: room.playlistId,
      currentIndex: room.currentIndex ?? -1,
    })  
  })  

  socket.on('playlist', (data) => {
    const roomKey = data?.roomId?.toString()  
    const room = rooms.get(roomKey)  
    if (!room) return  

    room.playlistId = data.playlistId  
    room.currentIndex = -1   // reset index when new playlist selected

    io.to(roomKey).emit('room-state', {
      playlistId: room.playlistId,
      currentIndex: room.currentIndex ?? -1,
    }) 

    rooms.set(roomKey, room)  

    if(data.playlistId != null){
      io.to(roomKey).emit('msg', `${room.users.get(socket.id)} selected a playlist`)  
    }
  })  

  socket.on('current-idx', (data) => {
    const roomKey = data?.roomId?.toString()  
    const room = rooms.get(roomKey)  
    if (!room) return  

    room.currentIndex = data.currentIdx 
    
    io.to(roomKey).emit('room-state', {
      playlistId: room.playlistId ?? null,
      currentIndex: room.currentIndex ?? -1,
    }) 
    const message = `${room.users.get(socket.id)} ${data.mode == "select" ? "selected" : data.mode == "next" ? "forwarded" : "backwarded" } the song`
    if(data.mode != "load"){
      io.to(roomKey).emit('msg', message)
    }

    rooms.set(roomKey, room)  
    
  })  
  // Future 
  // socket.on('shuffle', (data) => {
  //   const roomKey = data?.roomId?.toString()  
  //   const room = rooms.get(roomKey) 
  //   io.to(roomKey).emit('shuffle', data)
  //   io.to(roomKey).emit('msg', `${room.users.get(socket.id)} turned on shuffle mode`)  
  // })

  socket.on('playing', (data) => {
    const roomKey = data?.roomId?.toString() 
    const room = rooms.get(roomKey)  
    io.to(roomKey).emit('msg', `${room.users.get(socket.id)} ${data.playing ? "played the song" : "paused the song"}`)  
    io.to(roomKey).emit('playing', data.playing)  
  })  

  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id)  

        io.to(roomId).emit('room-info', Array.from(room.users))  

        if (room.users.size === 0) {
          rooms.delete(roomId)   // cleanup
        } else {
          rooms.set(roomId, room)   // update room
        }
      }
    })  

    console.log("User disconnected", socket.id)  
  })  
})  

module.exports = { app, server }  
