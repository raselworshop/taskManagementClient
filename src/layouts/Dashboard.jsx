import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import DashboardLayout from '../pages/DashboardLayout/DashboardLayout';
import useAuth from '../Hooks/useAuth';

const Dashboard = () => {
    // const { loading } = useAuth()
    // if(loading) return <div className="loading-spinner"></div>
    return (
        <div>
            <Navbar />
            <div className='mt-14 md:mt-16'>
            <DashboardLayout />
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;