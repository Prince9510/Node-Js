const fs = require("fs");
const upload = require('../middleware/multer');
const productSchema = require('../model/productSchema');
const path = require('path');
const AdminSubCategory = require('../model/catSubSchema');
const AdminExtraSubCategory = require('../model/ExtraSubCatSchema');

module.exports.addViewProduct = async (req , res) => {
    const data = await AdminSubCategory.find({}).populate('categoryId');
    const extraData = await AdminExtraSubCategory.find({}).populate('SubCategoryId');
    res.render("addProducts", { data , extraData });
}

module.exports.addProduct = async (req, res) => {
    req.body.image = req.file.path
    await productSchema.create(req.body).then((data) => {
        res.redirect("/addAdmin");
      });

      console.log(req.body)
      console.log(req.file)
}

module.exports.viewProduct = async (req, res) => {
    const data = await productSchema.find({}).populate('subCategoryId').populate('extraSubCategoryId');
    res.render("viewProduct", { data });
}

module.exports.deleteProduct = async (req, res) => {
    await productSchema.findByIdAndDelete(req.query.id).then((data) => {
        fs.unlinkSync(data.image);
        res.redirect("/viewProduct");
      });
}

module.exports.updateProductPage = async (req, res) => {
    const product = await productSchema.findById(req.query.id);
    const data = await AdminSubCategory.find({}).populate('categoryId');
    const extraData = await AdminExtraSubCategory.find({}).populate('SubCategoryId');
    res.render("updateProduct", { product, data, extraData });
}

module.exports.updateProduct = async (req, res) => {
   
        const product = await productSchema.findById(req.body.id);
        if (req.file) {
            fs.unlinkSync(product.image); // Delete the old image
            req.body.image = req.file.path;
        } else {
            req.body.image = product.image;
        }
        await productSchema.findByIdAndUpdate(req.body.id, req.body);
        res.redirect("/viewProduct");
    
}