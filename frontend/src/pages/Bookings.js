import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Bookings.css";


//for adding date types for creating a bookings

//also reasearch state hooks for persoanl project


function Bookings() {
    const [rooms, setRooms] = useState([]);
    const [checkInDate, setCheckInDate] = useState({});
    const [checkOutDate, setCheckOutDate] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [bookings, setBookings] = useState([]);


    useEffect(() => {

        axios.get("http://localhost:3001/rooms")
            .then((response) => {
                setRooms(response.data);
            })
            .catch((error) => {
                console.log("error: ", error);
            });
    }
        , []);


    useEffect(() => {
        axios.get("http://localhost:3001/bookings")
            .then((response) => {
                setBookings(response.data);
            })
            .catch((error) => {
                console.log("error: ", error);
            });
    }, []);


    //code to ensure that a user is logged in to be able to do a post booking request



    const handleBook = async (roomId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("please ensure you are logged in to book a room");
            return;

        }

        try {
            const response = await axios.post(
                "http://localhost:3001/bookings",
                {
                    //quick test data to confirm that the booking works
                    roomId,
                    checkInDate: checkInDate[roomId],
                    checkOutDate: checkOutDate[roomId],
                    status: "confirmed"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            setSuccessMessage("Booking succesfull");

            setTimeout(() => {
                setSuccessMessage("");
            }, 2000); // Clear the message after 3 seconds

            setCheckInDate(prev => ({ ...prev, [roomId]: "" }));
            setCheckOutDate(prev => ({ ...prev, [roomId]: "" }));
            console.log(response.data);
        } catch (error) {
            console.error("booking failed:", error.response?.data || error.message);
            alert("Booking failed. Please try again.");
        }
    };
    //3rd implementation of the useEffect hook to filter the rooms based on the checkin and checkout dates





    //check for overlap

    return (
        <div className="bookings-container">
            <h2>available Rooms</h2>

            {successMessage && (
                <p className="success-message">{successMessage}</p>


            )}
            {rooms.length === 0 ? (
                <p>Loading...</p>
            ) : (

                <div className="room-grid">
                    {rooms.map((room) => (
                        <div className="room-card" key={room.roomId} >
                            <h3>{room.roomType}</h3>
                            <p><strong>Price:</strong> ${room.price}</p>
                            <p><strong>Status:</strong> {room.availability === 1 ? "Available" : "Not Available"}</p>
                            <p><strong>Description:</strong> {room.description}</p>

                            <p>
                                <label> check in </label>
                                <input
                                    type="date"
                                    value={checkInDate[room.roomId] || ""}
                                    onChange={(e) =>
                                        setCheckInDate((prev) => ({
                                            ...prev,
                                            [room.roomId]: e.target.value,
                                        }))
                                    }
                                />
                            </p>

                            <p>
                                <label> Checkout</label>

                                <input
                                    type="date"
                                    value={checkOutDate[room.roomId] || ""}
                                    onChange={(e) =>
                                        setCheckOutDate((prev) => ({
                                            ...prev,
                                            [room.roomId]: e.target.value,

                                        }))
                                    }
                                />
                            </p>
                            <button
                                type="button"
                                onClick={() => handleBook(room.roomId)}
                                disabled={!checkInDate[room.roomId] || !checkOutDate[room.roomId]}
                            >
                                Book

                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div >
    );
}
export default Bookings;