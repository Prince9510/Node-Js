const express = require('express');
const route = express.Router();
const ctl = require('../Controllers/ctl');
const upload = require('../Middleware/multer');

route.get("/", ctl.home);
route.get("/addMovie", ctl.addMovie);
route.post("/addMovie", upload, ctl.createMovie);
route.get("/deleteMovie", ctl.deleteMovie);
route.get("/edit",ctl.editPage)
route.post("/updateMovie", upload , ctl.updateMovie); 

module.exports = route;