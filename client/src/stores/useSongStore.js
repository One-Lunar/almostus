import {create} from 'zustand'
import { axiosInstance } from '../utils/axiosInstance'

export const useSongStore = create((set) => ({
    songs: [],
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
    },
    deleteMusic: async (id) => {
        try {
            await axiosInstance.delete(`/songs/${id}`)
            set((state) => ({
                songs: state.songs.filter((song) => song._id !== id)
            }))
        } catch (error) {
            console.log(error.message)
        }
    },
    getSingleSong: async (id) => {
        try {
            const res = await axiosInstance.get(`/songs/${id}`)
            return res.data
        } catch (error) {
            console.log(error.message)
        }
    },
    updateMusic: async (id, data) => {
        try {
            const res = await axiosInstance.put(`/songs/${id}`, data)
            return res.data
        } catch (error) {
            console.log(error.message)
        }
    },
}))
