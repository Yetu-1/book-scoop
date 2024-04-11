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
        res.render("index.ejs", {books: result.rows});
    }catch(err) {
        console.log(err);
    }
});

app.post("/add", async (req, res) => {
    console.log(req.body);
    const date = new Date();
    try{
        await db.query("INSERT INTO book_info (title, review, rating, date) VALUES ($1, $2, $3, $4);", 
        [req.body.title, req.body.review, req.body.rating, date]);
    }catch(err) {
        console.log(err);
    }
    res.redirect("/");
});

app.post("/new", (req, res) => {
    res.render("new.ejs");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})