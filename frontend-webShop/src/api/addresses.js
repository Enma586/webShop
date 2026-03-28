import axios from './axios';

export const getAddressesRequest = () => axios.get('/addresses');
export const getAddressRequest = (id) => axios.get(`/addresses/${id}`);
export const createAddressRequest = (address) => axios.post('/addresses', address);
export const updateAddressRequest = (id, address) => axios.put(`/addresses/${id}`, address);
export const deleteAddressRequest = (id) => axios.delete(`/addresses/${id}`);

export const getDepartmentsRequest = () => axios.get('/locations/departments');
export const getMunicipalitiesRequest = (deptId) => axios.get(`/locations/departments/${deptId}/municipalities`);