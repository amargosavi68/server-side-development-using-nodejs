const express = require('express');
const cors = require('cors');
const app = express();

//explicitely added origins in whitelist[]
// whitelist array contains address of incoming requests which is deleted for now but you can add it afterwards below.

var corsOptionsDelegate = (req, callback) => {
     var corsOptions;

     //checking incoming request is in whitelist[]
     if(whitelist.indexOf(req.header('Origin')) !== -1) {
          corsOptions = { origin: true };
     }
     else {
          corsOptions = { origin: false };
     }
     callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
