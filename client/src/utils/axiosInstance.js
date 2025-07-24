import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: `https://almostus.onrender.com/api`
})