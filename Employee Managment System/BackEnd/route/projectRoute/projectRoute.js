const express = require('express');
const projectRoute = express.Router();
const authentication = require('../../middleware/jwt');
const projectController = require('../../controller/project managment/projectController');

projectRoute.post("/assigneProject", authentication, projectController.assigneProject);
projectRoute.get('/viewProject' , authentication , projectController.viewProject);
projectRoute.delete('/deleteProject' , authentication , projectController.deleteProject);
projectRoute.put('/updateProject' , authentication , projectController.updateProject);
projectRoute.put('/statusUpdate' , authentication , projectController.statusUpdate);

module.exports = projectRoute;