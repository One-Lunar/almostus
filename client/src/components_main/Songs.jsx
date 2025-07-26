import React from 'react'

const Songs = ({songs, selectedSong, isRoom}) => {
  return (
    <div className="flex lg:flex-row justify-center items-center flex-wrap flex-col lg:gap-2 gap-1 mb-20 ">
      {songs?.map((song, idx) => (
        <div
          key={song._id}
          onClick={() => selectedSong(idx)}
          className={`flex items-center gap-4 select-none lg:w-100 ${!isRoom && 'lg:w-full'} w-full max-w-2xl cursor-pointer p-1 bg-zinc-800 border border-zinc-700 rounded-xl hover:border-zinc-600 transition`}
        >
          <img
            src={song.coverimg}
            alt={song.title}
            className="lg:w-15 lg:h-15 w-13 h-13 object-cover rounded-md"
          />
          <div>
            <h4 className="lg:text-md text-sm font-medium text-white">{song.title}</h4>
            <p className="text-xs text-zinc-400">{song.author}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Songs