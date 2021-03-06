const auth = require("leaf-auth").auth;
let router = require('express').Router();
const response = require('dark-snow-response');
const cleanUser = require("./middlewares.js").cleanUser;
let _default = "email";

module.exports = router;


router.post("/", login, cleanUser, (req, res) => {
    if (req.errors) {
        console.log(req.errors)
        response.badRequest(res)
    } else {
        response.json(res, { user: req.user, token: req.token })
    }
});


function login(req, res, next) {
    auth.login(req.body[_default], req.body.password).then(payload => {
        req.user = payload.user;
        req.token = payload.token;
        next();
    }).catch(err => {
        req.errors = err
        next();
    });
}
