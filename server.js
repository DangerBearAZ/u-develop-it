const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

//express middleware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Below is a good way to test to make sure express is working 
//should say hello world on localhost:3001
// app.get('/', (req, res) => {
//     res.json({
//       message: 'Hello World'
//     });
//   });

//Default response for any other request (Not Found) 
//this is a catch all and needs to be at the end or it over rides all 
app.use((req, res) => {
    res.status(404).end();
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });