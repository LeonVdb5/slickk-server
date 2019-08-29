//deprecated

const db = require('../db/index');

const createUser = (username, email, hashedPassword) => {
	const insert = db('users')
	.insert({
		username: username,
		email: email,
		password: hashedPassword
	}).catch(error => console.log(error))
	return insert
}

module.exports = createUser;

// username: username,
// email: email,
// first_name: '',
// last_name: '',
// password: hashedPassword,
// user_type: 'non-admin',
// face_shape: '',
// hair_type: '',
// hair_length: ''


// username: username,
// email: email,
// password: hashedPassword