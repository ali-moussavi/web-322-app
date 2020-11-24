// const fs = require('fs');
const Sequelize = require('sequelize');
let sequelize = new Sequelize(
	'd5pu8a4gohkkgj',
	'qpjfeugpaqgvbp',
	'e9be70b705fe76ddabd44220e314c72c7f2db4b1adc98a675c4e416ab4e8af3e',
	{
		host: 'ec2-54-157-66-140.compute-1.amazonaws.com',
		dialect: 'postgres',
		port: 5432,
		dialectOptions: {
			ssl: { rejectUnauthorized: false }
		}
	}
);

let Employees = sequelize.define('Employees', {
	employeeNum: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	firstName: Sequelize.STRING,
	lastName: Sequelize.STRING,
	email: Sequelize.STRING,
	SSN: Sequelize.STRING,
	addressStreet: Sequelize.STRING,
	addressCity: Sequelize.STRING,
	addressState: Sequelize.STRING,
	addressPostal: Sequelize.STRING,
	maritalStatus: Sequelize.STRING,
	isManager: Sequelize.BOOLEAN,
	employeeManagerNum: Sequelize.INTEGER,
	status: Sequelize.STRING,
	department: Sequelize.INTEGER,
	hireDate: Sequelize.STRING
});

let Departments = sequelize.define('Departments', {
	departmentId: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	departmentName: Sequelize.STRING
});

const initialize = () => {
	return new Promise((resolve, reject) => {
		sequelize
			.sync()
			.then(function() {
				resolve('succesfuly retrived data');
			})
			.catch((err) => {
				console.log(err);
				reject('unable to sync with database');
			});
	});
};

const getAllEmployees = () => {
	return new Promise(function(resolve, reject) {
		Employees.findAll()
			.then((data) => {
				data = data.map((value) => value.dataValues);
				resolve(data);
			})
			.catch((err) => {
				reject('no results returned');
				console.log(err);
			});
	});
};

const getEmployeeByStatus = (status) => {
	return new Promise(function(resolve, reject) {
		Employees.findAll({
			where: {
				status: status
			}
		})
			.then((data) => {
				data = data.map((value) => value.dataValues);
				resolve(data);
			})
			.catch((err) => {
				reject('no results returned');
				console.log(err);
			});
	});
};

const getEmployeeByDepartment = (department) => {
	return new Promise(function(resolve, reject) {
		Employees.findAll({
			where: {
				department: department
			}
		})
			.then((data) => {
				data = data.map((value) => value.dataValues);
				resolve(data);
			})
			.catch((err) => {
				reject('no results returned');
				console.log(err);
			});
	});
};

const getEmployeeByManager = (managerNum) => {
	return new Promise(function(resolve, reject) {
		Employees.findAll({
			where: {
				employeeManagerNum: managerNum
			}
		})
			.then((data) => {
				data = data.map((value) => value.dataValues);
				resolve(data);
			})
			.catch((err) => {
				reject('no results returned');
				console.log(err);
			});
	});
};

const getEmployeeByNum = (employeeNum) => {
	return new Promise(function(resolve, reject) {
		Employees.findAll({
			where: {
				employeeNum: employeeNum
			}
		})
			.then((data) => {
				data = data.map((value) => value.dataValues);
				resolve(data);
			})
			.catch((err) => {
				reject('no results returned');
				console.log(err);
			});
	});
};

const getManagers = () => {
	return new Promise(function(resolve, reject) {
		Employees.findAll({
			where: {
				isManager: true
			}
		})
			.then((data) => {
				data = data.map((value) => value.dataValues);
				resolve(data);
			})
			.catch((err) => {
				reject('no results returned');
				console.log(err);
			});
	});
};

const getDepartments = () => {
	return new Promise(function(resolve, reject) {
		Departments.findAll()
			.then((data) => {
				data = data.map((value) => value.dataValues);
				resolve(data);
			})
			.catch((err) => {
				reject('no results returned');
				console.log(err);
			});
	});
};

const addEmployee = (employeeData) => {
	return new Promise(function(resolve, reject) {
		if (employeeData) {
			employeeData.isManager = Boolean(employeeData.isManager);
			for (const key in employeeData) {
				if (employeeData[key] == '') {
					employeeData[key] = null;
				}
			}
			Employees.create(employeeData)
				.then(() => {
					resolve('employee created successfuly');
				})
				.catch((err) => {
					console.log(err);
					reject('unable to create employee');
				});
		} else {
			reject('employee data was empty');
		}
	});
};

const updateEmployee = (employeeData) => {
	return new Promise((resolve, reject) => {
		employeeData.isManager =

				employeeData.isManager == 'on' ? true :
				false;
		for (const key in employeeData) {
			if (employeeData[key] == '') {
				employeeData[key] = null;
			}
		}

		Employees.update(employeeData, {
			where: { employeeNum: employeeData.employeeNum }
		})
			.then(() => {
				resolve('employee info updated successfuly');
			})
			.catch((err) => {
				console.log(err);
				reject('unable to update employee');
			});
	});
};

const addDepartment = (departmentData) => {
	return new Promise((resolve, reject) => {
		for (const key in departmentData) {
			if (departmentData[key] == '') {
				departmentData[key] = null;
			}
		}

		Departments.create(departmentData)
			.then(() => {
				resolve('department created successfuly');
			})
			.catch((err) => {
				console.log(err);
				reject('unable to create department');
			});
	});
};

const updateDeparment = (departmentData) => {
	return new Promise((resolve, reject) => {
		for (const key in departmentData) {
			if (departmentData[key] == '') {
				departmentData[key] = null;
			}
		}

		Departments.update(departmentData, {
			where: { departmentId: departmentData.departmentId }
		})
			.then(() => {
				resolve('department info updated successfuly');
			})
			.catch((err) => {
				console.log(err);
				reject('unable to add department');
			});
	});
};

const getDepartmentById = (id) => {
	return new Promise(function(resolve, reject) {
		Departments.findAll({
			where: {
				departmentId: id
			}
		})
			.then((data) => {
				data = data.map((value) => value.dataValues);
				resolve(data);
			})
			.catch((err) => {
				reject('no results returned');
				console.log(err);
			});
	});
};

const deleteEmployeeByNum = (empNum) => {
	return new Promise((resolve, reject) => {
		Employee.destroy({
			where: { employeeNum: empNum }
		})
			.then(() => {
				resolve('destroyed');
			})
			.catch((err) => {
				console.log(err);
				reject('unable to delete employee');
			});
	});
};

module.exports = {
	initialize,
	getAllEmployees,
	getManagers,
	getDepartments,
	addEmployee,
	getEmployeeByStatus,
	getEmployeeByDepartment,
	getEmployeeByManager,
	getEmployeeByNum,
	updateEmployee,
	addDepartment,
	getDepartmentById,
	updateDeparment,
	deleteEmployeeByNum
};
