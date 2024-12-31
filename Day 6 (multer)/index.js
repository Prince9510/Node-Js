const express = require("express");
const mongoose = require("mongoose");
const schema = require("./model/fristSchema");
const multer = require("multer");
const path = require("path");
const port = 5173;
const app = express();
const fs = require("fs");

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bookstore_multer');

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.set("view engine", "ejs");

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const new_id = Date.now();
    cb(null, file.fieldname + new_id);
  },
});

const upload = multer({ storage: Storage }).single('imagefile');

app.get("/", async (req, res) => {
  const book = await schema.find();
  res.render("index", { book });
});

app.post("/addData", upload, async (req, res) => {
  req.body.url = req.file.path;
  await schema.create(req.body).then((data) => {
    res.redirect("/");
  });
});

app.get("/deleteData", async (req, res) => {
  const singleData = await schema.findById(req.query.id);
    fs.unlinkSync(singleData.url);
  await schema.findByIdAndDelete(req.query.id).then((data) => {
    res.redirect("/");
  });
});

app.get("/editData", async (req, res) => {
  let singleData = await schema.findById(req.query.id);
  res.render("update", { singleData });
});

app.post("/updateData", upload, async (req, res) => {
  let singleData = await schema.findById(req.body.id);
  let img = singleData.url;

  if (req.file) {
    img = req.file.path;
    fs.unlinkSync(singleData.url);
  }

  req.body.url = img;

  await schema.findByIdAndUpdate(req.body.id, req.body).then((data) => {
    res.redirect("/");
  });
});

app.listen(port, (err) => {
  err ? console.log(err) : console.log(`http://localhost:${port}`);
});
