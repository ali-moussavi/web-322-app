/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name:Seyed Mohammad Ali Lohmousavi Student ID:159309186 Date:10/5/2020
*
* Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;

var express = require('express');
const dataService = require('./data-service.js');
const path = require('path');
const options = { root: path.join(__dirname) };

var app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile('/views/home.html', options);
});

app.get('/about', (req, res) => {
	res.sendFile('/views/about.html', options);
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
	dataService
		.getAllEmployees()
		.then((employees) => {
			res.json(employees);
		})
		.catch((err) => {
			console.log(err);
			res.json(err);
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
