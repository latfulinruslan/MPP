const fs = require("fs-extra");
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const usersDB = "users.json";

function CheckUsername(username, users) {
    let free = true;
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.username === username) {           
            free = false
            break;
        }
    }

    return free;
}

function GetUser(userName) {
	let content = fs.readFileSync(usersDB, "utf8");
	let users = JSON.parse(content);
	let user = null;

	for (var i = users.length - 1; i >= 0; i--) {
		if (users[i].username == userName) {
			user = users[i];
			break;
		}
	}

	return user;
}

function GetUsers() {
	let data = "";
	let users = [];

	try {
		data = fs.readFileSync(usersDB, "utf8");
	} catch(error) {
		console.error(error);	
	}

	try {
		users = JSON.parse(data);
	} catch(error) {
		console.error(error);
		fs.writeFileSync(usersDB, '[]');
		users = [];
	}

	return users;
}

function RewriteUsers(users) {
	let data = JSON.stringify(users);
	fs.writeFileSync(usersDB, data);
}

module.exports.register = function(request, response) {
    if(!request.body) return response.status(400).send({status: 'error', msg: 'Empty body of request'});
    
    let users = GetUsers();
    let isFree = CheckUsername(request.body.username, users);

    if (isFree) {
        let user = {
            id: null,
            username: request.body.username,
            password: bcrypt.hashSync(request.body.password, saltRounds),
            privileges: "user",
        };


        let maxId = Math.max.apply(Math, users.map(parseUser => parseUser.id));

        if (maxId == Infinity) {
            maxId = 0;
        }

        user.id = maxId + 1;
        
        users.push(user);
        console.log('REGISTERED', user);
        RewriteUsers(users);
        response.status(200).send({status: 'success', msg: 'User registered!'});
    } else {
        response.status(409).send({status: 'error', msg: 'User with this username already exists'});
    }
}

module.exports.login = function(request, response, next) {
    if(!request.body) return response.status(400).send({status: 'error', msg: 'Empty body of request'});
    let password = request.body.password;
    let username = request.body.username;
    let user = GetUser(username);

    if (user === null) {
        response.status(409).send({status: 'error', msg: 'Incorrect username'});
    } else if (bcrypt.compareSync(password, user.password)) {
        console.log('LOGIN', user);
        const token = jwt.sign({id: user.id}, request.app.get('secretKey'), {expiresIn: '24h'})
        response.status(200).send({status: 'success', msg: 'User logged in', token: token, username: user.username, id: user.id})
    } else {
        response.status(409).send({status: 'error', msg: 'Incorrect password'});
    } 
}

module.exports.verify = function(request, response) {
    console.log('VERIFY', request);
}