const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());


promoRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end("Will give you the all promotions..");
})
.post((req, res, next) =>{
    res.end("Will upload the promotions: "+ req.body.name + " with the description: "+req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /promotions");
})
.delete((req, res, next) => {
    res.end("Will deleting all the promotions..");
});



promoRouter.route('/:leaderId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end("Will give you the promotion:"+ req.params.promoId);
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end("POST operation is not supported on /promotion/:"+req.params.promoId);
})
.put((req, res, next) => {
    res.write("Updating your promotion: "+req.params.promoId +'\n');
    res.end("Will upload the promotion: "+ req.body.name + " with the description: "+req.body.description);
})
.delete((req, res, next) => {
    res.end("Will deleting the promotion..");
});



module.exports = promoRouter;