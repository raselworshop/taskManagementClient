import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Home from "../pages/Home/Home";
import SignUp from "../pages/AuthRelated/SignUp";
import Signin from "../pages/AuthRelated/Signin";
import Dashboard from "../layouts/Dashboard";
import TaskForm from "../pages/DashboardLayout/DBELEMENT/TaskForm/TaskForm";
import TaskList from "../pages/DashboardLayout/DBELEMENT/TaskList/TaskList";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Main/>,
        children:[
            {
                path: '',
                element: <Signin />
            },
            {
                path: '/joinus',
                element: <SignUp />
            },
        ]  
    },
    {
        path:'dashboard',
        element: <Dashboard/>,
        children:[
            {
                path: '',
                element: <Home/>
            },
            {
                path: "taskaddform",
                element:<TaskForm/>
            },
            {
                path: 'tasklist',
                element: <TaskList/>
            }
        ]
    },

])

export default router;