var HTTP_PORT = process.env.PORT || 8080;
var express = require('express');
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

app.listen(HTTP_PORT, () => {
	console.log('app is running');
});
