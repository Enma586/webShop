import axios from './axios'

export const getUsersRequest = () => axios.get('/admin/users')

export const getUserRequest = (id) => axios.get(`/admin/users/${id}`)

export const createUserRequest = (user) => axios.post('/admin/users', user)

export const updateUserRequest = (id, user) => axios.put(`/admin/users/${id}`, user)

export const deleteUserRequest = (id) => axios.delete(`/admin/users/${id}`)

export const getProfileRequest = () => axios.get('/customer/profile')

export const updateProfileRequest = (profile) => axios.put('/customer/profile', profile)