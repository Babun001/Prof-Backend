import express from 'express';
import cors from 'cors';
import cookiePerser from 'cookies-parser';


const app = express();


// To allow origin
app.use(cors({
    origin:process.env.CORSOrigin,
}))

// to habdle data format
app.use(express.json({
    limit:"20kb"
}));

// to use a dynamic storage
app.use(express.static("public"));

// to handle data from url
app.use(express.urlencoded({
    extended:true, limit:"20kb"
}));

// to get users cookies
// app.use(cookiePerser());




export {app}

