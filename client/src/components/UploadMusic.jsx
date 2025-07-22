import React, { useState } from 'react' 
import { useSongStore } from '../stores/useSongStore' 
import axios from 'axios' 
import { Plus } from 'lucide-react'
import { useRef } from 'react'

const UploadMusic = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    songUrl: '',
    artist: '',
    playlist: '',
    genre: '',
    date: '',
    duration: '',
    lyrics: '',
    coverimg: '',
  }) 

  const [uploadingAudio, setUploadingAudio] = useState(false) 
  const { postMusic } = useSongStore() 
  const audioRef = useRef()

  const handleChange = (e) => {
    const { name, value } = e.target 
    setFormData(prev => ({
      ...prev,
      [name]: value,
    })) 
  } 

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0] 
    if (!file) return 

    setUploadingAudio(true) 

    const data = new FormData() 
    data.append('file', file) 
    data.append('upload_preset', 'almost')  
    data.append('resource_type', 'video')  

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dycx19qo7/video/upload', 
        data
      ) 
      setFormData(prev => ({
        ...prev,
        songUrl: res.data.secure_url,
      })) 
    } catch (err) {
      console.error('Audio upload failed:', err) 
      alert('Failed to upload audio.') 
    } finally {
      setUploadingAudio(false) 
    }
  } 

  const handleSubmit = async (e) => {
    e.preventDefault() 
    await postMusic(formData) 
    setFormData({
    title: '',
    author: '',
    songUrl: '',
    artist: '',
    playlist: '',
    genre: '',
    date: '',
    duration: '',
    lyrics: '',
    coverimg: '',
  })
  } 

  return (
    <div className="font-sans text-zinc-900 dark:text-zinc-100 max-w-5xl mx-auto mt-10 p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Upload Music</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'title', label: 'Title' },
          { name: 'author', label: 'Author' },
          { name: 'artist', label: 'Artist' },
          { name: 'coverimg', label: 'Cover Image URL' },
          { name: 'playlist', label: 'Playlist Name' },
          { name: 'duration', label: 'Duration (e.g., 365 in seconds)' },
          { name: 'date', label: 'Release Date', type: 'date' },
        ].map(({ name, label, type = 'text' }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              {label}
            </label>
            <input
              type={type}
              name={name}
              id={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm outline-none"
            />
          </div>
        ))}


        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Upload Audio File
          </label>
          <button className='cursor-pointer  border border-zinc-500 rounded-sm' onClick={() => audioRef.current.click()}>
            <Plus />
          </button>
          <input
            ref={audioRef} 
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="w-full hidden"
          />
          {uploadingAudio && <p className="text-sm mt-1 text-blue-500">Uploading audio...</p>}
          {formData.songUrl && (
            <audio controls src={formData.songUrl} className="mt-2 w-full" />
          )}
        </div>


        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Genre
          </label>
          <select
            name="genre"
            id="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm outline-none"
            required
          >
            <option value="">Select Genre</option>
            <option value="hiphop">Hip Hop</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="electronic">Electronic</option>
          </select>
        </div>


        <div className="md:col-span-2">
          <label htmlFor="lyrics" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Lyrics
          </label>
          <textarea
            name="lyrics"
            id="lyrics"
            rows="4"
            value={formData.lyrics}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm outline-none"
          />
        </div>


        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-zinc-800 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-lg shadow outline-none"
            disabled={uploadingAudio}
          >
            {uploadingAudio ? 'Uploading Audio...' : 'Upload'}
          </button>
        </div>
      </form>
    </div>
  ) 
} 

export default UploadMusic 
