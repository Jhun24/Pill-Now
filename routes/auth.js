/**
 * Created by janghunlee on 2017. 8. 8..
 */

module.exports = auth;

function auth(app,randomstring,userModel) {
    app.post('/auth/login', (req, res) => {
        "use strict";
        var id = req.body.id;
        var password = req.body.password;

        userModel.find({"id": id, "password": password}, (err, model) => {
            if (err) throw err;
            if (model.length == 0) {
                res.send({
                    "status":404
                });
            }
            else {
                res.send({
                    "status": 200,
                    "token": model[0]["token"]
                });
            }
        });
    });

    app.post('/auth/signup', (req, res) => {
        "use strict";
        var id = req.body.id;
        var password = req.body.password;
        var name = req.body.name;
        var age = req.body.age;
        var sex = req.body.sex;
        var token = randomstring.generate();
        userModel.find({"id": id}, (err, model) => {
            if (err) throw err;
            if (model.length == 0) {
                userModel.save({"id": id, "password": password, "name": name, "token": token,"age":age,"sex":sex}, (error, m) => {
                    if (error) throw error;
                    res.send({
                        "status": 200,
                        "token": token
                    });
                });
            }
            else {
                res.send({
                    "status":401
                });
            }
        });
    });

}
