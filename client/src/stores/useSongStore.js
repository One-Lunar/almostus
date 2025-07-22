import {create} from 'zustand'
import { axiosInstance } from '../utils/axiosInstance'

export const useSongStore = create((set) => ({
    postMusic: async (data) => {
        try {
            const res = await axiosInstance.post('/songs/post', data)
            console.log(res)
        } catch (error) {
            console.log(error.message)
        }
    }
}))