/**
 * Created by janghunlee on 2017. 8. 9..
 */
module.exports = medicine;

function medicine(app,request,medicineModel,userMedicineModel){
    "use strict";
    app.get('/medicine/getData',(req,res)=>{
        console.log("query Success");
        var url = "http://terms.naver.com/medicineSearch.nhn?mode=nameSearch&query=";
        var medicNum = req.query.medicNum;
        var token = req.query.token;
        var resultUrl = url+medicNum;

        var checkTokenIf = typeof(token);
        console.log(checkTokenIf);

        if(checkTokenIf == "undefined"){
            var checkToken = false;
        }
        else{
            var checkToken = true;
        }

        request(resultUrl,(err,response,html)=> {
            if (err) throw err;

            var splitName = html.split("<dt>");
            var result = splitName[0].split("<strong class=\"title\">");
            if(result[4].indexOf("선택한 조건에 맞는 의약품 검색결과가 없습니다.") != -1){
                res.send({
                    "statuts":404,
                    "message":"PID number undefinded"
                });
            }
            else{
                var parseUrl = result[4].split("<a href=\"/entry")[1].split("\">")[0];
                var getDataUrl = "http://terms.naver.com/entry"+parseUrl;

                request(getDataUrl,(error,respon,code)=>{

                    if(error) throw error;
                    var parseNumber = code.split("<tr>")[5].split("<td class=\"\">")[1].split("</td>")[0];

                    var parseDivision = code.split("<tr>")[2].split("<td class=\"\">")[1].split("</td>")[0];

                    var parseSave = code.split("<p class=\"txt\">")[3].split("</p>")[0];

                    var parseIngridient = code.split("<p class=\"txt\">")[2].split("</p>")[0];

                    var parseUse = code.split("<p class=\"txt\">")[5].split("</p>")[0];
                    var deleteUse = parseUse.split("<br>")[0];
                    parseUse = parseUse.replace(deleteUse,"").replace("<br>","").replace("<br>","");

                    var parseNotice = code.split("<p class=\"txt\">")[6].split("</p>")[0];
                    var deleteNotice = parseNotice.split("<br>")[0];
                    parseNotice = parseNotice.replace(deleteNotice,"").replace("<br>","").replace("<br>","");

                    var parseName = code.split("<h2 class=\"headword\">")[1].split("</h2>")[0];

                    var parseImg = code.split("<img id=\"innerImage0\" class=\"lazyLoadImage\" src=\"")[1].split("data-src=\"")[1].split("\"")[0];

                    var result = new Array();
                    result["name"] = parseName;
                    result["number"] = parseNumber;
                    result["division"] = parseDivision;
                    result["use"] = parseUse;
                    result["notice"] = parseNotice;
                    result["save"] = parseSave;
                    result["ingridient"] = parseIngridient;
                    result["img"] = parseImg;

                    var medicDataSave = new medicineModel({
                        "name":result["name"],
                        "number":result["number"],
                        "division":result["division"],
                        "notice":result["notice"],
                        "ingridient":result["ingridient"],
                        "use":result["use"],
                        "saveMedic":result["save"],
                        "img":result["img"]
                    });

                    userMedicineModel.find({"token":token,"number":result["number"]},(err,model)=>{
                        if(err) throw err;
                        if(model.length == 0){

                            var saveUserMedicineModel = new userMedicineModel({
                                "token":token,
                                "number":result["number"]
                            });

                            saveUserMedicineModel.save(saveUserMedicineModel,(error,m)=>{
                                if(error) throw error;
                            });

                        }

                        if(checkToken == false){
                            res.send({
                                "status":404,
                                "message":"token undefinded"
                            })
                        }
                        else{
                            medicineModel.find({"number":result["number"]},(err,model)=>{
                                if(err) throw err;
                                if(model.length == 0){
                                    medicDataSave.save((err,m)=>{
                                        if(err) throw err;
                                        res.send({
                                            "status":200,
                                            "userData":m
                                        })
                                    });
                                }
                                else{
                                    res.send({
                                        "status":200,
                                        "userData":model
                                    })
                                }
                            });
                        }
                    });
                });
            }
        });
    });
}