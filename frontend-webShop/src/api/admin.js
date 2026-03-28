import axios from './axios'

export const getProductLogsRequest = () => axios.get('/admin/logs/products');
export const getInventoryLogsRequest = () => axios.get('/admin/logs/inventory');
export const getDashboardStatsRequest = () => axios.get('/admin/dashboard-stats');