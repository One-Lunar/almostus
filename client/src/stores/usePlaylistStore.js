import {create} from 'zustand'
import { axiosInstance } from '../utils/axiosInstance'

export const usePlaylistStore = create((set) => ({
    playlists: null,
    songs: null,
    getAllPlaylists: async () => {
        try {
            const res = await axiosInstance.get('/playlists/all')
            set({playlists: res.data})
        } catch (error) {
            console.log(error.message)
        }
    },
    getSongsByPlaylist: async (playlistId) => {
        try {
            const res = await axiosInstance.get(`/songs/playlist/${playlistId}`)
            set({songs: res.data.songs})
        } catch (error) {
            console.log(error.message)
        }
    }

}))
