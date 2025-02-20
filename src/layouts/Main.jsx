import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';


const Main = () => {
    const { user } = useAuth()
    if(user){
        return <Navigate to={'/dashboard'} replace />
    }
    return (
        <div>
            <Outlet/>
        </div>
    );
};

export default Main;