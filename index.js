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

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})