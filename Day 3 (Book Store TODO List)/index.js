const express = require("express");
const port = 5173;
const app = express();

app.use(express.urlencoded())
let Book =[];

app.set("view engine" , "ejs");

app.get("/",(req,res)=>{
  res.render("index",{Book});
});

app.post("/addData",(req,res)=>{
  req.body.id = String(Date.now())
  Book.push(req.body)
  res.redirect("/")
})
app.get("/deleteData",(req,res)=>{
  let delData = Book.filter((e)=>e.id != req.query.id);
  Book = delData ; 
  res.redirect("/");
})

app.get("/editData",(req,res)=>{
  let singleData = Book.find((item)=>item.id == req.query.id)
  res.render("update",{singleData})
})
app.post("/updateData",(req,res)=>{
  Book.map((e)=>{
    if (e.id === req.body.id) {
      (e.id = req.body.id),
      (e.name = req.body.name),
      (e.author = req.body.author),
      (e.price = req.body.price),
      (e.date = req.body.date),
      (e.image = req.body.image)
    }
  })
  res.redirect("/");
})


app.listen(port,(err)=>{
  err?console.log(err):console.log(`http://localhost:${port}`);  
})