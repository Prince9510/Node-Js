const adminSchema = require('../../model/adminSchema');
const employeeSchema = require('../../model/employeeSchema');
const managerSchema = require('../../model/managerSchema');
const projectSchema = require('../../model/projectSchema');

module.exports.assigneProject = async (req, res) => {
    // console.log("Request body:", req.body); // Debug statement to log the request body

    if (req.user.adminData) {
        const managerId = req.body.managerId;
        const adminId = req.user.adminData._id;

        // console.log('admin ' + adminId)

        if (!managerId) {
            return res.status(400).json({ error: "Manager ID is required" });
        }

        const projectData = {
            ...req.body,
            assigneToRole: "manager",
            assigneTo: managerId,
            assigneBy: adminId // Automatically fill adminId
        };
        // console.log(projectData)
        await projectSchema.create(projectData).then(async (projectData) => {
            const populatedProject = await projectSchema.findById(projectData._id).populate([
                {
                    path: 'assigneTo',
                    select: 'name',
                    model: 'manager_Detail'
                },
                {
                    path: 'assigneBy',
                    select: 'name',
                    model: 'admin_Detail'
                }
            ]);

            // console.log(populatedProject)
            res.status(200).json({ "project Data": populatedProject });
        }).catch((error) => {
            res.status(200).json({ error: error.message });
        });

    } else if (req.user.managerData) {
        const employeeId = req.body.employeeId;
        const managerId = req.user.managerData._id;

        // console.log('manager id   ' + managerId)
        // console.log('employee id   ' + employeeId)

        if (!employeeId) {
            return res.status(400).json({ error: "Employee ID is required" });
        }

        const projectData = {
            ...req.body,
            assigneToRole: "employee",
            assigneTo: employeeId,
            assigneBy: managerId // Automatically fill managerId
        };

        // console.log(projectData)

        await projectSchema.create(projectData).then(async (projectData) => {
            const populatedProject = await projectSchema.findById(projectData._id).populate([
                {
                    path: 'assigneTo',
                    select: 'name',
                    model: 'employee_Detail',
                },
                {
                    path: 'assigneBy',
                    select: 'name',
                    model: 'manager_Detail'
                }
            ]
            );

            // console.log(populatedProject)
            res.status(200).json({ "project Data": populatedProject });
        }).catch((error) => {
            res.status(200).json({ error: error.message });
        });
    } else {
        return res.status(400).json({ error: "Unauthorized user" });
    }
};

module.exports.viewProject = async (req, res) => {
    if (req.user.adminData) {
        const allProject = await projectSchema.find({}).populate([
            {
                path: 'assigneTo',
                select: 'name',
                model: 'manager_Detail'
            },
            {
                path: 'assigneBy',
                select: 'name',
                model: 'admin_Detail'
            }
        ]);

        console.log("All Projects for Admin:", allProject); // Debug statement

        const adminProjects = allProject.filter(project => {
            console.log("Project AssigneBy:", project.assigneBy); // Debug statement
            return project.assigneBy && project.assigneBy._id.toString() === req.user.adminData._id.toString();
        });
        console.log("Filtered Admin Projects:", adminProjects); // Debug statement
        console.log("Admin ID:", req.user.adminData._id); // Debug statement

        const adminProjectsLength = adminProjects.length;

        res.status(200).json({
            message: "admin",
            adminProjects,
            adminProjectsLength
        });


    } else if (req.user.managerData) {
        const allProject = await projectSchema.find({}).populate([
            {
                path: 'assigneTo',
                select: 'name',
                model: 'employee_Detail'
            },
            {
                path: 'assigneBy',
                select: 'name',
                model: 'manager_Detail'
            }
        ]);

        console.log("All Projects for Manager:", allProject); // Debug statement

        const assigneMe = await projectSchema.find({}).populate([
            {
                path: 'assigneTo',
                select: 'name',
                model: 'manager_Detail'
            },
            {
                path: 'assigneBy',
                select: 'name',
                model: 'admin_Detail'
            }
        ]);

        console.log("Assigned to Me Projects for Manager:", assigneMe); // Debug statement

        const assigneToOwnEmployee = allProject.filter(project => project.assigneBy && project.assigneBy._id.toString() === req.user.managerData._id.toString());
        const assigneTo = req.user.managerData._id;
        const assigneMeProjects = assigneMe.filter(project => project.assigneTo && project.assigneTo._id.toString() === assigneTo.toString());

        console.log("Filtered Projects Assigned to Own Employee:", assigneToOwnEmployee); // Debug statement
        console.log("Filtered Projects Assigned to Me:", assigneMeProjects); // Debug statement

        const managerProjectsLength = assigneMeProjects.length + assigneToOwnEmployee.length

        res.status(200).json({
            message: "manager",
            assigneToOwnEmployee,
            assigneMeProjects,
            managerProjectsLength
        });
    } else if (req.user.employeeData) {
        const allProject = await projectSchema.find({}).populate([
            {
                path: 'assigneTo',
                select: 'name',
                model: 'employee_Detail'
            },
            {
                path: 'assigneBy',
                select: 'name',
                model: 'manager_Detail'
            }
        
        ]);

        console.log("All Projects for Employee:", allProject); // Debug statement

        const employeeProjects = allProject.filter(project => project.assigneTo && project.assigneTo._id.toString() === req.user.employeeData._id.toString());
        console.log("Filtered Employee Projects:", employeeProjects); // Debug statement

        const employeeProjectsLength = employeeProjects.length;

        res.status(200).json({
            message: "employee",
            employeeProjects,
            employeeProjectsLength
        });
    } else {
        res.status(400).json({ error: "Unauthorized user" });
    }
};

module.exports.deleteProject = async (req, res) => {
    if (req.user.adminData) {
        const assigneBy = req.user.adminData._id;
        const project = await projectSchema.findOne({ _id: req.query.id, assigneBy: assigneBy });

        if (project) {
            await projectSchema.findByIdAndDelete(req.query.id).then((data) => {
                res.status(200).json({ message: "Project delete success", data });
            }).catch((error) => {
                res.status(200).json({ error: error.message });
            });
        } else {
            res.status(400).json({ error: "Project not found or unauthorized" });
        }
    } else if (req.user.managerData) {


        const assigneBy = req.user.managerData._id;
        const project = await projectSchema.findOne({ _id: req.query.id, assigneBy: assigneBy });

        if (project) {
            await projectSchema.findByIdAndDelete(req.query.id).then((data) => {
                res.status(200).json({ message: "Project delete success", data });
            }).catch((error) => {
                res.status(200).json({ error: error.message });
            });
        } else {
            res.status(400).json({ error: "Project not found or unauthorized" });
        }
    } else {
        res.status(400).json({ error: "Unauthorized user" });
    }
}

module.exports.updateProject = async (req, res) => {
    if (req.user.adminData) {
        const assigneBy = req.user.adminData._id;
        const project = await projectSchema.findOne({ _id: req.query.id, assigneBy: assigneBy });

        if (project) {
            const managerId = req.body.managerId;
            if (managerId) {
                const manager = await managerSchema.findOne({ _id: managerId, adminId: assigneBy });
                if (!manager) {
                    return res.status(400).json({ error: "Manager not found or unauthorized" });
                }
            }

            await projectSchema.findByIdAndUpdate(req.query.id, { ...req.body, assigneTo: managerId }).then(async (data) => {
                const populatedProject = await projectSchema.findById(data._id).populate('assigneTo', 'name');
                res.status(200).json({ message: "Project update success", data: populatedProject });
            }).catch((error) => {
                res.status(200).json({ error: error.message });
            });
        } else {
            res.status(400).json({ error: "Project not found or unauthorized" });
        }
    } else if (req.user.managerData) {
        const assigneBy = req.user.managerData._id;
        const project = await projectSchema.findOne({ _id: req.query.id, assigneBy: assigneBy });

        if (project) {
            const employeeId = req.body.employeeId;
            if (employeeId) {
                const employee = await employeeSchema.findOne({ _id: employeeId, managerId: assigneBy });
                if (!employee) {
                    return res.status(400).json({ error: "Employee not found or unauthorized" });
                }
            }

            await projectSchema.findByIdAndUpdate(req.query.id, { ...req.body, assigneTo: employeeId }).then(async (data) => {
                const populatedProject = await projectSchema.findById(data._id).populate('assigneTo', 'name');
                res.status(200).json({ message: "Project update success", data: populatedProject });
            }).catch((error) => {
                res.status(200).json({ error: error.message });
            });
        } else {
            res.status(400).json({ error: "Project not found or unauthorized" });
        }
    } else {
        res.status(400).json({ error: "Unauthorized user" });
    }
}

module.exports.statusUpdate = async (req, res) => {
    if (req.user.managerData) {
        const assigneBy = req.user.managerData._id;
        const project = await projectSchema.findOne({ _id: req.query.id, assigneTo: assigneBy });

        if (project) {
            const newStatus = project.status === 'notstart' ? 'ongoing' : 'completed';
            await projectSchema.findByIdAndUpdate(req.query.id, { status: newStatus }).then(async (data) => {
                const populatedProject = await projectSchema.findById(data._id).populate('assigneTo', 'name').populate('assigneBy', 'name');
                res.status(200).json({ message: "Project status update success", data: populatedProject });
            }).catch((error) => {
                res.status(200).json({ error: error.message });
            });
        } else {
            res.status(400).json({ error: "Project not found or unauthorized" });
        }
    } else if (req.user.employeeData) {
        const assigneTo = req.user.employeeData._id;
        const project = await projectSchema.findOne({ _id: req.query.id, assigneTo: assigneTo });

        if (project) {
            const newStatus = project.status === 'notstart' ? 'ongoing' : 'completed';
            await projectSchema.findByIdAndUpdate(req.query.id, { status: newStatus }).then(async (data) => {
                const populatedProject = await projectSchema.findById(data._id).populate('assigneTo', 'name').populate('assigneBy', 'name');
                res.status(200).json({ message: "Project status update success", data: populatedProject });
            }).catch((error) => {
                res.status(200).json({ error: error.message });
            });
        } else {
            res.status(400).json({ error: "Project not found or unauthorized" });
        }
    } else {
        res.status(400).json({ error: "Unauthorized user" });
    }
    }
