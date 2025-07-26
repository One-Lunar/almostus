import React, { useEffect, useState } from 'react' 
import { useNavigate, useParams, useSearchParams } from 'react-router-dom' 
import { socket } from '../utils/socket' 
import { usePlaylistStore } from '../stores/usePlaylistStore' 
import MusicPlayer from './MusicPlayer' 
import NotificationModal from './NotificationModal'
import { ChevronDown, ChevronUp, Share } from 'lucide-react'
import Songs from '../components_main/Songs'
import Button from '../chunks/Button'

const Room = () => {
  const { id: roomId } = useParams() 
  const [searchParams, setSearchParams] = useSearchParams() 

  const playlistId = searchParams.get('playlist') 
  const currentIdxParam = searchParams.get('currentIdx') 
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false)
  const [users, setUsers] = useState([]) 
  const [currentIndex, setCurrentIndex] = useState(Number(currentIdxParam) || -1) 
  const [messages, setMessages] = useState([])
  const navigate = useNavigate()

  const { songs, playlists, getAllPlaylists, getSongsByPlaylist } = usePlaylistStore() 
  const username = users.filter(user => user[0] == socket.id)
  // Data Fetchers

  useEffect(() => {
    getAllPlaylists()
  }, [])

  useEffect(() => {
    playlistId && getSongsByPlaylist(playlistId)
  }, [playlistId])

  
  // Params Helper function 
  const paramsSetter = (currentIndex, playlistId) => {

    setSearchParams((prev) => {
        const updated = new URLSearchParams(prev) 

        if (currentIndex != -1) {
          updated.set('currentIndex', currentIndex) 
        }else{
          updated.delete('currentIndex') 
        }

        if (playlistId) {
          updated.set('playlist', playlistId) 
        }else{
          updated.delete('playlist') 
        }
        return updated 
      }) 
  }

  // Joining the room using RoomId
  useEffect(() => {
    socket.emit('join-room', roomId)
    socket.on('room-info', (info) => {
      setUsers(info)
    })

    
    return () => {
      socket.off('room-info')
    }
    
  }, [roomId])

  useEffect(() => {
    socket.on('msg', (msg) => {
      setMessages(prev => [...prev, msg])
    })
  }, [])

  useEffect(() => {
  const handleRoomState = (data) => {
    paramsSetter(data.currentIndex, data.playlistId)
    setCurrentIndex(data.currentIndex ?? -1)
  }

  socket.on('room-state', handleRoomState)
  return () => {
    socket.off('room-state', handleRoomState)
  }
}, [playlistId, roomId])

  
  const selectPlaylist = (playlistId) => {
    socket.emit('playlist', {roomId, playlistId})
  }

  const selectedSong = (idx) => {
    socket.emit('current-idx', {roomId, currentIdx: idx, mode: 'select'})
  }
  
  const changePlaylist = () => {
    socket.emit('playlist', {roomId, playlistId: null})
  }



return (
  <div className="min-h-screen bg-zinc-900 text-white px-2 py-8 space-y-8">
    <div className="text-2xl font-semibold tracking-tight flex justify-between ">
     <div className='flex  gap-5 items-center'>
       <h1>Room ID: {roomId}</h1>
      <div>
        <Share className='cursor-pointer' onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          setMessages(prev => [...prev, "Share Link Copied to Clipboard"])
        }}/>
      </div>
     </div>
      <Button text={"Exit"} click={() => navigate('/')} />
    </div>
    
    <div className="space-y-2">
      <h2 className="text-sm uppercase tracking-widest text-zinc-400">Members : {users.length}</h2>
      <ul className="flex flex-wrap items-center gap-3">
        {users?.map((user) => (
          <li
            key={user}
            className="bg-zinc-800 flex gap-5 items-center text-zinc-300 border border-zinc-700 rounded-full px-4 py-1 text-xs"
          >
            {user[1]} {socket.id == user[0] &&  <div className='w-1 h-1 bg-amber-300 animate-pulse rounded-full'></div>}
          </li>
        ))}
      </ul>
    </div>

    {(!playlistId) && (
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
            className="flex items-center gap-4 p-1 pr-5 lg:w-70 w-full bg-zinc-800 border border-zinc-700 rounded-xl hover:border-zinc-600 transition"
          >
            <img
              src={playlist.coverimg}
              alt={playlist.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-base font-medium text-white">{playlist.title}</h3>
            </div>
            
          <Button text={"Select"} click={() =>  selectPlaylist(playlist._id)} />
            
          </div>
        ))}
      </div>
    </div>
  </div>
)}

{playlistId && (
  <div>
    <Button text={"Change Playlist"} click={changePlaylist} />
  </div>
)}

    <Songs songs={songs} selectedSong={selectedSong} isRoom={true}/>

    {songs && (
      <div className="mt-8">
        <MusicPlayer
          roomId={roomId}
          playlistId={playlistId}
          songs={songs}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          isRoom={true}
        />
      </div>
    )}

    <NotificationModal messages={messages} />
  </div>
)



} 

export default Room 
