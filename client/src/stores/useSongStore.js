import {create} from 'zustand'
import { axiosInstance } from '../utils/axiosInstance'

export const useSongStore = create((set) => ({
    songs: null,
    postMusic: async (data) => {
        try {
            const res = await axiosInstance.post('/songs/post', data)
            console.log(res)
        } catch (error) {
            console.log(error.message)
        }
    },
    getAllSongs: async () => {
        try {
            const res = await axiosInstance.get('/songs/all')
            set({songs: res.data})
        } catch (error) {
            console.log(error.message)
        }
    }
}))
