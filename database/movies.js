const mongoose = require("mongoose");

//Create Author Schema
const MovieSchema = mongoose.Schema(
    {
        image: String,
        title: String,
        actor: String
    }
);

const MovieModel = mongoose.model("movies", MovieSchema);

module.exports = MovieModel;