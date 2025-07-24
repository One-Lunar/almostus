import { Info } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const NotificationModal = ({ messages }) => {
  const [isCoolDown, setIsCoolDown] = useState(false)

  useEffect(() => {
    if (!messages || messages.length === 0) return

    setIsCoolDown(true)

    const timeout = setTimeout(() => {
      setIsCoolDown(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [messages])

  const latestMessage = messages?.[messages.length - 1]

  return (
    <div className="fixed top-18 right-4 z-50">
      {isCoolDown && latestMessage && (
        <div className="flex items-center gap-3 bg-zinc-800 border border-zinc-600 text-white px-4 py-3 rounded-lg shadow-lg transition-opacity duration-300 animate-fade-in">
          <Info size={16} className="text-zinc-300" />
          <p className="text-sm text-zinc-100">{latestMessage}</p>
        </div>
      )}
    </div>
  )
}

export default NotificationModal
