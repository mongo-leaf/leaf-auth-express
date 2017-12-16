let publicRouter = require('express').Router();
let secureRouter = require('express').Router();

const response = require('dark-snow-response');
response.setProvider("leaf-auth-express");


publicRouter.use("/login",require('./routers/login.router.js'));
publicRouter.use("/register",require('./routers/register.router.js'));

secureRouter.use("/",require('./routers/secure.router.js'));

// Individual login and register router
module.exports.loginRouter = require('./routers/login.router.js');
module.exports.registerRouter = require('./routers/register.router.js');

// public and secure router;
module.exports.publicRouter = publicRouter;
module.exports.secureRouter = secureRouter;

module.exports.verifyToken = require("leaf-auth").verifyToken;
module.exports.setSecret = require("leaf-auth").setSecret;
module.exports.replaceUser = require("leaf-auth").replaceUser;
module.exports.setProvider = require("dark-snow-response").setProvider;