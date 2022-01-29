const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');


dotenv.config();

mongoose.connect(
    process.env.URL, 
    {useNewUrlParser: true}, 
    ()=>{
        console.log("Database Connected");
    }
);

//Middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);

app.listen(3000, ()=>{
    console.log('server has started...!!!');
})