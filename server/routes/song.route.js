const express = require('express')
const router = express.Router()

const { postSong, getSongs, getSongById,getSongsByPlaylist, updateSong, deleteSong } = require('../controllers/song.controller')

router.post('/post', postSong)
router.get('/all', getSongs)
router.get('/playlist/:id', getSongsByPlaylist)
router.get('/:id', getSongById)
router.put('/:id', updateSong)
router.delete('/:id', deleteSong)

module.exports = router
