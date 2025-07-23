import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const PlaylistInfo = () => {
  const { id } = useParams()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/playlists/${id}`)
        setPlaylist(res.data)
      } catch (err) {
        setError('Error fetching playlist details',err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylist()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-600">{error}</p>
  
  return (
      <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-5xl font-bold mb-2 text-white ">{playlist.title}</h2>
      <img
        src={
          playlist.coverimg?.startsWith('http')
            ? playlist.coverimg
            : `data:image/jpeg;base64,${playlist.coverimg}`
        }
        alt={playlist.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="text-gray-600 mb-1">Author: {playlist.author}</p>
      <p className="text-gray-500">{playlist.description}</p>
    </div>
  )
}

export default PlaylistInfo
