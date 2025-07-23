import { Dot, Pause, Play, SkipBack, SkipForward, ThermometerIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { socket } from '../utils/socket'

const MusicPlayer = ({roomId, playlistId, songs, currentIndex, setCurrentIndex}) => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  // const songs = [
  //   'test_music/song1.mp3',
  //   'test_music/song2.mp3',
  //   'test_music/song3.mp3'
  // ]

  const playSong = async () => {
    if (audioRef.current) {
      setIsPlaying(true)
      await audioRef.current.play()
      roomId && socket.emit("playing", {roomId, playing: true})
    }
  }

  const pauseSong = async () => {
    if (audioRef.current) {
      setIsPlaying(false)
      await audioRef.current.pause()
      roomId && socket.emit("playing", {roomId, playing: false})
    }
  }

  const nextSong = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % songs.length
      return newIndex
    })
    setIsPlaying(true)
  }

  const previousSong = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + songs.length) % songs.length
      return newIndex
    })
    setIsPlaying(true)
  }

  useEffect(() => {
    if(isPlaying){
      audioRef.current.play()
      
    }
    else{
      audioRef.current.pause()
    }
  }, [isPlaying])
  useEffect(() => {
    socket.on("playing", (playing) => {
      setIsPlaying(playing)
      
    })

    return () => {
      socket.off("playing")
    }
  }, [])
  React.useEffect(() => {
    if (audioRef.current) {
      socket.emit('set-current-idx', {playlistId, roomId, currentIdx: currentIndex})
      audioRef.current.load()
      setIsPlaying(true)
    }
  }, [currentIndex])

  return (
  <div className="fixed bottom-0 left-0 w-full bg-zinc-900/80 backdrop-blur border-t border-zinc-800 px-6 py-4">
  <audio ref={audioRef} autoPlay onEnded={nextSong}>
    <source src={songs[currentIndex].songUrl} type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>

  <div className="flex items-center justify-between">
    <div className='flex items-center gap-5'>
      <div className='w-20  rounded-md border border-zinc-800 p-1' >
        <img src={songs[currentIndex].coverimg} alt="" />
      </div>
      <div>
       <h1 className='text-md text-zinc-100'>{songs[currentIndex].title.slice(0,45)}</h1>
        <p className='text-xs text-zinc-300'>{songs[currentIndex].author}</p>  
      </div>
    </div>
    <div className='flex gap-5'>
      <button
      onClick={previousSong}
      className="text-zinc-300 hover:text-white transition-colors"
    >
      <SkipBack />
    </button>

    {!isPlaying && <button
      onClick={playSong}
      className="bg-white text-zinc-900 p-3 rounded-full hover:scale-105 transition"
    >
      <Play />
    </button>}

    {isPlaying && <button
      onClick={pauseSong}
      className="bg-white text-zinc-900 p-3 rounded-full hover:scale-105 transition"
    >
      <Pause />
    </button>}

    <button
      onClick={nextSong}
      className="text-zinc-300 hover:text-white transition-colors"
    >
      <SkipForward />
    </button>
    </div>
    <div>
      <ThermometerIcon className='text-white'/>
    </div>
  </div>
</div>

  )
}

export default MusicPlayer
