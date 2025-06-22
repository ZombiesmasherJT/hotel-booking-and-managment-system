const express = require("express");
require("dotenv").config();
const cors = require("cors");
console.log("JWT SECRET:", process.env.JWT_SECRET);
const db = require("./db");  // Import db.js
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

// Connect auth routes
app.use("/auth", authRoutes);

// API Server Status Check
app.get("/", (req, res) => {
    res.send("API server is running correctly and smoothly");
});

// Get all rooms  public roiute
app.get("/rooms", (req, res) => {
    const query = "SELECT * FROM rooms";

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed", details: err });
        }
        res.json(result);
    });
});

// create a room for admin only 

app.post("/rooms", authMiddleware(["admin"]), (req, res) => {
    const { roomType, price, availability, description } = req.body;


    if (!roomType || !price || availability === undefined || !description) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const query = "INSERT INTO rooms (roomType, price, availability, description) VALUES (?, ?, ?, ?)";


    db.query(query, [roomType, price, availability, description], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed", details: err });
        }
        res.json({ message: "Room created successfully" });
    });
});


//api route for getting all rooms

app.get("/available-rooms", (req, res) => {
    const { checkInDate, checkOutDate } = req.query;   // Extract query parameters

    if (!checkInDate || !checkOutDate) {
        return res.status(400).json({ error: "Missing required parameters" });
    }


    const query = `
    SELECT * FROM rooms WHERE roomId NOT IN (
        SELECT roomId FROM bookings
         WHERE (checkInDate < ? AND checkOutDate > ?)
            OR (checkInDate >= ? AND checkInDate < ?)
            OR (checkOutDate > ? AND checkOutDate <= ?)

        )
         and availability = 1`;

    ;


    db.query(query, [checkOutDate, checkInDate, checkInDate, checkOutDate, checkOutDate, checkInDate], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed", details: err });
        }
        res.json({ avalableRooms: results });
    });
});


// Get all bookings for the logged-in user in the hotel booking s
app.get("/bookings", authMiddleware(["guest", "admin"]), (req, res) => {
    const userId = req.user.userId; // Extract user ID from token
    const userRole = req.user.role; // Extract the user role from the token


    let query;
    let params = [];


    // If the user is an admin, return all bookings
    if (userRole === "admin") {
        query = "SELECT * FROM bookings";


    } else {
        query = "SELECT * FROM bookings WHERE userId = ?";
        params.push(userId);

    }

    db.query(query, params, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed", details: err });
        }
        res.json(result);
    });
});

//create a booking for users

app.post("/bookings", authMiddleware(), (req, res) => {

    console.log("Received booking request:", req.body); // Log request body to appear in the console
    const { roomId, checkInDate, checkOutDate, status } = req.body;
    const userId = req.user.userId; // Extract user ID from the GWT token

    if (!userId || !roomId || !checkInDate || !checkOutDate || !status) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the room is available for the given dates before inserting the booking


    const checkQuery = `
    SELECT * FROM bookings
    WHERE roomId = ?
    AND (checkInDate < ? AND checkOutDate > ?)

    `;

    db.query(checkQuery, [roomId, checkOutDate, checkInDate], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed", details: err });
        }

        if (results.length > 0) {
            return res.status(409).json({ error: "Room is not available for the selected dates" });
        }

        //room is available, so insert the booking

        const query = "INSERT INTO bookings (userId, roomId, checkInDate, checkOutDate, status) VALUES (?, ?, ?, ?, ?)";

        db.query(query, [userId, roomId, checkInDate, checkOutDate, status], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database query failed", details: err });
            }
            res.json({ message: "Booking created successfully" });
        });
    });

});

//delete a booking but used authMiddleware for security purposes.


app.delete("/bookings/:bookingId", authMiddleware(), (req, res) => {
    const bookingId = req.params.bookingId;
    const userId = req.user.userId; // Extract from token
    const userRole = req.user.role; // Extract the user role from the token

    const checkQuery = "SELECT userId FROM bookings WHERE bookingId = ?";

    db.query(checkQuery, [bookingId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed", details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const bookingOwnerId = results[0].userId;

        if (userId !== bookingOwnerId && userRole !== "admin") {
            return res.status(403).json({ error: "You are not authorized to delete this booking" });
        }

        const query = "DELETE FROM bookings WHERE bookingId = ?";
        db.query(query, [bookingId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Database query failed", details: err });
            }
            res.json({ message: "Booking deleted successfully" });
        });
    });
});


// Delete a booking /* for admins only */
app.delete("/rooms/:roomId", authMiddleware(["admin"]), (req, res) => {
    const { roomId } = req.params;
    const query = "DELETE FROM rooms WHERE roomId = ?";

    db.query(query, [roomId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed", details: err });
        }
        res.json({ message: "room deleted succesfully" });
    });
});


// Update a booking (Secure)     needs updating>>>>


app.put("/bookings/:bookingId", authMiddleware(), (req, res) => {
    const { bookingId } = req.params;
    const { checkInDate, checkOutDate, status } = req.body;
    const userId = req.user.userId; // Get userId from the token instead of request body
    const userRole = req.user.role; // Get user role from the token (JWT)

    if (!checkInDate || !checkOutDate || !status) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const checkQuery = "SELECT userId, roomId FROM bookings WHERE bookingId = ?";


    db.query(checkQuery, [bookingId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed", details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const bookingOwnerId = results[0].userId;
        const roomId = results[0].roomId; // Get the roomId from the booking record

        //only allow the owner of the booking or admin to update the booking

        if (userId !== bookingOwnerId && userRole !== "admin") {
            return res.status(403).json({ error: "You are not authorized to update this booking" });
        }


        // updated put logic so it checks for clashes  before updating the booking

        const checkAvailabilityQuery = `
        SELECT * FROM bookings
        WHERE roomId = ?
        AND bookingId != ?
        AND(
        (checkInDate < ? AND checkOutDate > ?)
          )
        `;


        db.query(checkAvailabilityQuery, [roomId, bookingId, checkOutDate, checkInDate], (err, conflictedresults) => {
            if (err) {
                return res.status(500).json({ error: "conflict check failed", details: err });
            }

            if (conflictedresults.length > 0) {
                return res.status(409).json({ error: "Room is not available for the selected dates" });
            }

            // Proceed with updating the booking if no conflicts 

            const query = "UPDATE bookings SET checkInDate = ?, checkOutDate = ?, status = ? WHERE bookingId = ?";

            db.query(query, [checkInDate, checkOutDate, status, bookingId], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Database update failed", details: err });
                }
                if (result.affectedRows === 0) {
                    return res.status(403).json({ error: "You are not authorized to update this booking" });
                }
                res.json({ message: "Booking updated successfully" });
            });
        });
    });
});

// update a room admin only


app.put("/rooms/:roomId", authMiddleware(["admin"]), (req, res) => {

    const { roomId } = req.params;
    const { roomType, price, availability, description } = req.body;


    if (!roomType || !price || availability === undefined || !description) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const query = "UPDATE rooms SET roomType = ?, price = ?, availability = ?, description = ? WHERE roomId = ?";


    db.query(query, [roomType, price, availability, description, roomId], (err, result) => {

        if (err) {
            return res.status(500).json({ error: "Database query failed", details: err });
        }

        res.json({ message: "Room updated successfully" });
    });
});

// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});