import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { usePlaylistStore } from '../stores/usePlaylistStore'
import MusicPlayer from './MusicPlayer'

const PlaylistInfo = () => {
  const { id } = useParams()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const baseUrl = import.meta.env.VITE_ENV == "development" ? "http://localhost:8080" : "https://almostus.onrender.com"

  const { songs, getSongsByPlaylist} = usePlaylistStore()

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/playlists/${id}`)
        setPlaylist(res.data)
      } catch (err) {
        setError('Error fetching playlist details',err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylist()
  }, [id])
  useEffect(() => {
    getSongsByPlaylist(id)
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-600">{error}</p>
  
  return (
      <div className="max-w-2xl mx-auto p-6 mb-30">
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
      <div>
        <h1 className='text-2xl my-10 font-black text-white'>Songs</h1>
        <div className='flex flex-col justify-center gap-2'>
            {songs && songs?.map((song,idx) => (
              <div 
              onClick={() => setCurrentIndex(idx)}
              className='text-white cursor-pointer flex items-center gap-3 bg-zinc-800 p-1 rounded-md border-zinc-700'>
                <img className='w-15' src={song.coverimg} alt="" />
                <div>
                  <h1 className='text-md'>{song.title}</h1>
                  <p className='text-xs text-zinc-300'>{song.author}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      {songs && <MusicPlayer songs={songs} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>}
    </div>
  )
}

export default PlaylistInfo
