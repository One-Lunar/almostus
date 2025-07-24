import { io } from 'socket.io-client'

const baseUrl = import.meta.env.VITE_ENV == "development" ? "http://localhost:8080" : "https://almostus.onrender.com"

export const socket = io(baseUrl)

