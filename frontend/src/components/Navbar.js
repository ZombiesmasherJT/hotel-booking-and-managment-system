import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";


function Navbar() {

    const navigate = useNavigate();


    const getUserFromToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const payload = token.split(".")[1];
            return JSON.parse(atob(payload));
        } catch (error) {
            return null;

        }
    };

    const user = getUserFromToken();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };


    return (
        <nav>
            <ul>
                {user && (
                    <li style={{ fontWeight: "bold" }}>Welcome, {user.name}

                    </li>

                )}

                <li><NavLink to="/"

                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}


                >

                    Home
                </NavLink>
                </li>
                <li><NavLink to="/login"

                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}



                >


                    Login</NavLink></li>


                <li><NavLink to="/register"


                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}

                >


                    Register</NavLink></li>


                <li>
                    <NavLink to="/dashboard"

                        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}


                    >
                        Dashboard
                    </NavLink>
                </li>



                <li><NavLink to="/profile"

                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                    Profile
                </NavLink>
                </li>
                <li><NavLink to="/bookings"


                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}

                >

                    Bookings
                </NavLink>
                </li>


                {user && user.role === "admin" && (
                    <li><NavLink to="/adminpanel"


                        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}

                    >
                        Admin Panel
                    </NavLink>
                    </li>
                )}
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
}

export default Navbar;
