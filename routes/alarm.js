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
                    "status":409
                });
            }
        });
    });

}