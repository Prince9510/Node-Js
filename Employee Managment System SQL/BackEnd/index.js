const express = require('express');
const path = require('path');
const port = 5000;
const app = express();
const db = require('./config/db');
const adminRoute = require('./route/worker managment routes/adminRoute');
const managerRoute = require('./route/worker managment routes/managerRoute');
const employeeRoute = require('./route/worker managment routes/employeeRoute');
const projectRoute = require('./route/projectRoute/projectRoute');
const globalRoute = require('./route/worker managment routes/globalRoute')
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/admin", adminRoute);
app.use("/manager", managerRoute);
app.use("/employee", employeeRoute);
app.use('/project', projectRoute);
app.use('/password', globalRoute);

app.listen(port, (err) => {
    err ? console.log(err) : console.log(`server started : http://localhost:${port}`);
});