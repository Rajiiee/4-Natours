const fs = require('fs');
const Tour = require('./../Models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory= require('./handlerFactory');
const { $where } = require('../Models/userModel');
const multer = require('multer');
const sharp = require('sharp');



const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});


exports.uploadTourImages = upload.fields([
  {name: 'imageCover', maxCount:1},
  {name: 'images', maxCount:3},
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  //console.log(req.files);

  if(!req.files.imageCover || !req.files.images) return next();


  //1) cover image
  const imageCoverFilename= `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({
      quality: 90,
    })
    .toFile(`public/img/tours/${imageCoverFilename}`);
  req.body.imageCover = imageCoverFilename;

  //2) images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
       .resize(2000, 1333)
       .toFormat('jpeg')
       .jpeg({
          quality: 90,
        })
       .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  );

  next();
})

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.callId= (req,res,next,val)=>{
//     console.log(`the value is ${val}`);
//     if ( req.params.id * 1>= tours.length) {
//         return res.status(404).json({
//           status: 'fail',
//           message: 'Invalid id',
//         });
//       }
//       next();
// };

// exports.checkBody=(req,res,next)=>{
//     if(!req.body.name || !req.body.price){
//         return res.status(400).json({
//           status: 'fail',
//           message: 'Missing name or price'
//         });
//     }
//     next();
// };
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};


exports.getAllTours= factory.getAll(Tour);
// exports.getAllTours = catchAsync(async (req, res) => {
  
//     // filtering
//     //   const queryObj = { ...req.query };
//     //   const excludeObj = ['page', 'sort', 'limit', 'fields'];
//     //   excludeObj.forEach((el) => delete queryObj[el]);

//     //   // console.log(queryObj, req.query);

//     //   // advanced filtering
//     //   let queryStr = JSON.stringify(queryObj);
//     //   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>
//     //     `$${match}`
//     //   );
//     //  // console.log(JSON.parse(queryStr),req.query);
//     //   let query = Tour.find(JSON.parse(queryStr));

//     //sorting
//     // if(req.query.sort){
//     //   const sortBy= req.query.sort.split(',').join(' ');
//     //   console.log(sortBy);
//     //   query=query.sort(sortBy);
//     // }else{
//     //   query=query.sort('-createdAt');
//     // }

//     //limiting
//     // if(req.query.fields){
//     //   const selectBy=req.query.fields.split(',').join(' ');
//     //   query=query.select(selectBy);
//     // }else{
//     //   query=query.select('-__v');
//     // }

//     // paging
//     // const page= req.query.page*1||1;
//     // const limit=req.query.limit*1||100;
//     // const skip=(page-1)*limit;

//     // query=query.skip(skip).limit(limit);

//     // if(req.query.page){
//     //   const num= await Tour.countDocuments();
//     //   if(skip>=num){
//     //     throw new Error('this page doesnt exist');
//     //   }
//     // }

//     const feautures = new APIFeatures(Tour.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//     const tours = await feautures.query;
//     res.status(200).json({
//       status: 'success',
//       //requestedAt: req.requestTime,
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
  
//});


exports.getTourbyId= factory.getOne(Tour,{path:'reviews'});
// exports.getTourbyId = catchAsync(async (req, res,next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');

//   if(!tour){
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     //requestedAt: req.requestTime,
//     results: tour.length,
//     data: {
//       tour,
//     },
//   });

//   // try {
//   //   const tour = await Tour.findById(req.params.id);
//   //   res.status(200).json({
//   //     status: 'success',
//   //     //requestedAt: req.requestTime,
//   //     results: tour.length,
//   //     data: {
//   //       tour,
//   //     },
//   //   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err,
//   //   });
//   // }
// });



// exports.updateTour = catchAsync(async (req, res,next) => {

//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if(!tour){
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'pass',
//     tour: tour,
//   });

//   // try {
//   //   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//   //     new: true,
//   //     runValidators: true,
//   //   });
//   //   res.status(200).json({
//   //     status: 'pass',
//   //     tour: tour,
//   //   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err,
//   //   });
//   // }
// });

exports.updateTour= factory.updateOne(Tour);

// exports.deleteTour = catchAsync(async (req, res,next) => {
  
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if(!tour){
//     return next(new AppError('No tour found with that ID', 404));
//   }
//     res.status(204).json({ status: 'success', data: null });

//   // try {
//   //   await Tour.findByIdAndDelete(req.params.id);
//   //   res.status(204).json({ status: 'success', data: null });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err,
//   //   });
//   // }
// });
exports.deleteTour= factory.deleteOne(Tour);
exports.createTour= factory.createOne(Tour);

// exports.createTour = catchAsync(async (req, res,next) => {

//    const newTour = await Tour.create(req.body);
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour: newTour,
//       },
//     });


//   // try {
//   //   const newTour = await Tour.create(req.body);
//   //   res.status(200).json({
//   //     status: 'success',
//   //     data: {
//   //       tour: newTour,
//   //     },
//   //   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err,
//   //   });
//   // }

//   //console.log(req.body);
//   // const newid = tours[tours.length - 1].id + 1;
//   // const newTour = Object.assign({ id: newid }, req.body);
//   // tours.push(newTour);
//   // fs.writeFile(
//   //   `${__dirname}/dev-data/data/tours-simple.json`,
//   //   JSON.stringify(tours),
//   //   (err) => {
//   //     res.status(201).json({
//   //       status: 'success',
//   //       data: {
//   //         tour: newTour,
//   //       },
//   //     });
//   //   }
//   // );
//   //res.send("done");
// });

exports.getTourStats = catchAsync(async (req, res,next) => {
  

  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: {$toUpper: '$difficulty'},
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        avgRating: { $avg: '$ratingsAverage' },
        maxPrice: { $max: '$price' },
        numTours: {$sum:1},
        numRatings: { $sum: '$ratingsQuantity' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match : { _id: { $ne: 'EASY'}}
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });


  // try {
  //   const stats = await Tour.aggregate([
  //     {
  //       $match: { ratingsAverage: { $gte: 4.5 } },
  //     },
  //     {
  //       $group: {
  //         _id: {$toUpper: '$difficulty'},
  //         avgPrice: { $avg: '$price' },
  //         minPrice: { $min: '$price' },
  //         avgRating: { $avg: '$ratingsAverage' },
  //         maxPrice: { $max: '$price' },
  //         numTours: {$sum:1},
  //         numRatings: { $sum: '$ratingsQuantity' },
  //       },
  //     },
  //     {
  //       $sort: { avgPrice: 1 },
  //     },
  //     // {
  //     //   $match : { _id: { $ne: 'EASY'}}
  //     // }
  //   ]);

  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       stats,
  //     },
  //   });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.getMonthlyPlan= catchAsync(async (req,res,next)=>{
   

  const year= req.params.year*1;
    const plan= await Tour.aggregate([
      {
        $unwind: '$startDates'
        
       },
      {
        
        $match : {
          startDates:{
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group : {
          _id: {$month: '$startDates'},
          numTourStarts :{$sum :1},
          tours:{$push: '$name'},
        }
      },{
        $addFields :{ month : '$_id'}
      },{
        $project :{
          _id:0
        }
      },
      {
        $sort :{
          numTourStarts: -1
        }

      }
    ])

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });


  // try {
  //   const year= req.params.year*1;
  //   const plan= await Tour.aggregate([
  //     {
  //       $unwind: '$startDates'
        
  //      },
  //     {
        
  //       $match : {
  //         startDates:{
  //           $gte: new Date(`${year}-01-01`),
  //           $lte: new Date(`${year}-12-31`)
  //         }
  //       }
  //     },
  //     {
  //       $group : {
  //         _id: {$month: '$startDates'},
  //         numTourStarts :{$sum :1},
  //         tours:{$push: '$name'},
  //       }
  //     },{
  //       $addFields :{ month : '$_id'}
  //     },{
  //       $project :{
  //         _id:0
  //       }
  //     },
  //     {
  //       $sort :{
  //         numTourStarts: -1
  //       }

  //     }
  //   ])

  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       plan,
  //     },
  //   });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});


// /tours-within/:distance/center/:latlng/unit/:unit

exports.getToursWithin= catchAsync( async (req,res,next)=>{

  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',').map(parseFloat);

  if(!lat || !lng){
    return next(new AppError('Please provide latitude and longitude in the format lat,lng',404));
  }
  const radius = unit==='mi'? distance/3963.2: distance/6378.1;

  const tours= await Tour.find({ startLocation: { $geoWithin: { $centerSphere:[[lng, lat], radius]}}});
//console.log(distance,lat,lng,unit);
  res.status(200).json({
    status:'success',
    results: tours.length,
    data: {
      data: tours
    },
  })

});


exports.getDistances= catchAsync( async (req,res,next)=>{
  const {  latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',').map(parseFloat);

  const multiplier= unit==='mi'?0.000621371:0.01;

  if(!lat || !lng){
    return next(new AppError('Please provide latitude and longitude in the format lat,lng',404));
  }

  const distances= await Tour.aggregate([
    {
      $geoNear:{
        near:{
          type:'Point',
          coordinates: [lng*1,lat*1]
        },
        distanceField:'distance',
        distanceMultiplier: multiplier,
      }
    },{
      $project:{
        distance:1,
        name:1,
      }
    }
  ])

  res.status(200).json({
    status:'success',
    results: distances.length,
    data: {
      data: distances
    },
  })


})
