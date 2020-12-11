var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

// mongoose.connect(
// 	'mongodb+srv://smapro:<QLxIGShC9h6mhT1O>@web322-a6.mm7s3.mongodb.net/<dbname>?retryWrites=true&w=majority'
// );

var userSchema = new Schema({
	userName: { type: String, unique: true },
	password: String,
	email: String,
	loginHistory: [ { dateTime: Date, userAgent: String } ]
});

let pass = encodeURIComponent('QLxIGShC9h6mhT1O');

let User;

const initialize = (params) => {
	return new Promise((resolve, reject) => {
		let db = mongoose.createConnection(
			`mongodb+srv://smapro:${pass}@web322-a6.mm7s3.mongodb.net/<dbname>?retryWrites=true&w=majority`,
			{ useNewUrlParser: true, useUnifiedTopology: true }
		);
		db.on('error', (err) => {
			reject(err); // reject the promise with the provided error
		});
		db.once('open', () => {
			User = db.model('users', userSchema);
			resolve();
		});
	});
};

const registerUser = (userData) => {
	return new Promise((resolve, reject) => {
		if (userData.password != userData.password2) {
			reject('Passwords do not match');
		} else {
			bcrypt.genSalt(10, function(err, salt) {
				if (err) {
					reject(err);
				}
				bcrypt.hash(userData.password, salt, function(err, hash) {
					if (err) {
						reject(err);
					}

					delete userData.password2;
					userData.password = hash;
					let newUser = new User(userData);
					newUser.save((err) => {
						if (!err) {
							resolve();
						} else if (err.code == 11000) {
							reject('User Name already taken');
						} else if (err.code != 11000) {
							reject(`There was an error creating the user: ${err}`);
						}
					});
				});
			});
		}
	});
};

const checkUser = (userData) => {
	return new Promise((resolve, reject) => {
		User.find({ userName: userData.userName }).exec().then((users) => {
			if (!users) {
				reject(`Unable to find user : ${userData.userName}`);
			}
			bcrypt.compare(userData.password, users[0].password).then((res) => {
				if (!res) {
					reject(`Incorrect password for user: ${userData.userName}`);
				} else {
					users[0].loginHistory.push({
						dateTime: new Date().toString(),
						userAgent: userData.userAgent
					});

					User.updateOne(
						{ userName: userData.userName },
						{ $set: { loginHistory: users[0].loginHistory } }
					)
						.exec()
						.then(() => {
							resolve(users[0]);
						})
						.catch((err) => {
							reject(`There was an error verifying the user: ${err}`);
						});
				}
			});
		});
	});
};

module.exports = {
	checkUser,
	registerUser,
	initialize
};
