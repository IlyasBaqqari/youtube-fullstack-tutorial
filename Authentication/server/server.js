const express = require('express');
const dotenv = require('dotenv');
const mariadb = require('mariadb');
const cors = require('cors');

// Initialise environment variables
dotenv.config({path: '.env-local'});
const port = process.env.PORT || 3001;

// Initialise express
const app = express();
app.use(express.json());
app.use(cors());

// Connect to database
const db = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

// Post request
app.post('/register', async (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    await db.query("INSERT INTO users (username, password) VALUES (?,?)", 
    [username, password], 
    (err, result) => {
        console.log(err);
    });
});

app.post('/login', async (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    await db.query("SELECT * FROM users WHERE username=? AND password=?", 
    [username, password], 
    (err, result) => {
        if (err) {
            res.send({err: err})
        } 
        if (result) {
            res.send(result);
        } else {
            res.send({message: "Incorrect username or password"})
        }
    });
});


app.listen(port, () => {
    console.log(`Running server on port ${port}`);
})