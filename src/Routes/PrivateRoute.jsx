import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';
import Spinner from '../components/shared/Spinner';

const PrivateRoute = ({ children }) => {
    const { user, loading, setLoading } = useAuth();
    const location = useLocation();
    useEffect(() => {
        if (!loading) {
            setLoading(false)
        }
    }, [loading, setLoading])
    if (loading) return <Spinner></Spinner>
    if (user) {
        return children;
    }
    return <Navigate to={'/'} state={location?.pathname}></Navigate>
};

export default PrivateRoute;