const knex = require('knex');

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

module.exports = db;