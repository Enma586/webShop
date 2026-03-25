import axios from './axios'

export const registerRequest = user => axios.post('/auth/register', user)

export const loginRequest = user => axios.post('/auth/login', user)

export const logoutRequest = () => axios.post('/auth/logout')


export const verifyTokenRequest = () => axios.get('/auth/verify', {
    withCredentials: true 
});