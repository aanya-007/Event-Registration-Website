const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

// ✅ VERY IMPORTANT (FIX)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123@",
    database: "eventdb"
});

db.connect(err => {
    if (err) console.log("DB Error:", err);
    else console.log("Connected to MySQL");
});

// ✅ Register route
app.post("/register", (req, res) => {
    const { name, email, event } = req.body;

    console.log(req.body);

    db.query(
        "INSERT INTO registrations (name, email, event) VALUES (?, ?, ?)",
        [name, email, event],
        (err, result) => {
            if (err) {
                console.log("Insert Error:", err);
                res.status(500).send("Database error");
            } else {
                res.send("Registered successfully");
            }
        }
    );
});

// ✅ Admin data route
app.get("/all", (req, res) => {
    db.query("SELECT * FROM registrations ORDER BY id DESC", (err, result) => {
        if (err) {
            console.log("Fetch Error:", err);
            res.status(500).send("Error fetching data");
        } else {
            res.json(result);
        }
    });
});

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    console.log("👉 Trying to delete ID:", id); // DEBUG

    db.query("DELETE FROM registrations WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log("❌ Delete Error:", err);
            res.status(500).send("Error deleting");
        } else {
            console.log("✅ Rows deleted:", result.affectedRows); // IMPORTANT

            if (result.affectedRows === 0) {
                return res.status(404).send("No record found with this ID");
            }

            res.send("Deleted successfully");
        }
    });
});

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Test route
app.get("/test", (req, res) => {
    res.send("TEST WORKING");
});

// Start server
app.listen(3000, () => console.log("Running on http://localhost:3000"));