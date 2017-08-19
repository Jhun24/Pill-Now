/**
 * Created by jjang on 2017-08-19.
 */
module.exports = push;

function push(app,FCM,alarmModel){
    "use strict";
    var serverKey = "AAAAYkqit2A:APA91bFnteQzo7DZtGtNMMz8UJBuW4U-lWJEiqmQ6MGckYVgFZoNpudXuzrzpEGd9_Y0azXN08HNphysrsTsTzPnLn3fDyjewh_Zkzm9pd13xC-5Y1D6EEIQ_ZStYzN447tRXrs0O4t7";

    var fcm =  new FCM(serverKey);

    app.get('/push',(req,res)=>{
        var token = req.query.token;
        var fcmToken = req.query.fcm;

        var d = new Date();
        var time = d.getHours();


        alarmModel.find({"token":token},(err,model)=>{
            if(err) throw err;
            for(var i = 0; i<model.length; i++){
                if(model[i]["time"] == time){
                    var fcmTitle = model[i]["name"]+" 먹을시간입니다!";
                    var message = {
                        to : fcmToken,
                        priority:'high',
                        notification:{
                            title:"약 먹을시간입니다!",
                            body:fcmTitle
                        }
                    };
                    fcm.send(message,(err,result)=>{
                        if(err) throw err;
                        else{
                            console.log("fcm send success  :  "+result);
                        }
                    });
                }
            }
        });

    });
}