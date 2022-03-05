const db = require("./database/index.js");
const BookModel = require("./database/books.js");
const AuthorModel = require("./database/authors.js");
const PublicationModel = require("./database/publication.js");

const mongoose = require('mongoose');


const express = require("express");
const app = express();
app.use(express.json());


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://raat97:raat9797@cluster0.suohg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const bcollection = client.db("book-company").collection("books").findOne({ ISBN: "12345one" });
//     bcollection.then((data) => console.log(data)).catch((err) => console.log(err));
//     // perform actions on the collection object
// });
// client.close();

var mongoDB = "mongodb+srv://raat97:raat9797@cluster0.suohg.mongodb.net/book-company?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("CONNECTION ESTABLISHED"));

//http://localhost:3000
app.get("/", (req, res) => {
    return res.json({ "Welcome": `to my backend` });
});
//http://localhost:3000/books
app.get("/books", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});
//http://localhost:3000/book-isbn/12345one
app.get("/book-isbn/:isbn", async (req, res) => {
    const { isbn } = req.params;
    const getSpecificBook = await BookModel.findOne({ ISBN: isbn });
    if (getSpecificBook === null) {
        return res.json({ "error": `No Book Found for ISBN of ${isbn}` });
    }
    return res.json(getSpecificBook);
});
//http://localhost:3000/book-category/programming
app.get("/book-category/:category", async (req, res) => {
    const { category } = req.params;
    const getSpecificBooks = await BookModel.find({ category: category });
    if (getSpecificBooks.length == 0) {
        return res.json({ "error": `No Book Found for Category of ${category}` });
    }
    return res.json(getSpecificBooks);
});
//http://localhost:3000/authors
app.get("/authors", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});
//http://localhost:3000/author-id/1
app.get("/author-id/:id", async (req, res) => {
    const { id } = req.params;
    const getSpecificAuthor = await AuthorModel.findOne({ id: id });
    if (getSpecificAuthor.length === null) {
        return res.json({ "error": `No Author Found for ID of ${id}` });
    }
    return res.json(getSpecificAuthor);
});
//http://localhost:3000/author-isbn/12345two
app.get("/author-isbn/:isbn", async (req, res) => {
    const { isbn } = req.params;
    const getSpecificAuthors = await AuthorModel.find({ books: isbn });
    if (getSpecificAuthors.length == 0) {
        return res.json({ "error": `No Author Found for ISBN of ${isbn}` });
    }
    return res.json(getSpecificAuthors);
});
//http://localhost:3000/publications
app.get("/publications", async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});
//http://localhost:3000/publication-id/3
app.get("/publication-id/:id", async (req, res) => {
    const { id } = req.params;
    const getSpecificPublication = await PublicationModel.findOne({ id: id });
    if (getSpecificPublication.length === null) {
        return res.json({ "error": `No Publications Found for ID of ${id}` });
    }
    return res.json(getSpecificPublication);
});
//http://localhost:3000/publication-isbn/12345two
app.get("/publication-isbn/:isbn", async (req, res) => {
    const { isbn } = req.params;
    const getSpecificPublications = await PublicationModel.find({ books: isbn });
    if (getSpecificPublications.length == 0) {
        return res.json({ "error": `No Publications Found for ISBN of ${isbn}` });
    }
    return res.json(getSpecificPublications);
});

//POST
//http://localhost:3000/book
app.post("/book", async (req, res) => {
    const addNewBook = await BookModel.create(req.body);
    return res.json({
        books: addNewBook,
        message: "Book was added !"
    });
});

//http://localhost:3000/author
app.post("/author", async (req, res) => {
    const addNewAuthor = await AuthorModel.create(req.body);
    return res.json({
        authors: addNewAuthor,
        message: "Author was added !"
    });
});
//http://localhost:3000/publication
app.post("/publication", async (req, res) => {
    const addNewPublication = await PublicationModel.create(req.body);
    return res.json({
        publication: addNewPublication,
        message: "Publication was added !"
    });
});

//PUT/UPDATE
//http://localhost:3000/book-update/
app.put("/book-update/:isbn", async (req, res) => {
    const { isbn } = req.params;
    const updateBook = await BookModel.findOneAndUpdate({ ISBN: isbn }, req.body, { new: true });
    return res.json({
        books: updateBook,
        message: "Book was Updated !"
    });

});
//http://localhost:3000/author-update/
app.put("/author-update/:id", async (req, res) => {
    const { id } = req.params;
    const updateAuthor = await AuthorModel.findOneAndUpdate({ id: id }, req.body, { new: true });
    return res.json({
        authors: updateAuthor,
        message: "Author was Updated !"
    });
});
//http://localhost:3000/publication-update/
app.put("/publication-update/:id", async (req, res) => {
    const { id } = req.params;
    const updatePublication = await PublicationModel.findOneAndUpdate({ id: id }, req.body, { new: true });
    return res.json({
        publications: updatePublication,
        message: "Publication was Updated !"
    });
});

//DELETE
//http://localhost:3000/book-delete/
app.delete("/book-delete/:isbn", async (req, res) => {
    const { isbn } = req.params;
    const deleteBook = await BookModel.deleteOne({ ISBN: isbn });
    return res.json({
        books: deleteBook,
        message: "Book was Deleted !"
    });
});
//http://localhost:3000/book-author-delete/
app.delete("/book-author-delete/:isbn/:id", async (req, res) => {
    let { isbn, id } = req.params;
    let getSpecificBook = await BookModel.findOne({ ISBN: isbn });
    if (getSpecificBook === null) {
        return res.json({ "error": `No Book Found for ISBN of ${isbn}` });
    }else{
        getSpecificBook.authors.remove(id);
        const deleteBookAuthor = await BookModel.findOneAndUpdate({ ISBN: isbn }, getSpecificBook, { new: true });
        return res.json({
            books: deleteBookAuthor,
            message: "Author was Deleted from Book !"
        });
    }
    
});
//http://localhost:3000/author-book-delete/
app.delete("/author-book-delete/:id/:isbn", async (req, res) => {
    let { isbn, id } = req.params;
    let getSpecificAuthor = await AuthorModel.findOne({ id: id });
    if (getSpecificAuthor === null) {
        return res.json({ "error": `No Author Found for id of ${id}` });
    }else{
        getSpecificAuthor.books.remove(isbn);
        const deleteAuthorBook = await AuthorModel.findOneAndUpdate({ id: id }, getSpecificAuthor, { new: true });
        return res.json({
            authors: deleteAuthorBook,
            message: "Book was Deleted from Author !"
        });
    }
});
//http://localhost:3000/author-delete/
app.delete("/author-delete/:id", async (req, res) => {
    let { id } = req.params;
    const deleteAuthor = await AuthorModel.deleteOne({ id: id });
    return res.json({
        authors: deleteAuthor,
        message: "Author was Deleted !"
    });
});
//http://localhost:3000/publication-delete/
app.delete("/publication-delete/:id", async (req, res) => {
    let { id } = req.params;
    const deletePublication = await PublicationModel.deleteOne({ id: id });
    return res.json({
        publications: deletePublication,
        message: "Publication was Deleted !"
    });
});

app.listen(3000, () => {
    console.log("my app is running");
})