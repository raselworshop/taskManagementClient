import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import Spinner from '../components/shared/Spinner';


const Main = () => {
    const { user, loading } = useAuth()
    // if(loading)return <div className='flex items-center justify-center'><Spinner/></div>
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