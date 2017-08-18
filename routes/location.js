/**
 * Created by janghunlee on 2017. 8. 9..
 */
module.exports = location;

function location(app,request){
    "use strict";
    app.get('/location',(req,res)=>{
        // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=500&type=restaurant&keyword=cruise&key=YOUR_API_KEY

        var latitude = req.query.latitude;
        var longitude = req.query.longitude;

        var radius = "500";

        var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
        var loc = "location="+latitude+","+longitude+"&";
        var type = "&type=pharmacy";
        var key="&key=AIzaSyC-GmMkR9yIm1c3dtO1Y-gzbHGWbxEPyAk";

        var queryUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"+loc+"radius=500"+type+key;

        console.log(queryUrl);
        request(queryUrl,(err,response,html)=>{
            if(err) throw err;
            res.send(html);
        });
    });
}