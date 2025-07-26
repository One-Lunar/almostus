import { ArrowBigUp, Dot, Pause, Play, Shuffle, SkipBack, SkipForward, ThermometerIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { socket } from '../utils/socket'

const MusicPlayer = ({roomId, playlistId, songs, currentIndex, setCurrentIndex, isRoom}) => {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)


  const [isShuffle, setIsShuffle] = useState(false)
  const visited = new Set()


  // Future 
  const toggleShuffle = () => {
    setIsShuffle(prev => !prev)
    // socket.emit('shuffle', {roomId, isShuffle})
  }

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
    let newIndex = prevIndex

    if (isShuffle && !isRoom) {
      if (visited.size === songs.length) {
        visited.clear()
      }

      do {
        newIndex = Math.floor(Math.random() * songs.length)
      } while (visited.has(newIndex))

      visited.add(newIndex)
    } 
    if(!isShuffle) {
      newIndex = (prevIndex + 1) % songs.length
      visited.add(newIndex)
    }
    console.log("shuffle",isShuffle)
    socket.emit('current-idx', {
      roomId,
      currentIdx: newIndex,
      onLoad: false,
      mode: 'next',
    })
    console.log(visited)
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
      playSong()
    }
    else{
      pauseSong()
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
  

    // Function Keys 
    useEffect(() => {
        if (navigator.mediaSession) {
          console.log(navigator.mediaSession)
            navigator.mediaSession.setActionHandler('play', () => {
                playSong()
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                pauseSong()
            });
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                nextSong()
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {

                previousSong()
            });
        }
    }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent the default scrolling behavior
      if ((e.keyCode === 32 || e.code === 'Space') && e.target === document.body) {
        e.preventDefault() 
      }

      // Play Pause 
      if(e.code == "Space"){
        e.preventDefault()
        setIsPlaying(prev => !prev)
      }
        if(e.code == "KeyH"){
          setIsShuffle(prev => !prev)
      }

    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
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
  const title = document.querySelector('title')
  title.innerText = songs[currentIndex]?.title
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
          <div className='w-15 h-15 border border-zinc-800 p-1 bg-zinc-800 animate-pulse'></div>
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
      className="text-zinc-300 hidden lg:block hover:text-white transition-colors"
    >
      <SkipBack />
    </button>

    {!isPlaying && <button
      onClick={playSong}
      className="bg-white  text-zinc-900 p-3 rounded-full hover:scale-105 transition"
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
      className="text-zinc-300 hidden lg:block hover:text-white transition-colors"
    >
      <SkipForward />
    </button>
    </div>
    
    {!isRoom && <div className='cursor-pointer flex items-center gap-2'>
      <Shuffle className={`${isShuffle ? 'text-green-500': 'text-white'}`}
      onClick={toggleShuffle}
      />
      <h1 className=' gap-1 items-center text-zinc-300 hidden lg:flex text-xs border border-zinc-600 p-1 rounded-md'><ArrowBigUp size={15}/>H</h1>
    </div>}
  </div>
</div>

  )
}

export default MusicPlayer
