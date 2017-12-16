const auth = require("leaf-auth").auth;
let router = require('express').Router();
const response = require('dark-snow-response');
const cleanUser = require("./middlewares.js").cleanUser;

module.exports = router;

router.put("/users/:id", userFromToken, updateUser, cleanUser, (req, res) => {
    if (req.errors) {
        console.log(req.errors)
        response.error(res)
    } else {
        response.created(res, req.user);
    }
});
router.put("/users/:id/password", userFromToken, updatePassword, cleanUser, (req, res) => {
    if (req.errors) {
        console.log(req.errors)
        response.error(res)
    } else {
        response.created(res, req.user);
    }
});
router.get("/info", userFromToken, cleanUser, (req, res) => {
    if (req.errors) {
        console.log(req.errors)
        response.error(res)
    } else {
        response.json(res, req.user)
    }
});

router.get("/refresh", refreshToken, (req, res) => {
    if (req.errors) {
        console.log(req.errors)
        response.error(res)
    } else {
        if (req.token === "Invalid token") {
            response.unauthorized(res)
        } else {
            response.accepted(res, req.token)
        }
    }
});


function userFromToken(req, res, next) {
    let token = req.headers.authorization;
    if (token) {
        token = token.split(" ");
        auth.getUserFromToken(token[1]).then(data => {
            req.user = data;
            next();
        }).catch(err => {
            req.errors = err
            next();
        });
    } else {
        req.user = {};
        next();
    }
}

function refreshToken(req, res, next) {
    let token = req.headers.authorization;
    if (token) {
        token = token.split(" ");
        req.token = auth.refreshToken(token[1]);
        next();
    } else {
        req.user = {};
        next();
    }
}

function updateUser(req, res, next) {
    auth.updateUser(req.params.id, req.body).then(user => {
        req.user = user;
        next();
    }).catch(err => {
        req.errors = err;
        next();
    });;
}

function updatePassword(req, res, next) {
    auth.updatePassword(req.params.id, req.body.password).then(user => {
        req.user = user;
        next();
    }).catch(err => {
        req.errors = err;
        next();
    });;
}
