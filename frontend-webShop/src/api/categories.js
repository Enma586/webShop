import axios from './axios'

export const getCategoriesRequest = () => axios.get('/categories')

export const createCategoryRequest = category => axios.post('/admin/categories', category)

export const updateCategoryRequest = (id, category) => axios.put(`/admin/categories/${id}`, category)

export const deleteCategoryRequest = id => axios.delete(`/admin/categories/${id}`)

export const getCategoryRequest = (id) => axios.get(`/categories/${id}`)