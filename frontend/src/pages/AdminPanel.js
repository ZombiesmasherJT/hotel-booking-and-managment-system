import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminPanel.css";



const AdminPanel = () => {
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");// for filtering the bookings by status
    const [newRoom, setNewRoom] = useState({
        roomType: "",
        price: "",
        availability: true,
        description: ""
    });  // for adding a new room

    const [editRoomId, setEditRoomId] = useState(null);
    const [editRoomData, setEditRoomData] = useState({
        roomType: "",
        price: "",
        availability: true,
        description: ""
    }); // for editing a room


    useEffect(() => {
        const token = localStorage.getItem("token");


        // Fetch all rooms from the server for admin panel


        axios.get("http://localhost:3001/rooms")
            .then((response) => setRooms(response.data))
            .catch((error) => console.error("error when fetching rooms: ", error));


        // Fetch all bookings from the server for admin panel

        axios.get("http://localhost:3001/bookings", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => setBookings(response.data))
            .catch((error) => console.error("error when fetching bookings: ", error));
    }, []);







    // Function to create a new room

    const createRoom = async () => {
        const token = localStorage.getItem("token");

        try {

            const response = await axios.post(
                "http://localhost:3001/rooms",
                newRoom,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );



            // refresh the rooms list after creating a new room

            setRooms([...rooms, response.data]);
            setNewRoom({ roomType: "", price: "", availability: true, description: "" }); // reset the form fields
            alert("Room is now created successfully");
        } catch (error) {
            console.error("error when creating room: ", error);
            alert("Error creating room. Please try again.");
        }

    };



    // fucntion to delte and booking

    const handleDeleteRoom = async (roomId) => {
        const token = localStorage.getItem("token")
        const confirmDelete = window.confirm("Are you sure you want to delete this room?");

        if (confirmDelete) {


            try {
                await axios.delete(`http://localhost:3001/rooms/${roomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                //  update the rooms list after deleting a room

                setRooms(rooms.filter((room) => room.roomId !== roomId));
                alert("Room deleted successfully");

            } catch (error) {
                console.error("Error deleting room: ", error);
                alert("Error deleting room. Please try again.");
            }
        }

    };


    // function to edit a room

    const handleEditRoom = async (room) => {
        setEditRoomId(room.roomId);
        setEditRoomData({
            roomType: room.roomType,
            price: room.price,
            availability: room.availability,
            description: room.description,
        });
    };
    const handleUpdateRoom = async () => {
        const token = localStorage.getItem("token");

        try {

            await axios.put(
                `http://localhost:3001/rooms/${editRoomId}`,
                editRoomData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            alert("Room updated successfully");


            //refresh the rooms list after updating a room

            const updatedRooms = rooms.map((room) =>
                room.roomId === editRoomId ? { ...room, ...editRoomData } : room
            );

            setRooms(updatedRooms);
            setEditRoomId(null); //exit edit mode
        } catch (error) {
            console.error("Error updating room: ", error);
            alert("Error updating room. Please try again.");
        }

    };




    return (
        <div className="admin-panel-container">
            <h1>Admin Panel</h1>
            <section className="Create-room">
                <h3>create a new room</h3>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        createRoom();
                    }}
                >
                    <label>
                        Room Type:
                        <input
                            type="text"
                            value={newRoom.roomType}
                            onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
                            required
                        />
                    </label>

                    <label>
                        Price:
                        <input
                            type="number"
                            value={newRoom.price}
                            onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Availability:
                        <select
                            value={newRoom.availability}
                            onChange={(e) => setNewRoom({ ...newRoom, availability: e.target.value === "true" })}

                        >
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                        </select>
                    </label>


                    <label>
                        Description:
                        <input
                            type="text"
                            value={newRoom.description}
                            onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                            required
                        />

                    </label>

                    <button type="submit">Create Room</button>
                </form>


            </section>




            <section>
                <h3>All rooms</h3>
                <ul className="room-list">
                    {rooms.map((room) => (
                        <li key={room.roomId} className="room-item">
                            {editRoomId === room.roomId ? (
                                <div className="edit-room-form">
                                    <input
                                        type="text"
                                        value={editRoomData.roomType}
                                        onChange={(e) => setEditRoomData({ ...editRoomData, roomType: e.target.value })
                                        }
                                    />
                                    <input
                                        type="number"
                                        value={editRoomData.price}
                                        onChange={(e) =>
                                            setEditRoomData({ ...editRoomData, price: e.target.value })
                                        }
                                    />
                                    <select
                                        value={editRoomData.availability}
                                        onChange={(e) =>
                                            setEditRoomData({
                                                ...editRoomData,
                                                availability: e.target.value === "true",
                                            })
                                        }
                                    >

                                        <option value="true">Available</option>
                                        <option value="false">Not Available</option>
                                    </select>

                                    <input
                                        type="text"
                                        value={editRoomData.description}
                                        onChange={(e) =>
                                            setEditRoomData({
                                                ...editRoomData,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                    <button onClick={handleUpdateRoom}>Save</button>
                                    <button onClick={() => setEditRoomId(null)}>Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <span>
                                        {room.roomType} - ${room.price} - (
                                        {room.availability ? "Available" : "Not Available"})
                                    </span>

                                    <div>
                                        <button
                                            onClick={() => handleEditRoom(room)}
                                            className="edit-room-button"
                                        >
                                            edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRoom(room.roomId)}
                                            className="delete-room-button"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </section>









            <div style={{ marginBottom: "1rem" }}>
                <label> filter by Status</label>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>


            <section>
                <h3>All bookings</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Room ID</th>
                            <th>User ID</th>
                            <th>Check-in Date</th>
                            <th>Check-out Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>




                    <tbody>
                        {bookings
                            .filter((booking) => {
                                if (filterStatus === "all") return true;
                                return booking.status?.toLowerCase() === filterStatus;
                            })
                            .map((booking) => (
                                <tr key={booking.bookingId}>
                                    <td>{booking.bookingId}</td>
                                    <td>{booking.roomId}</td>
                                    <td>{booking.userId}</td>
                                    <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                    <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </section>
        </div >
    );

};







export default AdminPanel;