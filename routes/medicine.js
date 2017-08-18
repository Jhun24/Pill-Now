/**
 * Created by janghunlee on 2017. 8. 9..
 */
module.exports = medicine;

function medicine(app,request,medicineModel,userMedicineModel){
    "use strict";
    app.get('/parse/getData',(req,res)=>{
        var url = "http://terms.naver.com/medicineSearch.nhn?mode=nameSearch&query=";
        var medicNum = req.query.medicNum;

        var resultUrl = url+medicNum;

        var medicineName;
        var medicineDisplayUrl;

        var division;
        var use;
        var notice;
        var save;
        var ingridient;

        medicineModel.find({"number":medicNum},(err,model)=>{
            if(err) throw err;
            console.log(model[0]);
            if(model[0] == null){
                console.log("Save model");
                request(resultUrl,(err,response,html)=>{
                    if(err) throw err;

                    var splitName = html.split("<dt>");
                    var name = splitName[1].split("</a>");

                    medicineName = name[0].split("<strong>")[1].split("</strong>")[0];
                    var naverUrl = name[0].split("<a href=\"")[1].split("\">")[0];
                    medicineDisplayUrl = "http://terms.naver.com/"+naverUrl;

                    console.log(medicineDisplayUrl);

                    request(medicineDisplayUrl,(error,respon,code)=>{

                        if(error) throw error;

                        var test = code.split("<tr>");
                        division = test[2].split("</span>")[1].split("\">")[1].split("</td>")[0];
                        var setUse = test[5].split("<p class=\"txt\">");
                        use = setUse[5].split("<h3")[0];
                        use = use.replace("</p>","").replace(/<br>/gi,"\n");

                        var notice = setUse[6].split("<dl>")[0].split("</p>")[0].replace(/<br>/gi,"\n");
                        ingridient = setUse[2].split("</p>")[0];
                        save = setUse[3].split("</p>")[0];

                        var img = test[0].split("<img id=\"innerImage0\" class=\"lazyLoadImage\" src=\"http://static.naver.net/terms/terms/img/e.gif\" data-src=\"")[1].split("\"")[0];
                        var result = new Array();
                        result["name"] = medicineName;
                        result["number"] = medicNum;
                        result["division"] = division;
                        result["use"] = use;
                        result["notice"] = notice;
                        result["save"] = save;
                        result["ingridient"] = ingridient;
                        console.log(result);

                        var medicDataSave = new medicineModel({
                            "name":result["name"],
                            "number":result["number"],
                            "division":result["division"],
                            "notice":result["notice"],
                            "ingridient":result["ingridient"],
                            "use":result["use"],
                            "save":result["save"],
                            "img":img
                        });
                        console.log(test[2]);
                        medicDataSave.save((err,model)=>{
                            if(err) throw err;
                            console.log(model);
                            res.send(model);
                        });
                    });
                });
            }
            else{
                console.log("Load Model")
                res.send(model[0]);
            }
        });
    });
}