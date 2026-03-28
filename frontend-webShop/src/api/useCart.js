import axios from './axios'

export const createOrderRequest = (orderData) => axios.post('/checkout', orderData);

export const getUserOrdersRequest = () => axios.get('/orders/user')

export const getOrderDetailsRequest = (id) => axios.get(`/orders/${id}`)

export const cancelOrderRequest = (id) => axios.post(`/orders/${id}/cancel`)

export const verifyStockRequest = (items) => axios.post('/products/verify-stock', { items })