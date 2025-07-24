import React, { useEffect } from 'react'
import MusicPlayer from './components/MusicPlayer'
import UploadMusic from './components/UploadMusic'
import Songs from './components/Songs'
import CreatePlaylist from './components/CreatePlaylist'
import Playlist from './components/Playlist'
import PlaylistInfo from './components/PlaylistInfo'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { socket } from './utils/socket'
import JoinRoom from './components/JoinRoom'
import Room from './components/Room'

const App = () => {

  return (
    <BrowserRouter>
            <Routes>
                <Route path='/songs/create' element={<UploadMusic />} />
                <Route path='/create' element={<CreatePlaylist/>}/>
                <Route path='/' element={<Playlist/>}/>
                <Route path='/playlist/:id' element={<PlaylistInfo/>}/>
                <Route path='/rooms/join' element={<JoinRoom />}/>
                <Route path='/rooms/:id' element={<Room />}/>
            </Routes>
    </BrowserRouter>

  )
}

export default App