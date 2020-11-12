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
				if (arguments.length < 3) throw new Error('Handlebars Helper equal needs 2 parameters');
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
	res.render('addEmployee', {});
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
			res.render('employees', { employees: employees });
		})
		.catch((err) => {
			console.log(err);
			res.render('employees', { message: 'no results' });
		});
});

app.get('/employee/:num', (req, res) => {
	dataService
		.getEmployeeByNum(req.params.num)
		.then((data) => {
			res.render('employee', { employee: data[0] });
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
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
