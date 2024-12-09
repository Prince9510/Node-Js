const express = require("express")
const port = 1008

const app = express()

app.set("view engine" , "ejs")

let students = [
    {"id" : "1" , name : "std1" , subject : "NextJs"},
    {"id" : "2" , name : "std2" , subject : "NodeJs"},
    {"id" : "3" , name : "std3" , subject : "ReactJs"},
    {"id" : "4" , name : "std4" , subject : "ExpressJs"}
]

app.get("/" , (req , res)=>{
    res.render("Index" , {students})
})

app.listen(port , (err)=>{
    err ? console.log(err) : console.log("server start on port " + port)
})