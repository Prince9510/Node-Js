const movie = require("../model/schema");
const fs = require('fs');
const path = require('path');

module.exports.home = async (req, res) => {
    let data = await movie.find({});
    res.render("index", { data });
};

module.exports.addMovie = async (req, res) => {
    res.render("addMovie");
};

module.exports.createMovie = async (req, res) => {
   
    req.body.thumbnail = req.file.path;
    await movie.create(req.body).then((data)=>{
        res.redirect("/");
    })
    
};

module.exports.deleteMovie = async (req,res)=>{
    await movie.findByIdAndDelete(req.query.id).then((data)=>{
        res.redirect("/");
    })
}

module.exports.editPage = async (req, res) => {
    let data = await movie.findById(req.query.id);
    data && res.render('update', { data });
}

module.exports.updateMovie = async (req, res) => {
    let img = "";
    let singleData = await movie.findById(req.body.id);
    req.file ? (img = req.file.path) : (img = singleData.thumbnail);
    req.file && fs.unlinkSync(singleData.thumbnail);
    req.body.thumbnail = img;
    let data = await movie.findByIdAndUpdate(req.body.id, req.body);
    data && res.redirect("/");
};