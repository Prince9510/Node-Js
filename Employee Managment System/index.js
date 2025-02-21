const express = require('express');
const port = 5000;
const app = express();
const db = require('./config/db');
const adminRoute = require('./route/adminRoute');
const managerRoute = require('./route/managerRoute');
const employeeRoute = require('./route/employeeRoute');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use("/admin", adminRoute);
app.use("/manager", managerRoute);
app.use("/employee" , employeeRoute);

app.listen(port, (err) => {
    err ? console.log(err) : console.log(`server started : http://localhost:${port}`);
});