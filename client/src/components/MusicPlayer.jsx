import React, { useRef, useState } from 'react'

const MusicPlayer = () => {
  const audioRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const songs = [
    'test_music/song1.mp3',
    'test_music/song2.mp3',
    'test_music/song3.mp3'
  ]

  const playSong = () => {
    if (audioRef.current) {
      audioRef.current.play()
    }
  }

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const nextSong = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % songs.length
      return newIndex
    })
  }

  const previousSong = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + songs.length) % songs.length
      return newIndex
    })
  }


  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
      audioRef.current.play()
    }
  }, [currentIndex])

  return (
    <div>
      <audio ref={audioRef} autoPlay>
        <source src={songs[currentIndex]} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div style={{ marginTop: '10px' }}>
        <button onClick={previousSong}>Previous</button>
        <button onClick={playSong}>Play</button>
        <button onClick={pauseSong}>Pause</button>
        <button onClick={nextSong}>Next</button>
      </div>
    </div>
  )
}

export default MusicPlayer
