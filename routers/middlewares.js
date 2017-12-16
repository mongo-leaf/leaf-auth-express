
function cleanUser(req, res, next) {
    if (req.user) {
        delete req.user.salt;
        delete req.user.password;
    }
    next();
}

module.exports.cleanUser = cleanUser;