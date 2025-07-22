import React, { useState } from 'react';

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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="font-sans text-zinc-900 dark:text-zinc-100 max-w-5xl mx-auto mt-10 p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Upload Music</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'title', label: 'Title' },
          { name: 'author', label: 'Author' },
          { name: 'artist', label: 'Artist' },
          { name: 'songUrl', label: 'Song URL' },
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
              required
            />
          </div>
        ))}

        {/* Genre Dropdown */}
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

        {/* Lyrics (Full width) */}
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

        {/* Submit Button (Full width) */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-zinc-800 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-lg shadow outline-none"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadMusic;
