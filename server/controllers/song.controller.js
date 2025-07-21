const Song=require('../models/song.model')

const postSong=async (req, res) => {
    try{
        console.log("Received body:", req.body)
        const {title, author,songUrl, artist, playlist, genre, date, duration, lyrics, coverimg} = req.body;
        const newSong = new Song({
            title,author,songUrl, artist, playlist, genre, date, duration, lyrics, coverimg
        })
        await newSong.save();
        return res.status(201).json({message: 'Song created successfully', song: newSong})
    }catch (error) {
        return res.status(500).json({message: 'Error creating song', error: error.message})
    }
}

const getSongs=async (req, res) => { 
    try {
        const songs=await Song.find();
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({message:'Error fetching songs', error: error.message});
    }
}

const getSongById=async (req, res) => {
    try {
        const songId=req.params.id;
        const songData=await Song.findById(songId);
        if (!songData) {
            return res.status(404).json({message: 'Song not found'});
        }
        res.status(200).json(songData);
    } catch (error) {
        res.status(500).json({message: 'Error fetching song', error: error.message});
    }
}

const updateSong=async (req, res) => {
    try {
        const songId=req.params.id;
        const updatedData=req.body;
        const updatedSong=await Song.findByIdAndUpdate(songId, updatedData, {new: true});
        if (!updatedSong) {
            return res.status(404).json({message:'Song not found'})
        }
        res.status(200).json({message:'Song updated successfully',song: updatedSong})
    } catch (error) {
        res.status(500).json({message:'Error updating song',error: error.message})
    }
}
const deleteSong=async (req, res) => {
    try {
        const songId=req.params.id;
        const deletedSong=await Song.findByIdAndDelete(songId);
        if (!deletedSong) {
            return res.status(404).json({message:'Song not found'})
        }
        res.status(200).json({message:'Song deleted successfully'})
    } catch (error) {
        res.status(500).json({message:'Error deleting song',error: error.message})
    }  
}

const getSongsByPlaylist = async (req,res) => {
    try {
        const id = req.params.id
        const songs = await Song.find({playlist: id})
        if(!songs){
            return res.status(404).json({message:'Songs not found'})
        }
        return res.status(200).json({message: "Songs found successfully ", songs})
    } catch (error) {
        res.status(500).json({message:'Error getting songs by playlist.',error: error.message})
    }
}

module.exports = {
    postSong,
    getSongs,
    getSongById,
    updateSong,
    deleteSong,
    getSongsByPlaylist
};
