const router = require('express').Router()
const {
    postPlaylist,
    getPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist
}  = require("../controllers/playlist.controller")


router.post('/post', postPlaylist)
router.get('/all', getPlaylists)
router.get('/:id', getPlaylistById)
router.put("/:id", updatePlaylist)
router.delete("/:id", deletePlaylist)

module.exports = router