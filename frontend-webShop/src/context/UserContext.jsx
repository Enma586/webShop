import { createContext, useContext, useState } from 'react'
import {
    getProfileRequest,
    updateProfileRequest,
    getUsersRequest,
    getUserRequest,
    createUserRequest,
    updateUserRequest,
    deleteUserRequest
} from '../api/user'
import { useNotify } from './NotificationContext'

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context;
}

export function UserProvider({ children }) {
    const [users, setUsers] = useState([]);
    const [profile, setProfile] = useState(null);
    const { notify } = useNotify();

    const getProfile = async () => {
        try {
            const res = await getProfileRequest();
            setProfile(res.data);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

const updateProfile = async (formData) => {
    try {
        const res = await updateProfileRequest(formData);
        const updatedData = res.data.data;
        setProfile(updatedData);

        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            localStorage.setItem('user', JSON.stringify({ ...storedUser, ...updatedData }));
        }

        notify('PROFILE UPDATING', 'success');
        return true;
    } catch (error) {
        console.error("UPDATE_PROFILE_ERROR", error);
        const errorMsg = error.response?.data?.message || "ERROR UPDATING PROFILE";
        notify(errorMsg.toUpperCase(), "error");
        return false;
    }
};

    const getUsers = async () => {
        try {
            const res = await getUsersRequest();
            const data = res.data.data || res.data;
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            setUsers([]);
        }
    }

    const getUser = async (id) => {
        try {
            const res = await getUserRequest(id);
            return res.data;
        } catch (error) {
            throw error;
        }
    }

    const createUser = async (userData) => {
        try {
            await createUserRequest(userData);
            await getUsers();
            notify('USER CREATED', 'success');
            return true;
        } catch (error) {
            const errorMsg = error.response?.data?.message || "ERROR CREATING USER";
            notify(errorMsg.toUpperCase(), "error");
            return false;
        }
    }

    const updateUser = async (id, userData) => {
        try {
            await updateUserRequest(id, userData);
            await getUsers();
            notify('USER UPDATED', 'success');
            return true;
        } catch (error) {
            const errorMsg = error.response?.data?.message || "ERROR UPDATING USER";
            notify(errorMsg.toUpperCase(), "error");
            return false;
        }
    }

    const deleteUser = async (id) => {
        try {
            const res = await deleteUserRequest(id);
            if (res.status === 200 || res.status === 204) {
                setUsers(prev => prev.filter(u => u.id !== id));
            }
            notify('USER DELETED', 'success');
            return true;
        } catch (error) {
            const errorMsg = error.response?.data?.message || "ERROR DELETING USER";
            notify(errorMsg.toUpperCase(), "error");
            return false;
        }
    }

    return (
        <UserContext.Provider value={{
            users,
            profile,
            setProfile,
            getProfile,
            updateProfile,
            getUsers,
            getUser,
            createUser,
            updateUser,
            deleteUser
        }}>
            {children}
        </UserContext.Provider>
    )
}