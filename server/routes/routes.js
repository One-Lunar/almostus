const express = require('express')
const router = express.Router()

const { postSong, getSongs, getSongById, updateSong, deleteSong } = require('../controllers/songcontrollers')

router.post('/post', postSong)
router.get('/all', getSongs)
router.get('/:id', getSongById)
router.put('/update/:id', updateSong)
router.delete('/delete/:id', deleteSong)

module.exports=router
