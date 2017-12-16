let publicRouter = require('express').Router();
let secureRouter = require('express').Router();

const response = require('dark-snow-response');
response.setProvider = "leaf-auth-express";


publicRouter.use("/",require('./routers/public.router.js'));
secureRouter.use("/",require('./routers/secure.router.js'));

module.exports.publicRouter = publicRouter;
module.exports.secureRouter = secureRouter;
module.exports.verifyToken = require("leaf-auth").verifyToken;
module.exports.setSecret = require("leaf-auth").setSecret;
module.exports.replaceUser = require("leaf-auth").replaceUser;
module.exports.setProvider = require("dark-snow-response").setProvider;