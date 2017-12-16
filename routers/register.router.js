const auth = require("leaf-auth").auth;
let router = require('express').Router();
const response = require('dark-snow-response');
const cleanUser = require("./middlewares.js").cleanUser;
let _default = "email";

module.exports = router;

router.post("/", register, cleanUser, (req, res) => {
    if (req.errors) {
        console.log(req.errors)
        response.badRequest(res)
    } else {
        response.created(res, { user: req.user, token: req.token })
    }
});

function register(req, res, next) {
    auth.register(req.body).then(user => {
        req.user = user.ops[0];
        next();
    }).catch(err => {
        req.errors = err
        next();
    });
}