const express=require('express')

const PORT=process.env.PORT || 8080
const cors =require('cors')
const connectdb=require('./config/db')
const { app, server } = require('./config/socket')

const songRoutes = require('./routes/song.route')
const playlistRoutes = require('./routes/playlist.route')

require('dotenv').config();
console.log(process.env.ENV, process.env.ENV == "development" ? "it is development" : "it is production")
app.use(cors({
    // origin: "https://almostus.vercel.app/"
    origin: process.env.ENV == "development" ? "http://localhost:5173" : "https://almostus.vercel.app"
}));
app.use(express.json())

// Routes
app.use('/api/songs',songRoutes)
app.use('/api/playlists', playlistRoutes)

app.get('/ping', (req, res) => {
  console.log('✅ PING route hit');
  res.send('pong');
});

server.listen(PORT,async()=>{
    try{
        await connectdb()
        console.log(`Server is running in PORT ${PORT}`)
    }catch(error){
        console.log(error)
    }
})
