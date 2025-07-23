import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { socket } from '../utils/socket';
import { usePlaylistStore } from '../stores/usePlaylistStore';
import MusicPlayer from './MusicPlayer';

const Room = () => {
  const { id: roomId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const playlistId = searchParams.get('playlist');
  const currentIdxParam = searchParams.get('currentIdx');

  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(Number(currentIdxParam) || 0);

  const { songs, playlists, getAllPlaylists, getSongsByPlaylist } = usePlaylistStore();

  // Join the room
  useEffect(() => {
    if (!roomId) return;

    socket.emit('join-room', roomId);

    const msgHandler = (msg) => console.log(msg);
    const roomInfoHandler = (info) => setUsers(info);
    const playlistAddHandler = (playlistId) => {
      setSearchParams(prev => {
        const updated = new URLSearchParams(prev);
        updated.set('playlist', playlistId);
        updated.delete('currentIdx');
        return updated;
      });
    };
    const currentIdxHandler = (idx) => {
      setCurrentIndex(idx);
      setSearchParams(prev => {
        const updated = new URLSearchParams(prev);
        updated.set('currentIdx', idx);
        return updated;
      });
    };

    socket.on('msg', msgHandler);
    socket.on('room-info', roomInfoHandler);
    socket.on('playlist-add', playlistAddHandler);
    socket.on('current-idx', currentIdxHandler);

    return () => {
      socket.off('msg', msgHandler);
      socket.off('room-info', roomInfoHandler);
      socket.off('playlist-add', playlistAddHandler);
      socket.off('current-idx', currentIdxHandler);
    };
  }, [roomId, setSearchParams]);

  // Fetch playlists once
  useEffect(() => {
    getAllPlaylists();
  }, []);

  // Fetch songs when playlist changes
  useEffect(() => {
    if (playlistId) {
      getSongsByPlaylist(playlistId);
    }
  }, [playlistId]);

  const selectPlaylist = (playlistId) => {
    socket.emit('playlist', { playlistId, roomId });
  };

  const selectedSong = async (idx) => {
    setCurrentIndex(idx);
     socket.emit('set-current-idx', { playlistId, roomId, currentIdx: idx });
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev);
      updated.set('currentIdx', idx);
      return updated;
    });
  };

  const changePlaylist = () => {
    socket.emit('set-current-idx', { playlistId, roomId, currentIdx: 0 });
     roomId && socket.emit("playing", {roomId, playing: false})
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev);
      updated.delete('playlist');
      updated.delete('currentIdx');
      return updated;
    });
  };

  return (
    <div className="text-white">
      <div>Room: {roomId}</div>

      <div>
        <h1>Members</h1>
        <ul className="flex items-center gap-3 w-screen m-10">
          {users && users?.map((user) => (
            <li key={user} className="bg-zinc-800 border border-zinc-700 rounded-md p-2">
              {user}
            </li>
          ))}
        </ul>
      </div>

     {!playlistId &&  <div className="flex w-screen items-center gap-4 justify-center">
        {playlists &&  playlists?.map((playlist) => (
          <div key={playlist._id} className="flex rounded-md items-center justify-between px-2 gap-3 bg-zinc-800 border border-zinc-700 w-60">
            <img src={playlist.coverimg} className="w-15 h-15 rounded-md p-1" alt={playlist.title} />
            <h1>{playlist.title}</h1>
            <button
              onClick={() => selectPlaylist(playlist._id)}
              className="text-xs rounded-sm bg-white text-black p-1"
            >
              Select
            </button>
          </div>
        ))}
      </div>}

      <div>
        <button
          onClick={changePlaylist}
          className="text-xs rounded-sm bg-white text-black p-1 m-4"
        >
          Change Playlist
        </button>
      </div>

      <div>
        {songs && songs?.map((song, idx) => (
          <div
            key={song._id}
            onClick={() => selectedSong(idx)}
            className="flex cursor-pointer rounded-md items-center justify-between px-2 gap-3 bg-zinc-800 border border-zinc-700 w-60"
          >
            <img src={song.coverimg} className="w-15 h-15 rounded-md p-1" alt={song.title} />
            <h1>{song.title}</h1>
          </div>
        ))}
      </div>

      {songs && (
        <MusicPlayer
          roomId={roomId}
          playlistId={playlistId}
          songs={songs}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}
    </div>
  );
};

export default Room;
