const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');
//const Dishes = require('../models/dishes');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, authenticate.verifyOrdinaryUser, (req, res, next) => {
     Favorites.findOne({ user: req.user._id })
     .populate('user')
     .populate('dishes')
     .exec((err, favorites) => {
          if (err) return next(err); 
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorites);
          
     });
})
.post(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req, res, next) => {
     Favorites.findOne({ user: req.user._id }, (err, favorite) => {
          if(err) return next(err);

          if(!favorite) {
               Favorites.create({ user: req.user._id })
               .then((favorite) => {
                    for (var i = 0; i < req.body.length; i++) 
                         if ( favorite.dishes.indexOf(req.body[i]._id) < 0)
                              favorite.dishes.push(req.body[i]);
                    favorite.save()
                    .then((favorite) =>{
                         console.log('Favorite created!');
                         res.statusCode = 200;
                         res.setHeader('Content-Type', 'application/json');
                         res.json(favorite);
                    })
                    .catch((err) =>{
                         return next(err);
                    });
               })
               .catch((err) => {
                    return next(err);
               });
          }
          else {
               for( var i = 0; i < req.body.length; i++)
                    if (favorite.dishes.indexOf(req.body[i]._id) < 0)
                         favorite.dishes.push(req.body[i]);
               favorite.save()
               .then((favorite) =>{
                    console.log('Dish Added!');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
               })
               .catch((err) =>{
                    return next(err);
               });
          }
     });
})
.put(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req, res, next) => {
     var err = new Error('PUT operation not supported on /Favorites');
     err.status = 403;
     return next(err);
})
.delete(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req, res, next) => {
     Favorites.findOneAndRemove({user: req.user._id}, (err, resp) =>{
          if (err) return next(err);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(resp);
     })

});



favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, authenticate.verifyOrdinaryUser, (req, res, next) => {
     res.statusCode = 403;
     res.setHeader('Content-Type', 'text/plain');
     res.end("GET operation is not supported on favorites/"+ req.params.dishId);
})

.post(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req, res, next) => {
     Favorites.findOne({ user: req.user._id }, (err, favorite) => {
          if (err) return next(err);

          if(!favorite) {
               Favorites.create({ user: req.user._id })
               .then((favorite) => {
                    favorite.dishes.push({"_id": req.params.dishId})
                    favorite.save()
                    .then((favorite) => {
                         console.log("Favorite Created!");
                         res.statusCode = 200;
                         res.setHeader('Content-Type', 'application/json');
                         res.json(favorite);
                    })
                    .catch((err) => {
                         return next(err);
                    });
               })
               .catch((err) => {
                    return next(err);
               });
          }
          else {
               if (favorite.dishes.indexOf(req.params.dishId) < 0) {
                    favorite.dishes.push({ "_id": req.params.dishId });
                    favorite.save()
                    .then((favorite) => {
                         console.log("Favorite Dish Added!");
                         res.statusCode = 200;
                         res.setHeader('Content-Type', 'application/json');
                         res.json(favorite);
                    })
                    .catch((err) => {
                         return next(err);
                    })
               }
               else {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end("Dish "+ req.params.dishId +" already present in favorite");                    
               }
          }
     });
})
.put(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req, res, next) => {
     res.statusCode = 403;
     res.setHeader('Content-Type', 'text/plain');
     res.end("PUT operation not supported on /favorites/"+ req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req, res, next) => {
     Favorites.findOne({ user: req.user._id}, (err, favorite) => {
          if (err) return next(err);

          var index = favorite.dishes.indexOf(req.params.dishId);
          if (index >= 0) {
               favorite.dishes.splice(index, 1);
               favorite.save()
               .then((favorite) => {
                    console.log('Favorite Dish deleted!');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
               })
               .catch((err) => {
                    return next(err);
               });
          }
          else {
               res.statusCode = 403;
               res.setHeader('Content-Type', 'text/plain');
               res.end("Dish "+ req.params.dishId +" not present in your favorite.");                    
          }
     })
});


module.exports = favoriteRouter;