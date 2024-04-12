import express from "express";
import pg from "pg";
import bodyParser from "body-parser"

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books",
    password: "swordfish",
    port: 5432,
});

db.connect();

let books = []; 

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM book_info");
        books = result.rows;
        res.render("index.ejs", {books: books});
    }catch(err) {
        console.log(err);
    }
});

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

app.get("/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/delete", async (req, res) => {
    const id = req.body.delete;
    try{
        await db.query("DELETE FROM book_info WHERE id = $1;", [id]);
        res.redirect("/");
    }catch(err) {
        console.log(err);
    }
});

app.post("/edit", async (req, res) => {
    const book_id = parseInt(req.body.edit);
    const book_to_edit = books.find((book) => book.id = book_id);
    console.log(book);
    res.render("new.ejs", {heading: "Edit Review", book: book_to_edit})
});

app.post("/update", async (req, res) => {
    const date = new Date();
    try{
        await db.query("INSERT INTO book_info (title, review, rating, date) VALUES ($1, $2, $3, $4);", 
        [req.body.title, req.body.review, req.body.rating, date]);
        res.redirect("/");
    }catch(err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})