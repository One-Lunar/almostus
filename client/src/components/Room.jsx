import React, { useEffect, useState } from 'react' 
import { useParams, useSearchParams } from 'react-router-dom' 
import { socket } from '../utils/socket' 
import { usePlaylistStore } from '../stores/usePlaylistStore' 
import MusicPlayer from './MusicPlayer' 
import NotificationModal from './NotificationModal'
import { ChevronDown, ChevronUp } from 'lucide-react'

const Room = () => {
  const { id: roomId } = useParams() 
  const [searchParams, setSearchParams] = useSearchParams() 

  const playlistId = searchParams.get('playlist') 
  const currentIdxParam = searchParams.get('currentIdx') 
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false)
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
  <div className="min-h-screen bg-zinc-900 text-white px-6 py-8 space-y-8">
    <div className="text-2xl font-semibold tracking-tight">Room ID: {roomId}</div>

    <div className="space-y-2">
      <h2 className="text-sm uppercase tracking-widest text-zinc-400">Members</h2>
      <ul className="flex flex-wrap items-center gap-3">
        {users?.map((user) => (
          <li
            key={user}
            className="bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-full px-4 py-1 text-xs"
          >
            {user[1]}
          </li>
        ))}
      </ul>
    </div>

    {(!songs) && (
  <div className="w-full space-y-4">
    <button
      onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
      className="flex items-center gap-2 text-sm px-4 py-2 bg-zinc-800 text-white border border-zinc-700 rounded-lg hover:border-zinc-600 transition"
    >
      {isPlaylistOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      {isPlaylistOpen ? 'Hide Playlists' : 'Show Playlists'}
    </button>
      
    <div
      className={`transition-all duration-300 ease-in-out ${
        isPlaylistOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {playlists?.map((playlist) => (
          <div
            key={playlist._id}
            className="flex items-center gap-4 p-4 bg-zinc-800 border border-zinc-700 rounded-xl hover:border-zinc-600 transition"
          >
            <img
              src={playlist.coverimg}
              alt={playlist.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-base font-medium text-white">{playlist.title}</h3>
            </div>
            <button
              onClick={() => selectPlaylist(playlist._id)}
              className="text-xs px-3 py-1 bg-white text-zinc-900 rounded hover:bg-zinc-200 transition"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

    <div className="flex flex-col gap-3 mb-20 items-center">
      {songs?.map((song, idx) => (
        <div
          key={song._id}
          onClick={() => selectedSong(idx)}
          className="flex items-center gap-4 w-full max-w-2xl cursor-pointer p-1 bg-zinc-800 border border-zinc-700 rounded-xl hover:border-zinc-600 transition"
        >
          <img
            src={song.coverimg}
            alt={song.title}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div>
            <h4 className="text-sm font-medium text-white">{song.title}</h4>
            <p className="text-xs text-zinc-400">{song.author}</p>
          </div>
        </div>
      ))}
    </div>

    {songs && (
      <div className="mt-8">
        <MusicPlayer
          roomId={roomId}
          playlistId={playlistId}
          songs={songs}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
    )}

    <NotificationModal messages={messages} />
  </div>
)



} 

export default Room 
