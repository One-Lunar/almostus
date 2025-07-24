import { Info } from 'lucide-react'
import React from 'react'

const NotificationModal = ({messages}) => {
  console.log(messages)
  return (
    <div className='flex absolute top-0 w-screen justify-end'>
      <div className='mt-10 backdrop-blur-xs p-2 flex flex-col gap-3'>

            <div className=' text-white border flex gap-3 items-center border-zinc-600 p-2 rounded-md'>
            <div>
              <Info size={15}/>
            </div>
            <div>
              <h1 className='text-sm'>{messages && messages[messages.length - 1]}</h1>
            </div>
          </div>

         
      </div>
    </div>
  )
}

export default NotificationModal