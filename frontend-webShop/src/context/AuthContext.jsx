import { useState, createContext, useContext, useEffect } from 'react'
import { loginRequest, logoutRequest, registerRequest, verifyTokenRequest } from '../api/auth'
import Cookies from 'js-cookie'
import { useNotify } from './NotificationContext';

export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(true)
    const { notify } = useNotify();

    useEffect(() => {
        const checklogin = async () => {
            const hasSession = localStorage.getItem('has_session');
            if (!hasSession) {
                setLoading(false);
                setIsAuthenticated(false);
                return;
            }
            try {
                const res = await verifyTokenRequest();
                if (res.data && res.data.status === 'success') {
                    setIsAuthenticated(true);
                    setUser(res.data.data.user);
                } else {
                    localStorage.removeItem('has_session');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                localStorage.removeItem('has_session');
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checklogin();
    }, []);

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([])
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [errors])

    const signup = async (userData) => {
    try {
        setLoading(true);
        setErrors([]);
        
        await registerRequest(userData);
        
        notify("IDENTITY REGISTERED SUCCESSFULLY", "success");
        
        setLoading(false);
        return true;
    } catch (error) {
        setLoading(false);
        const data = error.response?.data;
        let errorMsg = "CONNECTION ERROR";
        
        if (data?.errors) {
            const firstKey = Object.keys(data.errors)[0];
            errorMsg = data.errors[firstKey][0];
        } else if (data?.message) {
            errorMsg = data.message;
        }
        
        notify(errorMsg.toUpperCase(), "error");
        setErrors(data?.errors ? Object.values(data.errors).flat() : [errorMsg]);
        return false;
    }
};

    const signin = async (data) => {
        try {
            setLoading(true);
            setErrors([]);
            const res = await loginRequest(data);
            localStorage.setItem('has_session', 'true');
            notify("ACCESS GRANTED", "success");
            setUser(res.data.user);
            setIsAuthenticated(true);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            localStorage.removeItem('has_session');
            let errorMsg = "CONNECTION ERROR";
            if (error.response) {
                const data = error.response.data;
                if (data?.errors) {
                    const firstKey = Object.keys(data.errors)[0];
                    errorMsg = data.errors[firstKey][0];
                } else if (data?.error) {
                    errorMsg = data.error === 'Unauthorized' ? 'USER OR PASSWORD INCORRECT' : data.error;
                } else if (data?.message) {
                    errorMsg = data.message;
                }
            }
            const finalMsg = errorMsg.toUpperCase();
            setErrors([finalMsg]);
            notify(finalMsg, "error");
            setIsAuthenticated(false);
        }
    };

    const logout = async () => {
        try {
            await logoutRequest();
        } finally {
            localStorage.removeItem('has_session');
            Cookies.remove('jwt_token', { path: '/' });
            setUser(null);
            setIsAuthenticated(false);
            window.location.replace("/login");
        }
    };

    return (
        <AuthContext.Provider value={{
            signup,
            user,
            isAuthenticated,
            errors,
            signin,
            loading,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}