const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Employee_Managment_System_NEWSQL',
    password: '2006',
    port: 5432,
});

module.exports = pool;