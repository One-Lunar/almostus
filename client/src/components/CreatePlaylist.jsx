import React, { useState } from 'react'
import axios from 'axios'

const CreatePlaylist = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    coverimg: ''
  })
const baseUrl = import.meta.env.VITE_ENV == "development" ? "http://localhost:8080" : "https://almostus.onrender.com"
  
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      const response = await axios.post(`${baseUrl}/api/playlists/post`, formData)
      setMessage(response.data.message)
      setFormData({ title: '', description: '', author: '', coverimg: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create playlist')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg bg-white rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Playlist</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Playlist Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="coverimg"
          placeholder="Cover Image URL"
          value={formData.coverimg}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default CreatePlaylist
