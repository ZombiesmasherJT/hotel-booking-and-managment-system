import React from "react";
import "../styles/Profile.css";


function Profile() {
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

    <div className="profile-avitar">
        <span>{user.name.charAt(0).toUpperCase()}</span>
    </div>

    return (
        <div className="profile-container">
            <h2>Your profile</h2>
            {user ? (
                <>

                    <div className="profile-avitar">
                        <span>{user.name.charAt(0).toUpperCase()}</span>
                    </div>



                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </>
            ) : (
                <p>Not logged in</p>
            )}
        </div>
    );
}




export default Profile;


