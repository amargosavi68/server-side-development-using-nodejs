const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());


dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end("Will give you the dishes..");
})
.post((req, res, next) =>{
    res.end("Will upload your dish: "+ req.body.name + " with the description: "+req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /dishes");
})
.delete((req, res, next) => {
    res.end("Will deleting your all dishes..");
});



dishRouter.route('/:dishId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end("Will give you the dish:"+ req.params.dishId);
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end("POST operation is not supported on /dishes/:"+req.params.dishId);
})
.put((req, res, next) => {
    res.write("Updating your dish: "+req.params.dishId +'\n');
    res.end("Will upload your dish: "+ req.body.name + " with the description: "+req.body.description);
})
.delete((req, res, next) => {
    res.end("Will deleting your dish..");
});


module.exports = dishRouter;