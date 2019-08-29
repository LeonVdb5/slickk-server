const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex')
const db = require('./db/index');

//passport 
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false})

const routes = express.Router(); 

// const passportService = require **

app.use(passport.initialize());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//routers 
const productRoutes = require('./routes/products');
const hairstyleRoutes = require('./routes/hairstyles');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');


app.use('/products', productRoutes);
app.use('/hairstyles', hairstyleRoutes);
app.use('/comments', commentRoutes);
app.use('/users', userRoutes);


//Handle errors for requests that reach this line 
app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status=404;
	next(error);
})

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});


module.exports = app; 