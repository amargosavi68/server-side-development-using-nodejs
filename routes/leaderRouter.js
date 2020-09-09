const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());


leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end("Will give you the all leaders..");
})
.post((req, res, next) =>{
    res.end("Will upload the leader: "+ req.body.name + " with the description: "+req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported on /leaders");
})
.delete((req, res, next) => {
    res.end("Will deleting all the leaders..");
});


leaderRouter.route('/:leaderId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end("Will give you the leader:"+ req.params.leaderId);
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end("POST operation is not supported on /dishes/:"+req.params.leaderId);
})
.put((req, res, next) => {
    res.write("Updating your leader: "+req.params.leaderId +'\n');
    res.end("Will upload the leader: "+ req.body.name + " with the description: "+req.body.description);
})
.delete((req, res, next) => {
    res.end("Will deleting the Leader..");
});



module.exports = leaderRouter;