const express = require('express');
const globalRoute = express.Router();
const adminMulter = require('../../middleware/multer');
const globalController = require('../../controller/worker managment/globalController');
const authentication = require('../../middleware/jwt');



globalRoute.post("/forgotPassword", globalController.forgotPassword);
globalRoute.post("/resetPassword", globalController.resetPassword);




module.exports = globalRoute;