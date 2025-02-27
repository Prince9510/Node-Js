const AdminSubCategory = require('../model/catSubSchema');
const AdminCategory = require('../model/catSchema');

module.exports.addSubCat = async (req, res) => {
    await AdminCategory.find({}).then((data) => {
        res.render("addSubCat", { data });
    });
};

module.exports.addSubCategory = async (req, res) => {
    await AdminSubCategory.create(req.body).then((data) => {
        res.redirect("/addSubCat");
    });
};

module.exports.viewSubCat = async (req, res) => {
    const data = await AdminSubCategory.find().populate('categoryId');
    res.render("viewSubCat", { data });
};

module.exports.deleteSubCategory = async (req, res) => {
    await AdminSubCategory.findByIdAndDelete(req.query.id).then((data) => {
        res.redirect("/viewSubCat");
    });
};

module.exports.updateSubCategoryPage = async (req, res) => {
    let subCategory = await AdminSubCategory.findById(req.query.id);
    let categories = await AdminCategory.find({});
    res.render("updateSubCategoryPage", { subCategory, categories });
    console.log(req.query.id);
};




module.exports.updateSubCategory = async (req, res) => {
        let updateData = {
            catSubName: req.body.catSubName,
            categoryId: req.body.categoryId
        };
        
        await AdminSubCategory.findByIdAndUpdate(req.body.id, updateData);
        res.redirect("/viewSubCat");
};