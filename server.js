

const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');


const PORT = process.env.PORT || 3001;
const app = express();

//express middleware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
app.use('/api', apiRoutes);



// Below is a good way to test to make sure express is working 
//should say hello world on localhost:3001
// app.get('/', (req, res) => {
//     res.json({
//       message: 'Hello World'
//     });
//   });



// Not Found response for unmatched routes
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