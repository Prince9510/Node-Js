const express = require("express");
const subCategorySchema = require("../model/subCategorySchema");
const productSchema = require("../model/productSchema");
const fs = require('fs');
const mailer = require('../middleware/mailer');
const path = require('path');

module.exports.getProductForm = async (req, res) => {
    const subCategory = await subCategorySchema.find({}).then((data) => {
        res.render("addProduct", { data });
    });
};

module.exports.addProduct = async (req, res) => {
    req.body.productImage = req.file.path;
    await productSchema.create(req.body).then((data) => {
        res.redirect("/addProduct");
        console.log(data);
    });
};

module.exports.viewProduct = async (req, res) => {
    await productSchema.find().populate('subCategoryId').then((data) => {
        res.render("viewProduct", { data });
    });
};

module.exports.deleteProduct = async (req, res) => {
    await productSchema.findByIdAndDelete(req.query.id).then((data) => {
        if (fs.existsSync(data.productImage)) {
            fs.unlinkSync(data.productImage);
        }
        res.redirect("/viewProduct");
    });
};

module.exports.getUpdateProductForm = async (req, res) => {
    const data = await productSchema.findById(req.query.id).populate('subCategoryId');
    const subCategories = await subCategorySchema.find({});
    res.render("updateProduct", { data, subCategories });
};

module.exports.updateProduct = async (req, res) => {
    if (req.file) {
        const product = await productSchema.findById(req.body.id);
        if (fs.existsSync(product.productImage)) {
            fs.unlinkSync(product.productImage);
        }
        req.body.productImage = req.file.path;
    }
    await productSchema.findByIdAndUpdate(req.body.id, req.body).then((data) => {
        res.redirect("/viewProduct");
    });
};