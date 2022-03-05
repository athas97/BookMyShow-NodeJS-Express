
const MovieModel = require("./database/movies.js");
const UsersModel = require("./database/users.js");

require('dotenv').config()
const mongoose = require('mongoose');
var cors = require('cors');
const express = require("express");
const { request } = require("express");
const app = express();
app.use(cors());
app.use(express.json());


var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("CONNECTION ESTABLISHED"));

//http://localhost:5000
app.get("/", (req, res) => {
    return res.json({ "Welcome": `to my backend of BookmyShow` });
});

//http://localhost:5000/movies
app.get("/movies", async (req, res) => {
    const getAllMovies = await MovieModel.find();
    return res.json(getAllMovies);
});
//http://localhost:5000/movies/id
app.get("/movie/:id", async (req, res) => {
    const {id} = req.params;
    const getMovie = await MovieModel.findOne({_id: id});
    return res.json(getMovie);
});

//http://localhost:5000/user-register
app.post("/user-register", async (req, res) => {
    const addNewUser = await UsersModel.create(req.body);
    return res.json({
        users: addNewUser,
        message: "User was added !"
    });
});

app.listen(5000, () => {
    console.log("my app is running");
})