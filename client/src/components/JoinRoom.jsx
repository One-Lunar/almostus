import React, { useEffect, useState } from 'react'
import { socket } from '../utils/socket'
import { useNavigate } from 'react-router-dom'

const JoinRoom = () => {
    const navigate = useNavigate()
    const [roomId, setRoomId] = useState(0)

    const handleSubmit = () => {

        socket.emit("join-room", roomId)
        navigate(`/rooms/${roomId}`)
    }

  return (
    <div className='flex text-white items-center justify-center flex-col h-screen w-screen gap-3'>
        
        <h1 className='font-black my-10 text-6xl'>Join Room</h1>
       <div className='flex gap-5 items-center'>
         <input 
        className='border h-full border-zinc-600 rounded-md outline-none p-1 text-sm'
        onChange={(e) => setRoomId(e.target.value)}
        placeholder='Enter the room Id'
        type="text"
         />
        <button onClick={handleSubmit} className='bg-zinc-100 cursor-pointer text-sm text-black px-3 py-2 rounded-md'>Join</button>
       </div>
    </div>
  )
}

export default JoinRoom