const express = require("express");
const mongoose = require("mongoose");
const schema = require("./model/fristSchema");
const port = 5173;
const app = express();

mongoose.connect("mongodb://localhost:27017/BookStoreData");
const db = mongoose.connection;
db.once("open", (err) => {
  err ? console.log(err) : console.log("Database Connected");
});

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const book = await schema.find();
  res.render("index", { book });
});

app.post("/addData", (req, res) => {
  schema.create(req.body);
  res.redirect("/");
});

app.get("/deleteData", async (req, res) => {
  await schema.findByIdAndDelete(req.query.id).then((data) => {
    res.redirect("/");
  });
});

app.get("/editData", async (req, res) => {
  let singleData = await schema.findById(req.query.id);
  res.render("update", { singleData });
});

app.post("/updateData", async (req, res) => {
  await schema.findByIdAndUpdate(req.body.id, req.body).then((data) => {
    res.redirect("/");
  });
});

app.listen(port, (err) => {
  err ? console.log(err) : console.log(`http://localhost:${port}`);
});
