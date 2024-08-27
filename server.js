const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path:'./config.env'});
const dbConfig =require('./dbconfig');

const tourSchema = new mongoose.Schema({
  name: {
    type:String,
    required:[true, 'A Tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type:Number,
    required:[true, 'A Tour must have a price']
  }
});
const Tour = mongoose.model('Tour',tourSchema);

// const testTour =new Tour({
//   name:'The Park Camper',
//   rating:3.5,
//   price:997
//  })
// testTour
// .save()
// .then(doc => {
//   console.log(doc);
// })
// .catch(err => {
//   console.log('ERROR:',err);
// })

const port = 3000;
app.listen(port,() => {
    console.log(`Server is up on port ${port}`);
}); 

module.exports = Tour;