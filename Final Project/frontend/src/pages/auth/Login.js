import React, {useEffect, useState} from "react";
import { auth, signInWithEmailAndPassword } from "../../firebase";
import {Link, useNavigate} from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.getItem("uid") && navigate("/")
    }, [navigate]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            const uid = userCredential.user.uid;
            localStorage.setItem("token", token);
            localStorage.setItem("uid", uid);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>
                <form onSubmit={handleSubmit}>
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

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Log In"}
                    </button>
                    <Link to={"/register"} className="group w-full flex justify-center gap-1.5 mt-3 text-gray-500">Already have an account? <p className="text-blue-500 font-semibold group-hover:underline">Register</p></Link>
                </form>
            </div>
        </div>
    );
};
export default Login;