import express from "express";
import pg from "pg";

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

app.get("/", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM book_info");
        res.render("index.ejs", {books: result.rows});
    }catch(err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})