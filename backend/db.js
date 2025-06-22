const mysql = require("mysql2"); // Import the mysql2 module    

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Riddler123@",  // Replace with your actual password
    database: "hotel_booking"
});

db.connect((err) => {
    if (err) {
        console.error(" Database Connection Error:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

module.exports = db;

// new 
