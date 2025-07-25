import React, { useRef, useState } from "react";
import axios from "axios";
import { useSongStore } from "../stores/useSongStore"; // make sure this exists

const UploadMusic = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [formInputs, setFormInputs] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const { postMusic } = useSongStore();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith("audio/")
    );
    setAudioFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file =>
      file.type.startsWith("audio/")
    );
    setAudioFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs(prev => ({
      ...prev,
      [audioFiles[selectedIndex]?.name]: {
        ...(prev[audioFiles[selectedIndex]?.name] || {}),
        [name]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setUploading(true);

    for (const file of audioFiles) {
      const metadata = formInputs[file.name] || {};

      try {
        // Upload audio to Cloudinary
        const audioData = new FormData();
        audioData.append("file", file);
        audioData.append("upload_preset", "almost");
        audioData.append("resource_type", "video");

        const audioRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dycx19qo7/video/upload",
          audioData
        );

        const songUrl = audioRes.data.secure_url;

        // Post music with form data
        await postMusic({
          title: metadata.title || "",
          author: metadata.author || "",
          coverimg: metadata.coverImg || "",
          playlist: metadata.playlist || "6880e41cae1307047b0c4245",
          songUrl,
        });

        console.log(`✅ Uploaded ${file.name}`);
      } catch (err) {
        console.error(`❌ Failed to upload ${file.name}:`, err);
        alert(`Upload failed for ${file.name}`);
      }
    }

    // Reset after upload
    setAudioFiles([]);
    setFormInputs({});
    setSelectedIndex(null);
    setUploading(false);
    alert("✅ All files uploaded");
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-zinc-900 border-r border-zinc-800 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Uploaded Audios</h2>
        {audioFiles.map((file, index) => (
          <div
            key={file.name + index}
            onClick={() => setSelectedIndex(index)}
            className={`cursor-pointer px-3 py-2 mb-2 rounded-md ${
              selectedIndex === index ? "bg-zinc-800" : "hover:bg-zinc-800/50"
            }`}
          >
            🎵 {file.name}
          </div>
        ))}
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col p-6">
        {/* Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-zinc-700 p-8 rounded-lg text-center cursor-pointer hover:border-zinc-500 mb-6"
        >
          <p className="text-zinc-400">Drag & drop audio files here or click to upload</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            hidden
            onChange={handleFileInput}
          />
        </div>

        {/* Details Form */}
        {selectedIndex !== null && audioFiles[selectedIndex] && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formInputs[audioFiles[selectedIndex].name]?.title || ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={formInputs[audioFiles[selectedIndex].name]?.author || ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Cover Image URL</label>
              <img src={formInputs[audioFiles[selectedIndex].name]?.coverImg || ""} className="w-30" alt="" />
              <input
                type="text"
                name="coverImg"
                value={formInputs[audioFiles[selectedIndex].name]?.coverImg || ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Playlist</label>
              <input
                type="text"
                name="playlist"
                value={formInputs[audioFiles[selectedIndex].name]?.playlist || ""}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 outline-none"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        {audioFiles.length > 0 && (
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className={`px-6 py-2 rounded ${
                uploading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-400 text-black"
              }`}
            >
              {uploading ? "Uploading..." : "Submit All"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadMusic;
