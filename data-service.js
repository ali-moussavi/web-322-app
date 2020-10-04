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

initialize();

module.exports = {
	initialize,
	getAllEmployees,
	getManagers,
	getDepartments
};
