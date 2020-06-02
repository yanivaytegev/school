const express = require('express');
const mongoose = require('mongoose');
const app = express();
const manager = require('./routes/api/manager');
const teacher = require('./routes/api/teacher');
const student = require('./routes/api/student');
const auth = require('./routes/api/auth')
const path = require('path');
const config = require('config')
const fileUpload = require('express-fileupload');


//bodyparser middleware
app.use(express.json());
app.use(fileUpload());
//db config
const db = config.get("mongoURI")

//connect to mongo
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log("connection successfully to database !"))
    .catch((err) => console.log(err))

//use routes
app.use('/manager', manager);
app.use('/teacher', teacher);
app.use('/student', student);
app.use('/auth', auth);

//serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


const port = process.env.PORT || 5000;

app.listen(port, () =>
    console.log(`server listen to port ${port}`)
)