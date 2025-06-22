import React, { use, useEffect, useState } from "react";
import axios from "axios";


const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
}

const user = getUserFromToken();
const userName = user ? user.name : "user";



const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
};









const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");
    const [editingBooking, setEditingBooking] = useState(null);  // State to track the booking being edited
    const [editDates, setEditDates] = useState({ checkInDate: "", checkOutDate: "" });  // State to track the new dates for editing

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:3001/bookings", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data;



                setBookings(data);
            }
            catch (error) {
                setError(error.message);
            }


        }
        fetchBookings();
    }, []);


    // Function to handle starting to edit a booking

    const handleEdit = async (booking) => {
        setEditingBooking(booking.bookingId);
        setEditDates({
            checkInDate: booking.checkInDate.split("T")[0],
            checkOutDate: booking.checkOutDate.split("T")[0],
        });

    };


    // cancel edit

    const cancelEdit = () => {
        setEditingBooking(null);
        setEditDates({ checkInDate: "", checkOutDate: "" });
    };

    //save the edited booking (put)

    const submitEdit = async (bookingId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.put(`http://localhost:3001/bookings/${bookingId}`, {
                checkInDate: editDates.checkInDate,
                checkOutDate: editDates.checkOutDate,
                status: "confirmed",
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });



            setEditingBooking(null);
            //REFRESH A BOOKING in the system

            const updated = await axios.get("http://localhost:3001/bookings", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBookings(updated.data);
        }
        catch (error) {
            if (error.response?.status === 409) {
                setError("That room is already being booked for those dates");
            } else {
                setError("An error occurred while updating the booking");
            }
        }
    };


    // Function to handle deleting a booking

    const handleDelete = async (bookingId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
        if (!confirmDelete) return;


        const token = localStorage.getItem("token");



        try {

            await axios.delete(`http://localhost:3001/bookings/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setEditingBooking(null);

            // Refresh the bookings list after deletion


            const updated = await axios.get("http://localhost:3001/bookings", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBookings(updated.data);
        }
        catch (error) {
            setError(error.message);
        }
    };






    return (

        <div>
            <h2>{getGreeting()}, {userName}</h2>
            <h1>Welcome to the Dashboard page</h1>
            {error && <p>{error}</p>}

            {bookings.length === 0 ? (

                < p > No bookings found</p>

            ) : (
                <table border="1" cellPadding="5" style={{ marginTop: "20px" }}>

                    <thead>
                        <tr>
                            <th>Booking id</th>
                            <th>Room</th>
                            <th>Check-in Date</th>
                            <th>Check-out Date</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.bookingId}>
                                <td>{booking.bookingId}</td>
                                <td>{booking.roomId}</td>
                                {editingBooking === booking.bookingId ? (
                                    <>
                                        <td>
                                            <input
                                                type="date"
                                                value={editDates.checkInDate}
                                                onChange={(e) => setEditDates({ ...editDates, checkInDate: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                value={editDates.checkOutDate}
                                                onChange={(e) => setEditDates({ ...editDates, checkOutDate: e.target.value })}
                                            />
                                        </td>

                                        <td>
                                            <button onClick={() => submitEdit(booking.bookingId)}>Save</button>
                                            <button onClick={() => setEditingBooking(null)}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                        <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                                        <td>

                                            <button onClick={() => handleEdit(booking)}>Edit</button>
                                            <button onClick={() => handleDelete(booking.bookingId)}>delete</button>
                                        </td>
                                    </>
                                )}

                            </tr>
                        ))}

                    </tbody>
                </table>


            )}
        </div>
    );
};
export default Dashboard;