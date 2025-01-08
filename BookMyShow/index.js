const express = require('express');
const mongoose = require('mongoose');
const port = 5173;
const app = express();
const db = require('./config/db');
const path = require('path');
const routes = require('./routes/routes');

app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

// Use the routes
app.use('/', routes);

// Start the server
app.listen(port, (err) => {
    if (err) {
        console.log('Failed to start server', err);
    } else {
        console.log(`Server is running on port ${port}`);
    }
});