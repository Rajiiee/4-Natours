const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('DB connection successful');
});

mongoose.connection.on('error', err => {
  console.log('DB connection failed with error:', err);
});

module.exports = mongoose;
