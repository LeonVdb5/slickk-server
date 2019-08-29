const db = require('../db/index');

const findUserByPid = (pid) => {

}



const verifyUser = (email) => {
	// SELECT * FROM users WHERE email = $1
	// return db.oneOrNone(query, [email]);
	return
}

module.exports = {findUserByPid, verifyUser};
