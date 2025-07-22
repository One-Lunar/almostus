import React, { useState, useRef } from 'react'
import axios from 'axios'

const PlaylistForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: ''
  })
  const [coverImg, setCoverImg] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImg(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleBoxClick = () => {
    fileInputRef.current.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('author', formData.author)
    data.append('coverimg', coverImg)

    try {
      const response = await axios.post('http://localhost:8080', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage(response.data.message)
      setFormData({ title: '', description: '', author: '' })
      setCoverImg(null)
      setPreviewUrl(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating playlist')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md rounded-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-4">Create Playlist</h2>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Playlist Title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Image Upload Box */}
        <div
          className="w-full h-48 border-2 border-dashed rounded flex items-center justify-center cursor-pointer relative bg-gray-50"
          onClick={handleBoxClick}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="object-cover w-full h-full rounded" />
          ) : (
            <span className="text-gray-400">Click to upload cover image</span>
          )}
          <input
            type="file"
            name="coverimg"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

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

export default PlaylistForm
