const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Employee_Managment_System_NEWSQL',
    password: '2006',
    port: 5432, // Default PostgreSQL port
});

pool.connect((err) => {
    err ? console.log(err) : console.log("Connected to PostgreSQL");
});

module.exports = pool;