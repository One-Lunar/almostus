import { Smile } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import { socket } from '../utils/socket'

const Emoji = ({roomId, username}) => {
    const [bubbles, setBubbles] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    const emojiList = ['😂','🔥','♥️','🤮']

    const handleEmojiClick = (emoji) => {
     
        socket.emit('emoji', {emoji,username: username[1], roomId})
    }

    useEffect(() => {
  const handleEmoji = (data) => {
    console.log('BUBBLES:', bubbles)
      console.log('EMOJI RECEIVED:', data)
      
    setBubbles((prev) => [
      ...prev,
      {
        emoji: data.emoji,
        username: data.username,
        id: Date.now(),
        x: Math.floor(Math.random() * 50 - 25), // add some left/right variation
      },
    ])
  }

  socket.on('emoji', handleEmoji)

  return () => {
    socket.off('emoji', handleEmoji)
  }
}, []) // ✅ FIXED

 
  return (
    <div>
        <div className="fixed right-12 bottom-10">
  <AnimatePresence>
    {bubbles.map((bubble) => (
      <motion.div
        key={bubble.id}
        initial={{ opacity: 1, y: 0, x: -400, scale: 1 }}
        animate={{
          opacity: 0,
          y: -250,
          x: bubble.x-400,
          scale: 1.3,
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
        onAnimationComplete={() =>
          setBubbles((prev) => prev.filter((b) => b.id !== bubble.id))
        }
      >
        <span className="text-4xl">{bubble.emoji}</span>
        <span className="text-xs bg-zinc-800 rounded-xl p-1 border border-zinc-600 mt-1">
          {bubble.username}
        </span>
      </motion.div>
    ))}
  </AnimatePresence>
</div>

         <div className="fixed flex gap-4 items-center bottom-25 right-5 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-full">
        {isOpen && (
          <ul className="flex text-2xl gap-3 items-center">
            {emojiList.map((emoji, i) => (
              <li
                key={i}
                onClick={() => handleEmojiClick(emoji)}
                className="cursor-pointer hover:scale-125 transition"
              >
                {emoji}
              </li>
            ))}
          </ul>
        )}
        <div>
          <Smile size={30} onClick={() => setIsOpen((prev) => !prev)} />
        </div>
      </div>
    </div>
  )
}

export default Emoji