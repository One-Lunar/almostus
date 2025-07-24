import { io } from 'socket.io-client'


export const socket = io(`${import.meta.env.VITE_ENV == "development" ? "http://localhost:8080" : "https://almostus.onrender.com"}`)

