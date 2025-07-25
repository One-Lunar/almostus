import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSongStore } from '../stores/useSongStore'

const Songs = () => {
  const { songs, getAllSongs, deleteMusic } = useSongStore()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
      getAllSongs()
  }, [])
  
  console.log(songs)
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      await deleteMusic(id)
    }
  }

  const filteredSongs = songs?.filter((song) =>
    song.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Uploaded Songs</h2>

      <input
        type="text"
        placeholder="Search by song title..."
        className="w-full p-2 mb-6 border border-gray-300 rounded-lg text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredSongs?.length === 0 ? (
        <div className="text-center text-gray-500">No songs found.</div>
      ) : (
        filteredSongs.map((song) => (
          <div key={song._id} className="border p-4 rounded-lg mb-4 bg-white dark:bg-zinc-900">
            <p className="text-lg font-semibold text-white">Title: <span className="text-blue-300">{song.title}</span></p>
            <p className="text-white">Author: <span className="text-blue-300">{song.author}</span></p>
            <audio controls src={song.songUrl} className="w-full mt-2" />
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => navigate(`/edit/${song._id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(song._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Songs
