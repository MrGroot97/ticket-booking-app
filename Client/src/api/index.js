import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: '/api', //baseURL: 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

const handleExpiredToken = (navigate) => {
    localStorage.removeItem('token')
    navigate('/login')
}

export const setUpAxiosInterceptors = (navigate) => {
    axiosInstance.interceptors.response.use((response) => {
        const msg = response.data.message
        if (msg === 'Unauthorized' || msg === 'Expired token' || msg === 'Invalid/Expired token' || msg === 'Invalid token') {
            handleExpiredToken(navigate)
        }
        return response
    }, (error) => {
        if (error.response.status === 401) {
            handleExpiredToken(navigate)
        }
        return Promise.reject(error)
    })
}

export default axiosInstance
