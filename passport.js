const passport = require('passport');
//jwt strategy 
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('./configuration'); 
const db = require('./db/index');
const bcrypt = require('bcrypt');

//local strategy 
const LocalStrategy = require ('passport-local').Strategy;

// const User = require('../models/user'); //Need to figure this out

//options for JwtStrategy 
const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'), //where is token contained (i.e., in the authorization field of the header)
	secretOrKey: JWT_SECRET 
}

// json web token strategy 
// passport.use( new JwtStrategy(opts, (payload, done) => { //payload is an object literal containing the unecoded payload data
// 	try {
// 		//find user specified in token
// 		const user = await User.findById(payload.sub); //sub is user.id

// 		//if user doesn't exist
// 		if (!user) {
// 			return done(null, false); 
// 		}
// 		//Otherwise, return the user (set as req.user)
// 		done(null, user);
// 	} catch(error) {
// 		done(error, false); 
// 	}
// }));

//options for local strategy 
// const localOptions = {usernameField: 'email'}

//authenticate users using a username and password
//output a user 


passport.use(new LocalStrategy(
 (username, password, done) => {
	//Find user given email 
	db('users').where('username', username)
	.then(validUser => { 
		if (validUser.length == 0){
			return done(null, false)
		}
		bcrypt.compare(password, validUser[0].password)
		.then(validPassword => {
			if (validPassword) {
				return done(null, validUser)
			}
			return done(null, false)
		})
		.catch(error => done(error, false)) //user not found
	})
}))












