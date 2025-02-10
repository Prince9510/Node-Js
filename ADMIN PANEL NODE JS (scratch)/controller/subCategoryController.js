const fs = require('fs');
const path = require('path');
const categorySchema = require('../model/categorySchema');
const subCategorySchema = require('../model/subCategorySchema');

module.exports.getSubCategoryForm = async (req, res) => {
    await categorySchema.find({}).then((data) => {
        res.render("addSubCategory", { data });
    });
};

module.exports.addSubCategory = async (req, res) => {
    req.body.subCategoryImage = req.file.path;

    await subCategorySchema.create(req.body).then((data) => {
        res.redirect("/addSubCategory");
        console.log(data);
    });
};

module.exports.viewSubCategory = async (req, res) => {
    await subCategorySchema.find().populate('categoryId').then((data) => {
        res.render("viewSubCategory", { data });
    });
};

module.exports.deleteSubCategoryData = async (req, res) => {
    await subCategorySchema.findByIdAndDelete(req.query.id).then((data) => {
        if (fs.existsSync(data.subCategoryImage)) {
            fs.unlinkSync(data.subCategoryImage);
        }
        res.redirect("/viewSubCategory");
    });
};

module.exports.updateSubCategoryForm = async (req, res) => {
    let subCategory = await subCategorySchema.findById(req.query.id);
    let categories = await categorySchema.find({});
    res.render("updateSubCategory", { subCategory, categories });
    console.log(req.query.id);
};

module.exports.updateSubCategory = async (req, res) => {
    let updateData = {
        subCategoryName: req.body.subCategoryName,
        categoryId: req.body.categoryId
    };

    if (req.file) {
        const subCategory = await subCategorySchema.findById(req.body.id);
        if (!subCategory) {
            return res.status(404).send("Sub Category not found");
        }
        if (subCategory.subCategoryImage) {
            fs.unlinkSync(subCategory.subCategoryImage);
        }
        updateData.subCategoryImage = req.file.path;
    }

    await subCategorySchema.findByIdAndUpdate(req.body.id, updateData);
    res.redirect("/viewSubCategory");
};