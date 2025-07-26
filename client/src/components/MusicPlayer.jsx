import { Dot, Pause, Play, Shuffle, SkipBack, SkipForward, ThermometerIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { socket } from '../utils/socket'

const MusicPlayer = ({roomId, playlistId, songs, currentIndex, setCurrentIndex}) => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)


  // const [isShuffle, setIsShuffle] = useState(false)



  // Future 
  // const toggleShuffle = (isShuffle) => {
  //   setIsShuffle(prev => !prev)
  //   socket.emit('shuffle', {roomId, isShuffle})
  // }

  // useState(() => {
  //   socket.on('shuffle', (data) => {
  //     setIsShuffle(data.isShuffle)
  //   })
  //   return () => {
  //     socket.off('shuffle')
  //   }
  // }, [])

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
      // Future 
      // let newIndex = prevIndex
      // if(isShuffle){
      //   newIndex = Math.floor(Math.random() * songs.length)
      // }else{
      // }
      let newIndex = (prevIndex + 1) % songs.length
      socket.emit('current-idx', {roomId, currentIdx: newIndex, onLoad: false, mode: 'next'})
      
      return newIndex
    })
    setIsPlaying(true)
  }

  const previousSong = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + songs.length) % songs.length
      socket.emit('current-idx', {roomId, currentIdx: newIndex, onLoad: false, mode: 'previous'})
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
  


useEffect(() => {

  socket.emit('duration', {roomId, currentTime: audioRef.current.currentTime})

  socket.on('duration', data => {
    if(audioRef.current){
      audioRef.current.currentTime = data.currentTime;
    }
  })

  return () => {
    socket.off('duration')
  }

}, [roomId])

useEffect(() => {
  const coverImg = songs[currentIndex]?.coverimg;
  if (!coverImg) return;

  const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
  link.rel = 'icon';
  link.href = coverImg;
  link.type = 'image/png';

  document.head.appendChild(link);
}, [currentIndex, songs]);

  React.useEffect(() => {
    if (audioRef.current) {
      socket.emit('current-idx', {roomId, currentIdx: currentIndex, mode: 'load'})
      audioRef.current.load()
      console.log("Audio", audioRef.current.duration)
      setIsPlaying(true)
    }
    if(currentIndex == -1){
      setIsPlaying(false)
    }
  }, [currentIndex])

  return (
  <div className="fixed bottom-0 left-0 w-full bg-zinc-900/80 backdrop-blur border-t border-zinc-800 px-6 py-4">
  <audio
  ref={audioRef} 
  autoPlay 
  onEnded={nextSong}
  >
    <source src={songs[currentIndex]?.songUrl} type="audio/mpeg" />
    Your browser does not support the audio element.
  </audio>

  <div className="flex items-center justify-between">
    <div className='flex items-center gap-5'>
      <div className='rounded-mdp-1' >
        {songs[currentIndex] ?   <img className='lg:w-20 lg:h-20 w-15 h-15 object-contain' src={songs[currentIndex]?.coverimg} alt="" /> : (
          <div className='w-20 h-20 border border-zinc-800 p-1 bg-zinc-800 animate-pulse'></div>
        )}
      </div>  
      <div className='flex justify-start flex-col gap-2'>
      {songs[currentIndex] ?  <h1 className='lg:text-md text-sm text-zinc-100'>{songs[currentIndex]?.title.slice(0,45)}</h1> : (
        <div className={`w-30 h-4 bg-zinc-800 animate-pulse rounded-md`}></div>
      )}
        {songs[currentIndex] ?   <p className='text-xs text-zinc-300'>{songs[currentIndex]?.author}</p>  
 : (
        <div className='w-30 h-2 bg-zinc-800 animate-pulse rounded-md'></div>
      )}
      </div>
    </div>
    <div className='flex gap-3'>
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

    {(isPlaying) && <button
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
    {/* <div className='cursor-pointer'>
      {!isShuffle ? <div
      onClick={() => toggleShuffle(true)}
      >
        <Shuffle />
        <div className='w-1 animate-pulse h-1 rounded-full'>
        </div>
      </div> : (
      <div 
      onClick={() => toggleShuffle(false)}
      className='flex flex-col items-center gap-2'>
        <Shuffle  className='text-green-500'/>
        <div className='w-1 animate-pulse h-1 bg-green-500 rounded-full'>
        </div>
      </div>
      )}
    </div> */}
    <div className='hidden lg:flex'>
      <Dot />
    </div>
  </div>
</div>

  )
}

export default MusicPlayer
