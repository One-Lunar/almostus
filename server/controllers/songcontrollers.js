const song=require('../models/songmodel')

const postSong=async (req, res) => {
    try{
        const {title, author, artist, album, genre, date, duration, lyrics, coverimg} = req.body;
        const newSong = new song({
            title,author, artist, album, genre, date, duration, lyrics, coverimg
        })
        await newSong.save();
        res.status(201).json({message: 'Song created successfully', song: newSong})
    }catch (error) {
        res.status(500).json({message: 'Error creating song', error: error.message})
    }
}

const getSongs=async (req, res) => { 
    try {
        const songs=await song.find();
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({message:'Error fetching songs', error: error.message});
    }
}

const getSongById=async (req, res) => {
    try {
        const songId=req.params.id;
        const songData=await song.findById(songId);
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
        const updatedSong=await song.findByIdAndUpdate(songId, updatedData, {new: true});
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
        const deletedSong=await song.findByIdAndDelete(songId);
        if (!deletedSong) {
            return res.status(404).json({message:'Song not found'})
        }
        res.status(200).json({message:'Song deleted successfully'})
    } catch (error) {
        res.status(500).json({message:'Error deleting song',error: error.message})
    }  
}

module.exports = {postSong,getSongs,getSongById,updateSong,deleteSong};
