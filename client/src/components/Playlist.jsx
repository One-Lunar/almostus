import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const PlaylistList = () => {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/playlists/all')
        setPlaylists(response.data)
      } catch (err) {
        setError('Error fetching playlists',err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylists()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="relative z-10 text-3xl font-bold text-center mb-6 text-white">All Playlists</h2>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playlists.map((playlist) => (
          <Link key={playlist._id} to={`/playlist/${playlist._id}`} className="hover:shadow-lg transition-shadow duration-300">
            <div key={playlist._id} className="border rounded-lg shadow-md p-4 bg-white">
              <img
                src={playlist.coverimg}
                alt={playlist.title}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-3">{playlist.title}</h3>
              <p className="text-gray-700">Author: {playlist.author}</p>
              <p className="text-gray-500 text-sm mt-1">{playlist.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PlaylistList
