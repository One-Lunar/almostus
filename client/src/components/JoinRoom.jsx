import React, { useEffect, useState } from 'react'
import { socket } from '../utils/socket'
import { useNavigate } from 'react-router-dom'

const JoinRoom = () => {
    const navigate = useNavigate()


    const handleSubmit = () => {
        const newRoomId = Math.floor(Math.random() * 9999) + 10
        socket.emit("join-room", newRoomId)
        navigate(`/rooms/${newRoomId}`)
    }


   

  return (
    <div className='flex text-white items-center justify-center flex-col h-screen w-screen gap-3'>
        
        <h1>Join Room</h1>
        <label>Enter the room Id</label>
        <button onClick={handleSubmit} className='bg-zinc-200 cursor-pointer text-sm text-black px-3 py-2 rounded-md'>Join</button>
    </div>
  )
}

export default JoinRoom