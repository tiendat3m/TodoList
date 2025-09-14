import axios from "axios";

const BASE_URL = import.meta.env.node === "production" ? 'http://localhost:5001/api' : '/api'

const api = axios.create({
    baseURL: BASE_URL
})

export default api