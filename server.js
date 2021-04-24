//12.3.4 start 
const express = require('express');
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

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


//Get all candidates  
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});


//GET a single candidate 
app.get(`/api/candidate/:id`, (req, res) => {
    const sql = `SELECT candidates.*, parties.name
        AS party_name
        FROM candidates
        LEFT JOIN parties
        ON candidates.party_id = party.id
        WHERE candidates.id =?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

//Update a candidates party aka put 
// Update a candidate's party
app.put('/api/candidate/:id', (req, res) => {
      // Candidate is allowed to not have party affiliation
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

//Delete a candidate 
app.delete(`/api/candidate/:id`, (req, res) => {
    const sql = 'DELETE FROM candidates WHERE ID =?';
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// Create a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
  VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });

});

//display all parties 
app.get('/api/parties', (req, res) => {
    const sql = 'SELECT * FROM parties';
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.mmessage });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});


//party by id adding :id to html and FROM parties WHERE id = ?
app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// delte a party aka the d in crud delete 
app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: res.message });
            //checks if anything was deleted
        } else if (!result.affectedRows) {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
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

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });