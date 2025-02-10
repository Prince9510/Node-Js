const express = require("express");
const fs = require('fs');
const mailer = require('../middleware/mailer');
const categorySchema = require("../model/categorySchema");
const path = require('path');


module.exports.getCategorieForm = async (req , res) => {
    res.render("addCategory");
}

module.exports.addCategory = async (req , res) => {
    req.body.categoryImage = req.file.path;
    
    console.log(req.body);
    console.log(req.file);
    await categorySchema.create(req.body).then((data) => {
        res.redirect("/getCategorieForm");
    })
}

module.exports.viewCategory = async (req , res) => {
    await categorySchema.find({}).then((data) => {
        res.render("viewCategory" , { data })
    })
}

module.exports.deleteCategoryData = async (req , res) => {

    await categorySchema.findByIdAndDelete(req.query.id).then((data) => {
        fs.unlinkSync(data.categoryImage);
        res.redirect("/viewCategory");
    })
   
} 

module.exports.getUpdateCategoryForm = async (req , res) => {
    await categorySchema.findById(req.query.id).then((data) => {
        res.render("updateCategory" , { data })
    })
}

module.exports.updateCategory = async (req , res) => {
    let img = "";
    let singleData = await categorySchema.findById(req.body.id);
    req.file ? img = req.file.path : img = singleData.categoryImage;
    req.file && fs.unlinkSync(singleData.categoryImage);
    req.body.categoryImage = img;
    let data = await categorySchema.findByIdAndUpdate(req.body.id, req.body);
    data && res.redirect("/viewCategory");
}