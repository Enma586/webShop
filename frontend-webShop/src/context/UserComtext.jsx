import {
    getProfileRequest,
    updateProfileRequest,
    getUsersRequest,
    getUserRequest,
    createUserRequest,
    updateUserRequest,
    deleteUserRequest
} from '../api/user'

import { useNotify } from '../lib/notifications'

import { useState, createContext, useContext } from 'react'

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context;
}

export function UserProvider({children}){

    const [users, setUsers] = useState([]);
    const notify = useNotify();

    const getUsers = async () =>{
        try {
            const res = await getUsersRequest();
            setUsers(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getUser = async (id) =>{
        try {
            const res = await getUserRequest();
            return res.data;
        } catch (error) {
            throw error
            console.log(error)
        }
    }

    const createUser


    return (
        <UserContext.Provider value={{

        }}>
            {children}
        </UserContext.Provider>
    )
}