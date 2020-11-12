const fs = require('fs');

let employees = [];
let departments = [];

const initialize = () => {
	return new Promise(function(resolve, reject) {
		fs.readFile(`${__dirname}/data/employees.json`, (err, data) => {
			if (err) {
				reject(err);
			} else {
				employees = JSON.parse(data);
				resolve('success');
			}
		});
	})
		.then(() => {
			fs.readFile(`${__dirname}/data/departments.json`, (err, data) => {
				if (err) {
					throw err;
				} else {
					departments = JSON.parse(data);
				}
			});
		})
		.then(() => {
			return 'succesfuly retrived data';
		})
		.catch((err) => {
			return err;
		});
};

const getAllEmployees = () => {
	return new Promise(function(resolve, reject) {
		if (employees.length > 0) {
			resolve(employees);
		} else {
			reject('no results returned');
		}
	});
};

const getEmployeeByStatus = (status) => {
	return new Promise((resolve, reject) => {
		const result = employees.filter((emp) => emp.status == status);
		if (result.length) {
			resolve(result);
		} else {
			reject('no employee with this status exists');
		}
	});
};

const getEmployeeByDepartment = (department) => {
	return new Promise((resolve, reject) => {
		const result = employees.filter((emp) => emp.department == department);
		if (result.length) {
			resolve(result);
		} else {
			reject('no results returned');
		}
	});
};

const getEmployeeByManager = (managerNum) => {
	return new Promise((resolve, reject) => {
		const result = employees.filter((emp) => emp.employeeManagerNum == managerNum);
		if (result.length) {
			resolve(result);
		} else {
			reject('no results returned');
		}
	});
};

const getEmployeeByNum = (employeeNum) => {
	return new Promise((resolve, reject) => {
		const result = employees.filter((emp) => emp.employeeNum == employeeNum);
		if (result.length) {
			resolve(result);
		} else {
			reject('no results returned');
		}
	});
};

const getManagers = () => {
	return new Promise(function(resolve, reject) {
		const managers = employees.filter((emp) => emp.isManager == true);

		console.log(managers);
		if (managers.length > 0) {
			resolve(managers);
		} else {
			reject('no resluts returned');
		}
	});
};

const getDepartments = () => {
	return new Promise(function(resolve, reject) {
		if (departments.length > 0) {
			resolve(departments);
		} else {
			reject('no results returned');
		}
	});
};

const addEmployee = (employeeData) => {
	return new Promise(function(resolve, reject) {
		if (employeeData) {
			employeeData.isManager = Boolean(employeeData.isManager);
			employeeData.employeeNum = employees.length + 1;
			employees.push(employeeData);
			resolve();
		} else {
			reject('employee data was empty');
		}
	});
};

const updateEmployee = (employeeData) => {
	return new Promise((resolve, reject) => {
		for (let i = 0; i < employees.length; i++) {
			if (employees[i].employeeNum == employeeData.employeeNum) {
				employees[i] = employeeData;
				employees[i].isManager =

						employees[i].isManager == 'on' ? true :
						false;
				resolve();
				break;
			}
		}

		reject('employee not found');
	});
};

initialize();

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
	updateEmployee
};
