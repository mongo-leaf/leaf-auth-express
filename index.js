const auth = require("leaf-auth").auth;
let router = require('express').Router();

router.post("/login", login, cleanUser, (req, res) => {
    if (req.errors) {
        console.log(req.errors)
        res.status(500).send(req.errors)
    } else {
        res.send({ user: req.user, token: req.token })
    }
});

router.post("/register", register, cleanUser, (req, res) => {
    if (req.errors) {
        console.log(req.errors)
        res.status(500).send(req.errors)
    } else {
        res.send({ user: req.user, token: req.token })
    }
});

router.get("/info", userFromToken, cleanUser, (req, res) => {
    if (req.errors) {
        console.log(req.errors)
        res.status(500).send(req.errors)
    } else {
        res.send(req.user)
    }
});

router.get("/refresh", refreshToken, (req, res) => {
    if (req.errors) {
        console.log(req.errors)
        res.status(500).send(req.errors)
    } else {
        res.send(req.token)
    }
});

let _default = "email";

function register(req, res, next) {
    auth.register(req.body).then(user => {
        req.user = user.ops[0];
        next();
    }).catch(err => {
        req.errors = err
        next();
    });
}
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
function cleanUser(req, res, next) {
    if (req.user) {
        delete req.user.salt;
        delete req.user.password;
    }
    next();
}


module.exports.router = router;
module.exports.verifyToken = require("leaf-auth").verifyToken;
module.exports.setSecret = require("leaf-auth").setSecret;
module.exports.replaceUser = require("leaf-auth").replaceUser;