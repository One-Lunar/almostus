import React from 'react'
import MusicPlayer from './components/MusicPlayer'
import UploadMusic from './components/UploadMusic'
import Songs from './components/Songs'
import CreatePlaylist from './components/CreatePlaylist'
import Playlist from './components/Playlist'
import PlaylistInfo from './components/PlaylistInfo'
import {BrowserRouter,Routes,Route} from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
            <Routes>
                <Route path='/create' element={<CreatePlaylist/>}/>
                <Route path='/' element={<Playlist/>}/>
                <Route path='/playlist/:id' element={<PlaylistInfo/>}/>
            </Routes>
    </BrowserRouter>

  )
}

export default App