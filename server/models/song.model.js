const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    songUrl: {
        type: String,
        requried: true
    },
    artist:{
        type: String,
        required: true,
    },
    playlist:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist"
    },
    genre:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    duration:{
        type: Number,
    },
    lyrics:{
        type: String,
    },
    coverimg:{
        type: String,
        required: true,
    }
}, {timestamps : true})

module.exports = mongoose.model('Song', songSchema)
