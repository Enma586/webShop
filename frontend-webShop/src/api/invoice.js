import axios from './axios'

export const getMyInvoicesRequest = () => axios.get('/my-invoices')

export const getAllInvoicesRequest = () => axios.get('/admin/invoices')

export const getInvoiceRequest = (id) => axios.get(`/my-invoices/${id}`)