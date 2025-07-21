const express=require('express')
const app=express()
const PORT=process.env.PORT || 5000
const cors =require('cors')
const connectdb=require('./config/db')
const songRoutes = require('./routes/routes')

require('dotenv').config();

app.use(cors())
app.use(express.json())
app.use('/api/song',songRoutes)


app.listen(PORT,async()=>{
    try{
        await connectdb()
        console.log(`Server is running in PORT ${PORT}`)
    }catch(error){
        console.log(error)
    }
})
