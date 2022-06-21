// Module Imports
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const PORT = process.env.PORT || 3000;

// Middlewares
// app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const users = []

// Routes
app.get("/api", (req, res) => {
    res.json({message:"Hello World"});
})

function getUser(username) {
    const result = users.filter((user) => (user.username === username));
    return result.length !== 0 ? result[0] : false;
}

app.post("/api/signup", (req, res) => {
    const username = req.body.username;
    if (!getUser(username)) {
        const passhash = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
        users.push({username, passhash})
        res.send(`User : ${username} created successfully!`);
    } else {
        res.send(`Username : "${username}" already taken, try different username!`)
    }

})

app.post("/api/login", (req, res) => {
    const {username, password} = req.body;
    const user_from_db = getUser(username);
    if (user_from_db){
        if (bcrypt.compareSync(password, user_from_db.passhash)){
            res.send(`Welcome ${username}!`);
        }
    }
    res.send(`Incorrect Credentials, please try again!`)
})

app.listen(PORT, ()=>{
    console.log(`Server running on PORT:${PORT}`)
})