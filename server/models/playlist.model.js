const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    author: {
        type: String,
        required: true,
        default: null
    }
}, {timestamps : true})

module.exports = mongoose.model('Playlist', playlistSchema)
