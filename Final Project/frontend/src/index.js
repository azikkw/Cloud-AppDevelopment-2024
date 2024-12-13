import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Events from "./pages/events/Events";
import Profile from "./pages/Profile";
import MyEvents from "./pages/my-events/MyEvents";
import EventPage from "./pages/events/EventPage";
import MyEventPage from "./pages/my-events/MyEventPage";
import Registrations from "./pages/Registrations";
import Notifications from "./pages/Notifications";

const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/",
        element: <Home/>,
        children: [
            {
                path: "/",
                element: <Events/>,
            },
            {
                path: "events/:id",
                element: <EventPage/>,
            },
            {
                path: "my-events",
                element: <MyEvents/>,
            },
            {
                path: "my-events/:id",
                element: <MyEventPage/>,
            },
            {
                path: "profile",
                element: <Profile/>,
            },
            {
                path: "registrations",
                element: <Registrations/>
            },
            {
                path: "notifications",
                element: <Notifications/>
            }
        ]
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);