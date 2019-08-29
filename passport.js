const passport = require('passport');
//jwt strategy 
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
// const { JWT_SECRET } = require('./configuration'); 
const db = require('./db/index');
const bcrypt = require('bcrypt');

//local strategy 
const LocalStrategy = require ('passport-local').Strategy;

//options for JwtStrategy 
const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'), //where is token contained (i.e., in the authorization field of the header)
	secretOrKey: 'temp'
}

// json web token strategy 
passport.use(new JwtStrategy(opts, (payload, done) => { //payload is an object literal containing the unecoded payload data
	//find user specified in token
	console.log('Im in the JWT Strategy');
	console.log(payload);
	console.log(payload.sub);
	db('users').where('username', payload.sub)
	.then(validUser => { 
		if (validUser.length == 0){
			//user not found
			return done(null, false)
		}
		// return the user (set as req.user)
		return done(null, validUser)
	})
	.catch(error => done(error, false)) //user not found
	})
)

// options for local strategy 
// const localOptions = {usernameField: 'email'}

// authenticate users using a username and password
// output a user 

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












