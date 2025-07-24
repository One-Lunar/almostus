import axios from "axios";

const baseUrl = import.meta.env.VITE_ENV == "development" ? "http://localhost:8080" : "https://almostus.onrender.com"

export const axiosInstance = axios.create({
    baseURL: `${baseUrl}/api`
})