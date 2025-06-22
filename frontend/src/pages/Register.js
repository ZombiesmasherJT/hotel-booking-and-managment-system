import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/Register.css";


function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // If a token exists, redirect to the dashboard
            window.location.href = "/dashboard";
        }
    }
        , []); // Empty dependency array to run only once on component mount







    const handleSubmit = async (e) => {
        e.preventDefault();


        // Validate input fields
        if (!username || !email || !password) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        // check if email is valid

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // check if password is more than 6 characters

        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true); // Set loading to true when the form is submitted
        setSuccessMessage(""); // Clear any previous success message
        setErrorMessage(""); // Clear any previous error message


        try {
            const response = await axios.post("http://localhost:3001/auth/register", {
                username,
                email,
                password,
                role: "guest" // Default role for new users
            });







            console.log("Registration successful: ", response.data);
            // Redirect to login page after successful registration
            setSuccessMessage("Registration successful! Redirecting to login...");
            // You can also implement a loading screen here if needed
            // For example, you can set a state variable to show a loading spinner
            setLoading(false); // Set loading to false after the response is received

            //loading screen will be added here

            setTimeout(() => {

                window.location.href = "/login";
            }
                , 2000); // Redirect after 2 seconds


        } catch (error) {
            console.log("Registration failed: ", error.response.data);
            setErrorMessage(error.response?.data?.msg || "Registration failed. Please try again.");
            setLoading(false); // Set loading to false if there's an error
        }
    };


    return (
        <div className="register-container">
            <h2>Register</h2>

            {loading && <p style={{ color: "blue" }}>Registering...</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}




            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "submitting..." : "Register"}
                </button>
            </form>
        </div>
    );
}

export default Register;


