import express from "express";
import pg from "pg";
import bodyParser from "body-parser"

// create postgres database client
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books",
    password: "swordfish",
    port: 5432,
});

// connect to postgres database
db.connect();

let books = []; 

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// get book review homepage
app.get("/", async (req, res) => {
    try{
        // get all book reviews by id in descending order
        const result = await db.query("SELECT * FROM book_info ORDER BY id DESC");
        books = result.rows;
        res.render("index.ejs", {books: books});
    }catch(err) {
        console.log(err);
    }
});

app.post("/sort", async (req, res) => {
    const sort_type = req.body.sort;
    let sort_cmd;
    // set sql command based on selected sort option
    switch(sort_type) {
        case "recency":
            sort_cmd = "id DESC"; // sort by id in descending order
            break;
        case "title":
            sort_cmd = "title ASC"; // sort by book title in ascending alphabetical order
            break;
        case "rating":
            sort_cmd = "rating DESC"; // sort by book rating in descending order
            break;
        default:
            console.log("Invalid sort option");
    }   
    // return sorted database based on selected sort option
    try{
        const result = await db.query("SELECT * FROM book_info ORDER BY " + sort_cmd);
        books = result.rows;
        res.render("index.ejs", {books: books});
    }catch(err) {
        console.log(err);
    }    
});

// insert new book review into database
app.post("/add", async (req, res) => {
    const date = new Date();
    try{
        await db.query("INSERT INTO book_info (title, review, rating, date) VALUES ($1, $2, $3, $4);", 
        [req.body.title, req.body.review, req.body.rating, date]);
        res.redirect("/");
    }catch(err) {
        console.log(err);
    }
});

// route to add new review page
app.get("/new", (req, res) => {
    res.render("new.ejs", {heading: "Add New Book Review", submit: "Create new post"});
});

// delete selected book review
app.post("/delete", async (req, res) => {
    const id = req.body.delete;
    try{
        await db.query("DELETE FROM book_info WHERE id = $1;", [id]);
        res.redirect("/");
    }catch(err) {
        console.log(err);
    }
});

// route to edit book review page passing in book id
app.post("/edit", async (req, res) => {
    const book_id = parseInt(req.body.edit);
    const book_to_edit = books.find((book) => book.id = book_id);
    res.render("new.ejs", {heading: "Edit Review", book: book_to_edit, submit: "Edit Post"})
});

// update database with updated book review
app.post("/update", async (req, res) => {
    const date = new Date();
    console.log(req.body);

    try{
        await db.query("UPDATE book_info SET (title, review, rating, date) = ($1, $2, $3, $4) WHERE id = $5;", 
        [req.body.title, req.body.review, req.body.rating, date, req.body.book_id]);
        res.redirect("/");
    }catch(err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})