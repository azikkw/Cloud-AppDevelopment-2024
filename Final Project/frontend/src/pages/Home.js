import {Link, Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Home = () => {
    
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.getItem("uid") || navigate("/login")
    }, [navigate]);

    return (
        <div className="w-full min-h-screen bg-white pb-10">
            <header className="w-full bg-blue-600 text-white shadow-md px-20">
                <nav className="flex justify-center space-x-6 py-4">
                    <Link
                        to="/"
                        className="text-lg font-semibold hover:text-gray-300 transition duration-200"
                    >
                        Events
                    </Link>
                    <Link
                        to="/my-events"
                        className="text-lg font-semibold hover:text-gray-300 transition duration-200"
                    >
                        My Events
                    </Link>
                    <Link
                        to="/registrations"
                        className="text-lg font-semibold hover:text-gray-300 transition duration-200"
                    >
                        Registrations
                    </Link>
                    <Link
                        to="/notifications"
                        className="text-lg font-semibold hover:text-gray-300 transition duration-200"
                    >
                        Notifications
                    </Link>
                    <Link
                        to="/profile"
                        className="text-lg font-semibold hover:text-gray-300 transition duration-200"
                    >
                        Profile
                    </Link>
                </nav>
            </header>
            <main className="w-full px-20 mt-14">
                <Outlet/>
            </main>
        </div>
    );
}

export default Home;
