const Playlist = require('../models/playlist.model') 


const postPlaylist = async (req, res) => {
    try {
        const { title, description, author } = req.body 
        const newPlaylist = new Playlist({ title, description, author }) 
        await newPlaylist.save() 
        res.status(201).json({ message: 'Playlist created successfully', playlist: newPlaylist }) 
    } catch (error) {
        res.status(500).json({ message: 'Error creating playlist', error: error.message }) 
    }
} 


const getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find() 
        res.status(200).json(playlists) 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlists', error: error.message }) 
    }
} 


const getPlaylistById = async (req, res) => {
    try {
        const playlistId = req.params.id 
        const playlist = await Playlist.findById(playlistId) 
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' }) 
        }
        res.status(200).json(playlist) 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlist', error: error.message }) 
    }
} 


const updatePlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id 
        const updatedData = req.body 
        const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, updatedData, { new: true }) 
        if (!updatedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found' }) 
        }
        res.status(200).json({ message: 'Playlist updated successfully', playlist: updatedPlaylist }) 
    } catch (error) {
        res.status(500).json({ message: 'Error updating playlist', error: error.message }) 
    }
} 


const deletePlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id 
        const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId) 
        if (!deletedPlaylist) {
            return res.status(404).json({ message: 'Playlist not found' }) 
        }
        res.status(200).json({ message: 'Playlist deleted successfully' }) 
    } catch (error) {
        res.status(500).json({ message: 'Error deleting playlist', error: error.message }) 
    }
} 

module.exports = {
    postPlaylist,
    getPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist
} 
