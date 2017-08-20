/**
 * Created by jjang on 2017-08-19.
 */
module.exports = alarm;

function alarm(app , alarmModel){
    "use strict";
    app.get('/alarm/setting',(req,res)=>{
        var token = req.query.token;
        var name = req.query.name;
        var time = req.query.time;

        if(Number(time) > 24){
            res.send({
                "stauts":403,
                "message":"Require time error"
            })
        }
        else{
            alarmModel.find({"token":token,"name":name,"time":time},(err,model)=>{
                if(err) throw err;
                if(model.length == 0){
                    var saveAlarmModel = new alarmModel({
                        "token":token,
                        "name":name,
                        "time":time
                    });

                    saveAlarmModel.save((error,m)=>{
                        if(error) throw error;
                        res.send({
                            "status":200
                        });
                    });
                }
                else{
                    res.send({
                        "status":409,
                        "message":"Already Have"
                    });
                }
            });
        }
    });

    app.get('/alarm/user',(req,res)=>{
        var token = req.query.token;

        alarmModel.find({"token":token},(err,model)=>{
            if(err) throw err;
            if(model.length == 0){
                res.send({
                    "status":404
                });
            }
            else{
                res.send({
                    "status":200,
                    "list":model
                });
            }
        });
    });
}