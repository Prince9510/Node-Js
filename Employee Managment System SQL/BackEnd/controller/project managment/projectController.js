const pool = require('../../config/db');

module.exports.assigneProject = async (req, res) => {
  if (req.user.adminData) {
    const managerId = req.body.managerid;
    const adminId = req.user.adminData.id;

    if (!managerId) {
      return res.status(400).json({ error: "Manager ID is required" });
    }

    const manager = await pool.query('SELECT * FROM managers WHERE id = $1', [managerId]);
    if (!manager.rows.length) {
      return res.status(400).json({ error: "Invalid Manager ID" });
    }

    const projectData = {
      ...req.body,
      assigneToManager: managerId,
      assigneByAdmin: adminId,
      assigneToRole: "manager",
      assigneByRole: "admin"
    };

    await pool.query('INSERT INTO projects (projectName, projectDescription, assigneToManager, priority, status, startDate, endDate, assigneByAdmin, assigneToRole, assigneByRole) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', 
    [projectData.projectName, projectData.projectDescription, projectData.assigneToManager, projectData.priority, projectData.status, projectData.startDate, projectData.endDate, projectData.assigneByAdmin, projectData.assigneToRole, projectData.assigneByRole])
    .then(async (data) => {
      res.status(200).json({ "project Data": data.rows[0] });
    }).catch((error) => {
      res.status(400).json({ error: error.message });
    });

  } else if (req.user.managerData) {
    const employeeId = req.body.employeeid;
    const managerId = req.user.managerData.id;

    if (!employeeId) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const employee = await pool.query('SELECT * FROM employees WHERE id = $1', [employeeId]);
    if (!employee.rows.length) {
      return res.status(400).json({ error: "Invalid Employee ID" });
    }

    const projectData = {
      ...req.body,
      assigneToEmployee: employeeId,
      assigneByManager: managerId,
      assigneToRole: "employee",
      assigneByRole: "manager"
    };

    await pool.query('INSERT INTO projects (projectName, projectDescription, assigneToEmployee, priority, status, startDate, endDate, assigneByManager, assigneToRole, assigneByRole) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', 
    [projectData.projectName, projectData.projectDescription, projectData.assigneToEmployee, projectData.priority, projectData.status, projectData.startDate, projectData.endDate, projectData.assigneByManager, projectData.assigneToRole, projectData.assigneByRole])
    .then(async (data) => {
      res.status(200).json({ "project Data": data.rows[0] });
    }).catch((error) => {
      res.status(400).json({ error: error.message });
    });
  } else {
    return res.status(400).json({ error: "Unauthorized user" });
  }
};

module.exports.viewProject = async (req, res) => {
  if (req.user.adminData) {
    const allProject = await pool.query(`
      SELECT projects.id, projects.projectName, projects.projectDescription, projects.priority, projects.status, projects.startDate, projects.endDate, projects.assigneToManager, projects.assigneByAdmin, 
      projects.assigneToRole, projects.assigneByRole, managers.name as assigneTo
      FROM projects
      JOIN managers ON projects.assigneToManager = managers.id
      WHERE projects.assigneByAdmin = $1
    `, [req.user.adminData.id]);

    const adminProjects = allProject.rows;
    const adminProjectsLength = adminProjects.length

    res.status(200).json({
      message: "admin",
      adminProjects,
      adminProjectsLength
    });
  } else if (req.user.managerData) {
    const assigneToOwnEmployee = await pool.query(`
      SELECT projects.id, projects.projectName, projects.projectDescription, projects.priority, projects.status, 
             projects.startDate, projects.endDate, projects.assigneToEmployee, projects.assigneByManager,
             projects.assigneToRole, projects.assigneByRole, 
             managers.name as assigneBy,
             employees.name as assigneTo
             FROM projects
             JOIN managers ON projects.assigneByManager = managers.id 
             JOIN employees ON projects.assigneToEmployee = employees.id
             WHERE projects.assigneByManager = $1  
    `,[req.user.managerData.id]);
    
    const assigneMeProjects = await pool.query(`
      SELECT 
      projects.id, projects.projectName, projects.projectDescription, projects.priority, projects.status, 
             projects.startDate, projects.endDate, projects.assigneByAdmin,
             projects.assigneToRole, projects.assigneByRole, 
             admins.name as assigneBy,
             managers.name as assigneTo 
             FROM projects
             JOIN admins ON assigneByAdmin = admins.id
             JOIN managers ON projects.assigneTOManager = managers.id
             WHERE projects.assigneToManager = $1  
    `,[req.user.managerData.id]);

    const allManagerProject = assigneToOwnEmployee.rows.length + assigneMeProjects.rows.length

    res.status(200).json({
      message: "manager",
      assigneToOwnEmployee: assigneToOwnEmployee.rows,
      assigneMeProjects: assigneMeProjects.rows,
      allManagerProject
    });
  } else if (req.user.employeeData) {
    const allProject = await pool.query(`
      SELECT
     projects.id, projects.projectName, projects.projectDescription, projects.priority, projects.status, 
             projects.startDate, projects.endDate, projects.assigneByManager, projects.assigneToRole, projects.assigneByRole, 
             managers.name as assigneBy, 
             employees.name as assigneTo 
             FROM projects
             JOIN managers ON assigneByManager = managers.id
             JOIN employees ON assigneToEmployee = employees.id 
             WHERE projects.assigneToEmployee = $1 
    `,[req.user.employeeData.id]);

    const employeeProjects = allProject.rows;
    const employeeProjectsLength = employeeProjects.length

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
    const assigneBy = req.user.adminData.id;
    const project = await pool.query('SELECT * FROM projects WHERE id = $1 AND assigneByAdmin = $2', [req.query.id, assigneBy]);

    if (project.rows.length) {
      await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [req.query.id]).then((data) => {
        res.status(200).json({ message: "Project delete success", data: data.rows[0] });
      }).catch((error) => {
        res.status(200).json({ error: error.message });
      });
    } else {
      res.status(400).json({ error: "Project not found or unauthorized" });
    }
  } else if (req.user.managerData) {
    const assigneBy = req.user.managerData.id;
    const project = await pool.query('SELECT * FROM projects WHERE id = $1 AND assigneByManager = $2', [req.query.id, assigneBy]);

    if (project.rows.length) {
      await pool.query('DELETE FROM projects WHERE id = $1 RETURNING *', [req.query.id]).then((data) => {
        res.status(200).json({ message: "Project delete success", data: data.rows[0] });
      }).catch((error) => {
        res.status(400).json({ error: error.message });
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
    const assigneBy = req.user.adminData.id;
    const project = await pool.query('SELECT * FROM projects WHERE id = $1 AND assigneByAdmin = $2', [req.query.id, assigneBy]);

    if (project.rows.length) {
      const managerId = req.body.managerid || project.rows[0].assignetomanager; 
      if (managerId) {
        const manager = await pool.query('SELECT * FROM managers WHERE id = $1 AND adminId = $2', [managerId, assigneBy]);
        if (!manager.rows.length) {
          return res.status(400).json({ error: "Manager not found or unauthorized" });
        }
      }
      const assigneByRole = 'admin'
      const assigneToRole = 'manager'
      await pool.query('UPDATE projects SET projectName = $1, projectDescription = $2, assigneToManager = $3, priority = $4, status = $5, startDate = $6, endDate = $7, assigneByAdmin = $8, assigneToRole = $9, assigneByRole = $10 WHERE id = $11 RETURNING *', 
      [req.body.projectName, req.body.projectDescription, managerId, req.body.priority, req.body.status, req.body.startDate, req.body.endDate, assigneBy, assigneToRole, assigneByRole, req.query.id])
      .then((data) => {
        if (data.rows.length) {
          res.status(200).json({ message: "Project update success", data: data.rows[0] });
        } else {
          res.status(400).json({ error: "Project update failed" });
        }
      }).catch((error) => {
        res.status(400).json({ error: error.message });
      });
    } else {
      res.status(400).json({ error: "Project not found or unauthorized" });
    }
  } else if (req.user.managerData) {
    const assigneBy = req.user.managerData.id;
    const project = await pool.query('SELECT * FROM projects WHERE id = $1 AND assigneByManager = $2', [req.query.id, assigneBy]);

    if (project.rows.length) {
      const employeeId = req.body.employeeid || project.rows[0].assigneToEmployee; // Use existing employeeId if not provided
      if (employeeId) {
        const employee = await pool.query('SELECT * FROM employees WHERE id = $1 AND managerId = $2', [employeeId, assigneBy]);
        if (!employee.rows.length) {
          return res.status(400).json({ error: "Employee not found or unauthorized" });
        }
      }

      const assigneToRole = 'employee'
      const assigneByRole = 'manager'

      await pool.query('UPDATE projects SET projectName = $1, projectDescription = $2, assigneToEmployee = $3, priority = $4, status = $5, startDate = $6, endDate = $7, assigneByManager = $8, assigneToRole = $9, assigneByRole = $10 WHERE id = $11 RETURNING *', 
      [req.body.projectName, req.body.projectDescription, employeeId, req.body.priority, req.body.status, req.body.startDate, req.body.endDate, assigneBy, assigneToRole, assigneByRole, req.query.id])
      .then((data) => {
        if (data.rows.length) {
          res.status(200).json({ message: "Project update success", data: data.rows[0] });
        } else {
          res.status(400).json({ error: "Project update failed" });
        }
      }).catch((error) => {
        res.status(400).json({ error: error.message });
      });
    } else {
      res.status(400).json({ error: "Project not found or unauthorized" });
    }
  } else {
    res.status(400).json({ error: "Unauthorized user" });
  }
};

module.exports.statusUpdate = async (req, res) => {
  if (req.user.managerData) {
    const assigneBy = req.user.managerData.id;
    const project = await pool.query('SELECT * FROM projects WHERE id = $1 AND assigneToManager = $2', [req.query.id, assigneBy]);

    if (project.rows.length) {
      const newStatus = project.rows[0].status === 'notstart' ? 'ongoing' : 'completed';
      await pool.query('UPDATE projects SET status = $1 WHERE id = $2 RETURNING *', [newStatus, req.query.id])
      .then((data) => {
        res.status(200).json({ message: "Project status update success", data: data.rows[0] });
      }).catch((error) => {
        res.status(200).json({ error: error.message });
      });
    } else {
      res.status(400).json({ error: "Project not found or unauthorized" });
    }
  } else if (req.user.employeeData) {
    const assigneTo = req.user.employeeData.id;
    const project = await pool.query('SELECT * FROM projects WHERE id = $1 AND assigneToEmployee = $2', [req.query.id, assigneTo]);

    if (project.rows.length) {
      const newStatus = project.rows[0].status === 'notstart' ? 'ongoing' : 'completed';
      await pool.query('UPDATE projects SET status = $1 WHERE id = $2 RETURNING *', [newStatus, req.query.id])
      .then((data) => {
        res.status(200).json({ message: "Project status update success", data: data.rows[0] });
      }).catch((error) => {
        res.status(200).json({ error: error.message });
      });
    } else {
      res.status(400).json({ error: "Project not found or unauthorized" });
    }
  } else {
    res.status(400).json({ error: "Unauthorized user" });
  }
};