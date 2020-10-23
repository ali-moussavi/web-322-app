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
const multer = require("multer");
const fs = require("fs");
const bodyParser = require('body-parser')
const options = { root: path.join(__dirname) };

var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
	destination: "./public/images/uploaded",
	filename: function (req, file, cb) {
	  
	  cb(null, Date.now() + path.extname(file.originalname));
	}
  });
  
  // tell multer to use the diskStorage function for naming files instead of the default.
  const upload = multer({ storage: storage });

app.get('/', (req, res) => {
	res.sendFile('/views/home.html', options);
});

app.get('/about', (req, res) => {
	res.sendFile('/views/about.html', options);
});

app.get('/employees/add', (req, res) => {
	res.sendFile('/views/addEmployee.html', options);
});

app.get('/images/add', (req, res) => {
	res.sendFile('/views/addImage.html', options);
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
			res.json(departments);
		})
		.catch((err) => {
			console.log(err);
			res.json(err);
		});
});

app.get('/employees', (req, res) => {
	return new Promise(function (resolve, reject) {
		if (req.query.status) {
			resolve(dataService.getEmployeeByStatus(req.query.status));
		} 
		else if (req.query.department) {
			resolve(dataService.getEmployeeByDepartment(req.query.department))
		} 
		else {
			resolve(dataService.getAllEmployees());
		}
	})
	.then((employees) => {
		res.json(employees);
	})
	.catch((err) => {
		console.log(err);
		res.json(err);
	});
});

app.get('/images/', (req, res) => {
	const response = {};
	fs.readdir(path.join(__dirname,'/public/images/uploaded'), function (err, items) {
		if (err) {
			console.log(err);
			res.status(400).json("Something went wrong");
		}
		response.images = items;
		res.json(response);
	})
});


app.post("/images/add", upload.single("imageFile"), (req, res) => {
	res.redirect("/images")
});


app.post("/employees/add", (req, res) => {
	console.log(req.body);
	dataService.addEmployee(req.body).then((data)=>{
		res.redirect('/employees')
	}).catch((err) => {
		console.log(err);
		res.json(err);
	})
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
