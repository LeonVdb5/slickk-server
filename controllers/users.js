const JWT = require('jsonwebtoken')
const jwt = require('jwt-simple') //token creation package 
const createUser = require('../actions/signUp')
const bcrypt = require('bcrypt')
const db = require('../db/index');

// const {JWT_SECRET} = require(config) //need to set this up 

signToken = user => {
	return JWT.sign({
		sub: user.username,
		iat: new Date().getTime(), //time of token creation
		exp: new Date().setDate( new Date().getDate() + 1 ) // expires in 1 day 
	}, 'temp')
}

const login = (req, res, next) => {
	console.log('I made it here');
	let token = signToken(req.user); 
	res.send({token: token}) 
}

//create user and send token to client
const register = (req, res, next) => {
	const {email, username, password} = req.body; 
	if (!email || !username || !password) {
		res.status(422).send({error: 'enter email and password'})
	}
	//Make sure email and username doesn't already exist 
	const saltRounds = 10; //to what power the hash functions runs
	//hash the password and pass it to createUser function to populate the database 
	bcrypt.hash(password, saltRounds)
	.then(hashedPassword => {
		db('users')
		.insert({
			username: username,
			email: email,
			first_name: '',
			last_name: '',
			password: hashedPassword,
			user_type: 'non-admin',
			face_shape: '',
			hair_type: '',
			hair_length: ''
		})
		.then(resp => {
			res.json({token: signToken({email, username, password})}) //return token to client
		})
		.catch(error => {
			console.log('error was HERE');
			console.log(error);
			res.json({error: error})
		})
	})
	.catch(error => {
		console.log('ERROR WAS CAUGHT IN CATCH');
		res.json({error}); //error hashing password 
	})
}


module.exports = {register, login}





