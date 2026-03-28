import axios from './axios'

export const getMyOrdersRequest = () => axios.get('/my-orders')

export const getMyOrderRequest = (id) => axios.get(`/my-orders/${id}`)

export const processCheckoutRequest = (payload) => axios.post('/checkout', payload)

export const getAllOrdersRequest = () => axios.get('/admin/orders')

export const updateOrderStatusRequest = (id, status) => 
    axios.patch(`/admin/orders/${id}/status`, { status })

export const getAdminOrderRequest = (id) => axios.get(`/admin/orders/${id}`)

export const getInvoicePdfRequest = (orderId) => 
    axios.get(`/my-invoices/${orderId}/print`, { responseType: 'blob' })

export const cancelOrderRequest = (id) => axios.patch(`/my-orders/${id}/cancel`);