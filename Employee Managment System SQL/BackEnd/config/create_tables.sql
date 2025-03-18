-- Create table for admins
CREATE TABLE admins (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1000),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    gender VARCHAR(50) NOT NULL,
    resetOtp VARCHAR(6)
);

-- Create table for managers
CREATE TABLE managers (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 2000),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    salary NUMERIC NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'manager',
    resetOtp VARCHAR(6),
    adminId INT REFERENCES admins(id),
    UNIQUE (id, name) 
);

-- Create table for employees
CREATE TABLE employees (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 3000),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    salary NUMERIC NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    resetOtp VARCHAR(6),
    adminId INT REFERENCES admins(id),
    managerId INT REFERENCES managers(id),
    UNIQUE (id, name)
);

-- Create table for projects
CREATE TABLE projects (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 4000),
    projectName VARCHAR(255) NOT NULL,
    projectDescription TEXT NOT NULL,
    assigneToEmployee INT, 
    assigneToManager INT,  
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    assigneByAdmin INT,   
    assigneByManager INT, 
    assigneToRole VARCHAR(50) NOT NULL CHECK (assigneToRole IN ('employee', 'manager')),
    assigneByRole VARCHAR(50) NOT NULL CHECK (assigneByRole IN ('admin', 'manager')),
    FOREIGN KEY (assigneToEmployee) REFERENCES employees(id),
    FOREIGN KEY (assigneToManager) REFERENCES managers(id),
    FOREIGN KEY (assigneByAdmin) REFERENCES admins(id),
    FOREIGN KEY (assigneByManager) REFERENCES managers(id)
);
