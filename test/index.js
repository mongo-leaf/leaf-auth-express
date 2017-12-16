const assert = require("assert")
const app = require("express")();
app.use(require('body-parser').json())
app.use(require('body-parser').urlencoded({ extended: true }))
const authRouter = require("../index.js").router;
app.use("/", authRouter);
let port = 3000 || 4201 || 8052;
app.listen(port)
let url = "http://localhost:" + port;
const request = require("request");
let testUser = { email: "heiyukidev@gmail.com", password: "123456" };
let token = ""
let user = {};
describe('Unit Testing Start!', function () {
    it('Registration Test', async function () {
        await require('mongo-leaf').connect("mongodb://127.0.0.1:27017/_leaf-auth-test");
        await require('leaf-auth').User.remove({});
        request.post(url + "/register", { json: testUser }, (err, res, body) => {
            assert.equal(body.data.email, "heiyukidev@gmail.com");
        })
    });
    it('Login Test', async function () {
        await require('mongo-leaf').connect("mongodb://127.0.0.1:27017/_leaf-auth-test");
        request.post(url + "/login", { json: testUser }, (err, res, body) => {
            token = body.data.token;
            user = body.data.user;
            assert.equal(body.data.user.email, "heiyukidev@gmail.com");
        });
    });
    it('Info Test', async function () {
        await require('mongo-leaf').connect("mongodb://127.0.0.1:27017/_leaf-auth-test");
        request.get(url + "/info", {
            headers: {
                authorization: "Bearer " + token
            }
        }, (err, res, body) => {
            if (!err) {
                let block = JSON.parse(body)
                assert.equal(block.data.email, "heiyukidev@gmail.com");
            }
        });
    });
    it('Refresh Token Test', async function () {
        await require('mongo-leaf').connect("mongodb://127.0.0.1:27017/_leaf-auth-test");
        request.get(url + "/info", {
            headers: {
                authorization: "Bearer " + token
            }
        }, (err, res, body) => {
            if (!err) {
                let block = JSON.parse(body)
                assert.equal(block.data.email, "heiyukidev@gmail.com");
                return;
            }
        });
    });
    it('Update user', async function () {
        await require('mongo-leaf').connect("mongodb://127.0.0.1:27017/_leaf-auth-test");
        user.first_name = "hei";
        user.last_name = "yuki";
        await new Promise((resolve, reject) => {
            request.put(url + "/users/" + user._id, {
                headers: {
                    authorization: "Bearer " + token
                },
                json: user
            }, (err, res, body) => {
                if (!err) {
                    assert.equal(body.data.first_name, "hei");
                    resolve();
                } else {
                    reject();
                }
            });
        });
    });
    it('Update user password', async function () {
        await require('mongo-leaf').connect("mongodb://127.0.0.1:27017/_leaf-auth-test");
        await new Promise((resolve, reject) => {
            request.put(url + "/users/" + user._id + "/password", {
                headers: {
                    authorization: "Bearer " + token
                },
                json: {
                    password: "654321"
                }
            }, (err, res, body) => {
                if (!err) {
                    assert.equal(body.data.first_name, "hei");
                    testUser.password = "654321"
                    request.post(url + "/login", { json: testUser }, (err, res, body) => {
                        token = body.data.token;
                        user = body.data.user;
                        assert.equal(body.data.user.email, "heiyukidev@gmail.com");
                        resolve();
                    });
                } else {
                    reject();
                }
            });
        });
    });
});