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
    artist:{
        type: String,
        required: true,
    },
    album:{
        type: String,
        required: true,
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
        required: true,
    },
    lyrics:{
        type: String,
        required: true,
    },
    coverimg:{
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('song', songSchema)