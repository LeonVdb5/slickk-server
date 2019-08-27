const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex')
const db = knex({
  client: 'pg',
  connection: {
    host: 'slickk.cnai4blomaps.us-east-2.rds.amazonaws.com',
    port: '5432',
    user: 'slickk',
    password: 'Okcthunder35',
    database: 'slickk1'
  }
});

// app.use(bodyParser.urlencoded({extended: false}));
app.use(cors())
app.use(bodyParser.json());


//routers 
const productRoutes = require('./api/routes/products');
const hairstyleRoutes = require('./api/routes/hairstyles');
const commentRoutes = require('./api/routes/comments');
const userRoutes = require('./api/routes/users');


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