import React, { useEffect, useState } from 'react' 
import { useParams, useSearchParams } from 'react-router-dom' 
import { socket } from '../utils/socket' 
import { usePlaylistStore } from '../stores/usePlaylistStore' 
import MusicPlayer from './MusicPlayer' 
import NotificationModal from './NotificationModal'

const Room = () => {
  const { id: roomId } = useParams() 
  const [searchParams, setSearchParams] = useSearchParams() 

  const playlistId = searchParams.get('playlist') 
  const currentIdxParam = searchParams.get('currentIdx') 

  const [users, setUsers] = useState([]) 
  const [currentIndex, setCurrentIndex] = useState(Number(currentIdxParam) || 0) 
  const [messages, setMessages] = useState([])

  const { songs, playlists, getAllPlaylists, getSongsByPlaylist } = usePlaylistStore() 

  // Join room and set up listeners
  useEffect(() => {
    if (!roomId) return 

    socket.emit('join-room', roomId) 

    const msgHandler = (msg) => {
      setMessages(prev => [...prev, msg])
    }

    const roomInfoHandler = (info) => setUsers(info) 

    

    const currentIdxHandler = (idx) => {
      setCurrentIndex(idx) 
      setSearchParams((prev) => {
        const updated = new URLSearchParams(prev) 
        updated.set('currentIdx', idx) 
        if (playlistId) updated.set('playlist', playlistId) 
        return updated 
      }) 
    } 

    

    socket.on('msg', msgHandler) 
    socket.on('room-info', roomInfoHandler) 
    socket.on('current-idx', currentIdxHandler) 

    return () => {
      socket.off('msg', msgHandler) 
      socket.off('room-info', roomInfoHandler) 
      socket.off('current-idx', currentIdxHandler) 
    } 
  }, [roomId]) 

  useEffect(() => {
    const playlistAddHandler = (playlistId) => {
      setSearchParams((prev) => {
        const updated = new URLSearchParams(prev) 
        updated.set('playlist', playlistId) 
        updated.delete('currentIdx') 
        return updated 
      }) 
    } 
    const roomStateHandler = ({ playlistId, currentIndex }) => {
      setCurrentIndex(currentIndex ?? 0) 
      setSearchParams((prev) => {
        const updated = new URLSearchParams(prev) 
        if (playlistId) updated.set('playlist', playlistId) 
        if (typeof currentIndex === 'number') updated.set('currentIdx', currentIndex) 
        return updated 
      }) 
    } 
    socket.on('playlist', playlistAddHandler) 
    socket.on('room-state', roomStateHandler) 



    return () => {
      socket.off('room-state', roomStateHandler) 
      socket.off('playlist', playlistAddHandler) 
    }
  }, [playlistId])
  // Get all playlists once
  useEffect(() => {
    getAllPlaylists() 
  }, []) 

  // Fetch songs when playlistId changes
  useEffect(() => {
    if (playlistId) {
      getSongsByPlaylist(playlistId) 
    }
  }, [playlistId]) 

  const selectPlaylist = (playlistId) => {
    socket.emit('playlist', { playlistId, roomId }) 
    roomId && socket.emit("playing", {roomId, playing: false})
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev) 
      if (playlistId) updated.set('playlist', playlistId) 
      return updated 
    }) 
  } 

  const selectedSong = (idx) => {
    setCurrentIndex(idx) 
    socket.emit('set-current-idx', { playlistId, roomId, currentIdx: idx }) 
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev) 
      updated.set('currentIdx', idx) 
      if (playlistId) updated.set('playlist', playlistId) 
      return updated 
    }) 
  } 

  const changePlaylist = () => {

    socket.emit('set-current-idx', { playlistId:null, roomId, currentIdx: 0 }) 
    socket.emit('playlist', { playlistId:null, roomId }) 
    roomId && socket.emit('playing', { roomId, playing: false }) 
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev) 
      updated.set('playlist', null) 
      updated.delete('currentIdx') 
      return updated 
    }) 
  } 

return (
  <div className="text-white">
    <div className='text-4xl font-black'>Room ID: {roomId}</div>

    <div className='m-5'>
      <h1>Members</h1>
      <ul className="flex items-center gap-3 ,y-2 w-screen ">
        {users && users?.map((user) => (
          <li key={user} className="bg-zinc-800 border text-xs border-zinc-700 rounded-md p-2">
            {user[1]}
          </li>
        ))}
      </ul>
    </div>


       {!playlistId && 
       <div className="flex w-screen flex-wrap items-center gap-4 justify-center">
        {playlists && playlists?.map((playlist) => (
          <div
            key={playlist._id}
            className="flex rounded-md items-center justify-between px-2 gap-3 bg-zinc-800 border border-zinc-700 w-60"
          >
            <img src={playlist.coverimg} className="w-15 h-15 rounded-md p-1" alt={playlist.title} />
            <h1>{playlist.title}</h1>
            <button
              onClick={() => selectPlaylist(playlist._id)}
              className="text-xs rounded-sm bg-white text-black p-1"
            >
              Select
            </button>
          </div>
        ))}
      </div>
       }


    {/* <div>
      <button onClick={() =>  changePlaylist()} className="text-xs rounded-sm bg-white text-black p-1 m-4">
        Change Playlist
      </button>
    </div> */}

    <div className='flex flex-col gap-2 justify-center items-center'>
      {songs && songs?.map((song, idx) => (
        <div
          key={song._id}
          onClick={() => selectedSong(idx)}
          className="flex cursor-pointer w-11/12 lg:w-1/2 rounded-md items-center px-2 gap-3 bg-zinc-800 border border-zinc-700"
        >
          <img src={song.coverimg} className="w-15 h-15 rounded-md p-1" alt={song.title} />
        <div>
            <h1 className='text-sm'>{song.title}</h1>
          <h1 className='text-xs'>{song.author}</h1>
        </div>
        </div>
      ))}
    </div>

    {songs && (
      <MusicPlayer
        roomId={roomId}
        playlistId={playlistId}
        songs={songs}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    )}
    <NotificationModal messages={messages}/>
  </div>
)


} 

export default Room 
