const JWT = require('jsonwebtoken')
const jwt = require('jwt-simple') //token creation package 
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
	const {email, username, password} = req.user;
	console.log('logging user');
	console.log(email);
	console.log(req.user);
	res.cookie('access_token', signToken({email, username, password}))
		// httpOnly: true //prevent javascript access to cookie on front-end 
	res.status(200).json({user: req.user})
	// res.json({token: signToken({email, username, password})})
}

//create user and send token to client
const register = async (req, res, next) => {
	console.log('BEFORE UNDEFINED');
	console.log(req);
	const {email, username, password} = req.body; 
	if (!email || !username || !password) {
		res.status(422).send({error: 'enter email and password'})
	}

	// //Make sure email and username doesn't already exist 
	const saltRounds = 10; //to what power the hash functions runs
	//hash the password and add new user to database 
	await bcrypt.hash(password, saltRounds)
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
		//wrap token in cookie and return to client 
		.then(()=> {
			res.cookie('access_token', signToken({email, username, password}), 
				//httpOnly: true //prevent javascript access to cookie on front-end 
			)
			res.json({success: true})
		})
		.catch(error => {
			//username or email already taken 
			res.status(403).json({error: error})
		})
	})
	.catch(error => {
		res.json({error}); //error hashing password 
	})
}

const signOut = (req, res, next) => {
	res.clearCookie('access_token'); //clear cookie
	res.json({success: 'successfully logged out'});

}

const checkAuth = (req, res, next) => {
	console.log('I managed to get to checkAuth');
	res.json({success: true});

}




module.exports = {register, login, signOut, checkAuth}





