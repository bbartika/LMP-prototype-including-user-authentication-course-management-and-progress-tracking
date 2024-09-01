const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose')
const cors = require('cors');
const path = require('path');

require('dotenv').config();

// Routes imported
const userRoute = require('./routes/user');
const courseRoute = require('./routes/course');



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/user', userRoute);
app.use('/course', courseRoute);


app.use((req, res) => {
    res.sendFile(path.join(__dirname, public/${req.url} ));
});


mongoose.connect("mongodb://localhost:27017/course-management")
  .then(() => {
    console.log('Connected to mongoose')
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    })
  })
  .catch((err) => {
    console.log('Error in connection', err)
  })                     
