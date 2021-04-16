const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

//express middleware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect to database 
// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //  MySQL username,
        user: 'root',
        //  MySQL password
        password: 'Root',
        database: 'election'
    },
    console.log('Connected to the election database.')
);


//this shows entire table in json 
//   db.query(`SELECT * FROM candidates`, (err, rows) => {
//       console.log(rows);
//   });

//GET a single candidate *currently hard coded to 1 will update
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err,row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });

//Delete a candidate 
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

//Create a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
    if (err){
        console.log(err);
    }
    console.log(result);
});

// Below is a good way to test to make sure express is working 
//should say hello world on localhost:3001
// app.get('/', (req, res) => {
//     res.json({
//       message: 'Hello World'
//     });
//   });

//Default response for any other request (Not Found) 
// this is a catch all and needs to be at the end or it over rides all 
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});