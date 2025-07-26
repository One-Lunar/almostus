import React, { useEffect, useState } from 'react'
import { socket } from '../utils/socket'
import { useNavigate } from 'react-router-dom'
import Button from '../chunks/Button'

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
        className='border h-full border-zinc-600 rounded-md outline-none p-2 text-sm'
        onChange={(e) => setRoomId(e.target.value)}
        placeholder='Enter the room Id'
        type="text"
         />
        <Button text={"Join"} click={handleSubmit} />
       </div>
    </div>
  )
}

export default JoinRoom