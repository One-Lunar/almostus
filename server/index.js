const express=require('express')
const app=express()
const PORT=process.env.PORT || 8080
const cors =require('cors')
const connectdb=require('./config/db')

const songRoutes = require('./routes/song.route')
const playlistRoutes = require('./routes/playlist.route')

require('dotenv').config();

app.use(cors());
app.use(express.json())

// Routes
app.use('/api/songs',songRoutes)
app.use('/api/playlists', playlistRoutes)

app.get('/ping', (req, res) => {
  console.log('✅ PING route hit');
  res.send('pong');
});

app.listen(PORT,async()=>{
    try{
        await connectdb()
        console.log(`Server is running in PORT ${PORT}`)
    }catch(error){
        console.log(error)
    }
})
