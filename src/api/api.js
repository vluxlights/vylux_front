import axios from "axios"


const API = axios.create({
    baseURL:"https://vlux-backend.onrender.com/api/vlux"
})

export default API