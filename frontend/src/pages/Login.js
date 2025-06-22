import React, { useEffect, useState } from "react";
import "../styles/Login.css";   // Import the Login.css file
import axios from "axios";


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // If a token exists, redirect to the dashboard
            window.location.href = "/dashboard";
        }
    }
        , []); // Empty dependency array to run only once on component mount


    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);



    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true); // Set loading to true when the form is submitted
        setSuccessMessage(""); // Clear any previous success message
        setErrorMessage(""); // Clear any previous error message







        try {
            const response = await axios.post("http://localhost:3001/auth/login", {
                email,
                password
            });


            // IMplement the logic to store the token in the local storage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.name); // Store the username in local storage




            console.log("login successful: ", response.data);  // This will log the response data to the console
            // later will be sent to the backend



            //loading screen will be added here



            //redirect of dashboard after the login is completed successfully
            setTimeout(() => {
                window.location.href = "/dashboard";
            }
                , 2000); // Redirect after 2 seconds

        } catch (error) {
            console.log("login failed: ", error.response.data);  // This will log the error response data to the console
            setErrorMessage(error.response.data.message); // Set the error message from the response
            setLoading(false); // Set loading to false when the request fails
        }
    };

    return (
        <div className="login-container">
            < h2>Login</h2>


            {loading && <p style={{ color: "blue" }}>Logging in...</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            {/* Add a logo here if you have one */}





            <form onSubmit={handleSubmit}>
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

                    {loading ? "loggin in..." : "Login"}

                </button>
            </form>
        </div>
    );
}
export default Login;