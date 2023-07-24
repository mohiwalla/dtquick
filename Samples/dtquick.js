const mysql = require('mysql');

// Establish database connection
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'newDB',
});

con.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

// Build the query
const query = req.query['query'];
const totalRecords = req.query['totalRecords'];

// Execute the query and get the total number of records
con.query(query, (err, rows) => {
    if (err) throw err;

    con.query(totalRecords, (err, result) => {
        if (err) throw err;

        const response = {
            data: rows,
            found: rows.length,
            total: result[0].totalRecords,
        };

        // Send JSON to the client-side
        res.send(response);
    });
});