const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    ExtraSubCatName: {
        type: String,
        required: true,
    },
    SubCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategorie',
        required: true,
    },
});

const AdminExtraSubCategory = mongoose.model('ExtraSubCategorie', schema);

module.exports = AdminExtraSubCategory; 