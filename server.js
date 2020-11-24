/*********************************************************************************
 * WEB322 – Assignment 02
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name:Seyed Mohammad Ali Lohmousavi Student ID:159309186 Date:10/5/2020
 *
 * Online (Heroku) Link: https://web322assignmnt.herokuapp.com/
 *
 ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;

var express = require('express');
const dataService = require('./data-service.js');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const options = {
	root: path.join(__dirname)
};

var app = express();
app.use(express.static('public'));
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.engine(
	'.hbs',
	exphbs({
		extname: '.hbs',
		defaultLayout: 'main',
		helpers: {
			navLink: function(url, options) {
				return (
					'<li' +
					(
						url == app.locals.activeRoute ? ' class="active" ' :
						'') +
					'><a href="' +
					url +
					'">' +
					options.fn(this) +
					'</a></li>'
				);
			},
			equal: function(lvalue, rvalue, options) {
				if (arguments.length < 3)
					throw new Error('Handlebars Helper equal needs 2 parameters');
				if (lvalue != rvalue) {
					return options.inverse(this);
				} else {
					return options.fn(this);
				}
			}
		}
	})
);
app.set('view engine', '.hbs');

app.use(function(req, res, next) {
	let route = req.baseUrl + req.path;
	app.locals.activeRoute =

			route == '/' ? '/' :
			route.replace(/\/$/, '');
	next();
});

const storage = multer.diskStorage({
	destination: './public/images/uploaded',
	filename: function(req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname));
	}
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({
	storage: storage
});

app.get('/', (req, res) => {
	res.render('home', {});
});

app.get('/about', (req, res) => {
	res.render('about', {});
});

app.get('/employees/add', (req, res) => {
	dataService.getDepartments().then((data) => {
		res.render('addEmployee', { departments: data });
	});
});

app.get('/departments/add', (req, res) => {
	res.render('addDepartment', {});
});

app.get('/images/add', (req, res) => {
	res.render('addImage', {});
});

app.get('/managers', (req, res) => {
	dataService
		.getManagers()
		.then((managers) => {
			res.json(managers);
		})
		.catch((err) => {
			console.log(err);
			res.json(err);
		});
});

app.get('/departments', (req, res) => {
	dataService
		.getDepartments()
		.then((departments) => {
			res.render('departments', { departments: departments });
		})
		.catch((err) => {
			console.log(err);
			res.render('departments', { message: 'no departments' });
		});
});

app.get('/employees', (req, res) => {
	return new Promise(function(resolve, reject) {
		if (req.query.status) {
			resolve(dataService.getEmployeeByStatus(req.query.status));
		} else if (req.query.department) {
			resolve(dataService.getEmployeeByDepartment(req.query.department));
		} else if (req.query.manager) {
			resolve(dataService.getEmployeeByManager(req.query.manager));
		} else {
			resolve(dataService.getAllEmployees());
		}
	})
		.then((employees) => {
			if (employees.length > 0) {
				res.render('employees', { employees: employees });
			} else {
				res.render('employees', { message: 'no results' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.render('employees', { message: 'no results' });
		});
});

app.get('/employee/:num', (req, res) => {
	// dataService
	// 	.getEmployeeByNum(req.params.num)
	// 	.then((data) => {
	// 		res.render('employee', { employee: data[0] });
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 		res.status(400).json(err);
	// 	});

	let viewData = {};
	dataService
		.getEmployeeByNum(req.params.num)
		.then((data) => {
			if (data) {
				console.log(data);
				viewData.employee = data[0]; //store employee data in the "viewData" object as "employee"
			} else {
				viewData.employee = null; // set employee to null if none were returned
			}
		})
		.catch(() => {
			viewData.employee = null; // set employee to null if there was an error
		})
		.then(dataService.getDepartments)
		.then((data) => {
			viewData.departments = data; // store department data in the "viewData" object as "departments"
			// loop through viewData.departments and once we have found the departmentId that matches
			// the employee's "department" value, add a "selected" property to the matching
			// viewData.departments object
			for (let i = 0; i < viewData.departments.length; i++) {
				if (
					viewData.departments[i].departmentId == viewData.employee.department
				) {
					viewData.departments[i].selected = true;
				}
			}
		})
		.catch(() => {
			viewData.departments = []; // set departments to empty if there was an error
		})
		.then(() => {
			if (viewData.employee == null) {
				// if no employee - return an error
				res.status(404).send('Employee Not Found');
			} else {
				res.render('employee', { viewData: viewData }); // render the "employee" view
			}
		});
});

app.get('/department/:num', (req, res) => {
	dataService
		.getDepartmentById(req.params.num)
		.then((data) => {
			// console.log(data);
			if (data[0]) {
				res.render('department', { department: data[0] });
			} else {
				res.status(404).send('Department Not Found');
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(404).send('Department Not Found');
		});
});

app.get('/employees/delete/:empNum', (req, res) => {
	dataService
		.deleteEmployeeByNum(req.params.empNum)
		.then(() => {
			res.redirect('/employees');
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send('Unable to Remove Employee / Employee not found');
		});
});

app.get('/images/', (req, res) => {
	const response = {};
	fs.readdir(path.join(__dirname, '/public/images/uploaded'), function(err, items) {
		if (err) {
			console.log(err);
			res.status(400).json('Something went wrong');
		}
		response.images = items;
		res.render('images', { data: response.images });
	});
});

app.post('/images/add', upload.single('imageFile'), (req, res) => {
	res.redirect('/images');
});

app.post('/employees/add', (req, res) => {
	// console.log(req.body);
	dataService
		.addEmployee(req.body)
		.then((data) => {
			res.redirect('/employees');
		})
		.catch((err) => {
			console.log(err);
			res.json(err);
		});
});

app.post('/employee/update', (req, res) => {
	console.log(req.body);
	dataService
		.updateEmployee(req.body)
		.then(() => {
			res.redirect('/employees');
		})
		.catch((err) => {
			res.status(500).send('Unable to Update Employee');
		});
});

app.post('/departments/add', (req, res) => {
	// console.log(req.body);
	dataService
		.addDepartment(req.body)
		.then(() => {
			res.redirect('/departments');
		})
		.catch((err) => {
			console.log(err);
			res.json(err);
		});
});

app.post('/department/update', (req, res) => {
	console.log(req.body);
	dataService
		.updateDeparment(req.body)
		.then(() => {
			res.redirect('/departments');
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

app.use((req, res) => {
	res.status(404).sendFile('/views/404.html', options);
});

dataService
	.initialize()
	.then(() => {
		app.listen(HTTP_PORT, () => {
			console.log('app is running');
		});
	})
	.catch((err) => {
		console.log(err);
	});
