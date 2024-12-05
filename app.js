const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    database: "crud",
    host: "localhost",
    password: "21981A4420",
    port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/start", async (req, res) => {
    try {
        // const response = await db.query("SELECT * FROM studies");
        // const data = response.rows;
        // console.log(data);
        res.render("index", {startContent: "Your CRUD Data Here." });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post("/createData", async (req, res) => {
    try {
        const response = await db.query(
            "INSERT INTO studies (id, title, author, content, category) VALUES ($1, $2, $3, $4, $5)",
            [req.body.id, req.body.title, req.body.author, req.body.content, req.body.category]
        );
        res.render("index.ejs", {startContent: JSON.stringify(response)});
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.get("/read", async (req, res) => {
    try {
        const id = req.query.id; // Use query parameter from GET request
        const response = await db.query("SELECT * FROM studies WHERE id=$1", [id]);
        const request = response.rows;
        res.render("index.ejs", { startContent: JSON.stringify(request) });
        console.log(request);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
});


app.post("/update", async(req, res) => {
    try{
        const id = req.body.id;
        const response = await db.query("UPDATE studies SET title=$1, author=$2, content=$3, category=$4 WHERE id=$5",
            [req.body.title, req.body.author, req.body.content, req.body.category, id]);
        const request = response.rows;
        res.render("index.ejs", {startContent: "Successfully Updated..."});
        console.log(request);
    }  catch(error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }  
});


app.get("/delete", async(req, res) => {
    try{
        const id = req.query.id;
        const response = await db.query("DELETE FROM studies WHERE id=$1",[id]);
        const request = response.rows;
        console.log(request);
        res.render("index.ejs", {startContent: "Successfully Deleted...."})
    } catch(error) {
        res.send(error.message);
        console.log(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
});
