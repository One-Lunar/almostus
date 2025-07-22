import React, { useEffect } from 'react'
import { useSongStore } from '../stores/useSongStore'
import { useState } from 'react'
import MusicPlayer from './MusicPlayer'

const Songs = () => {
  const { getAllSongs, songs } = useSongStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  useEffect(() => {
    getAllSongs()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-zinc-100 mb-4">Songs</h2>

      <div className='text-white flex flex-wrap gap-2 sm:items-center justify-center md:justify-start'>
        {songs && songs?.map((song, idx) => (
            <div 
            onClick={() => setCurrentIndex(idx)}
            className='bg-zinc-800 border rounded-md cursor-pointer p-1 w-64 border-zinc-700 flex items-center justify-between'>
                <div>
                    <img src={song.coverimg} className='w-15' alt="" />
                </div>
                <div>
                    <h1 className='text-md text-zinc-100'>{song.title.slice(0,45)}</h1>
                    <p className='text-xs text-zinc-300'>{song.author}</p>
                </div>
                {currentIndex == idx ?  <div className='w-2 h-2 bg-green-400 mr-5 rounded-full animate-pulse'></div> : (
                    <div className='w-2 h-2 bg-black-400 mr-5 rounded-full animate-pulse'></div>
                )}
            </div>
        ))}
      </div>
      {songs && <MusicPlayer songs={songs} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}/>}
    </div>
  )
}

export default Songs
