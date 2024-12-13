import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.getItem("uid") && navigate("/")
    }, [navigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !username || !firstName || !lastName) {
            setError('All fields are required');
            return;
        }

        const userData = {
            email,
            password,
            username,
            first_name: firstName,
            last_name: lastName,
        };

        try {
            const response = await fetch('https://cloud-app-dev-amen.uc.r.appspot.com/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(result.message);
                setError('');
            } else {
                setError(result.error || 'Registration failed');
                setSuccess('');
            }
        } catch (err) {
            setError('Server error');
            setSuccess('');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                {error && <div className="text-center text-red-500 text-sm mb-4">{error}</div>}
                {success && <div className="text-center text-green-500 text-sm mb-4">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-gray-700 mb-2">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter your first name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-gray-700 mb-2">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter your last name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
                    >
                        Register
                    </button>
                    <Link to={"/login"} className="group w-full flex justify-center gap-1.5 mt-3 text-gray-500">Already have an account? <p className="text-blue-500 font-semibold group-hover:underline">Log In</p></Link>
                </form>
            </div>
        </div>
    );
};

export default Register;