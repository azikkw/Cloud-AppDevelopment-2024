import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const uid = localStorage.getItem('uid');
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`https://cloud-app-dev-amen.uc.r.appspot.com/profile/${uid}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                })
                const data = await response.json()
                setUser(data)
            } catch(err) {
                setError('Ошибка при загрузке данных');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('uid');
        localStorage.removeItem("token")
        navigate('/login');
    };

    if (loading) return <div className="flex justify-center">Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="w-full">
            <div className="bg-white p-8 rounded-lg border border-gray-200">
                <h2 className="text-3xl font-bold mb-5">Profile</h2>
                {user ? (
                    <>
                        <p className="mb-2"><strong>Username:</strong> {user.username}</p>
                        <p className="mb-2"><strong>First Name:</strong> {user.first_name}</p>
                        <p className="mb-2"><strong>Last Name:</strong> {user.last_name}</p>
                        <p className="mb-5"><strong>Email:</strong> {user.email}</p>
                    </>
                ) : (
                    <p>Пользователь не найден</p>
                )}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-8 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                    Log out
                </button>
            </div>
        </div>
    );
};

export default Profile;
