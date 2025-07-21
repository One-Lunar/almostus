const express = require('express')
const router = express.Router()

const { postSong, getSongs, getSongById, updateSong, deleteSong } = require('../controllers/songcontrollers')

router.post('/songs', postSong)
router.get('/getsongs', getSongs)
router.get('/getsong/:id', getSongById)
router.put('/updatesong/:id', updateSong)
router.delete('/deletesong/:id', deleteSong)

module.exports=router