var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var randomstring = require('randomstring');
var mongoose = require('mongoose');
var request = require('request');
var FCM = require('fcm-push');

var app = express();

mongoose.connect('mongodb://localhost:27017/test') ;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Mongo On");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var user = mongoose.Schema({
    name:String,
    id:String,
    password:String,
    token:String,
    age:String,
    sex:String,
});

var medicine = mongoose.Schema({
    name:String,
    use:String,
    saveMedic:String,
    ingridient:String,
    notice:String,
    number:String,
    division:String,
    img:String
});

var userMedicine = mongoose.Schema({
    name:String,
    number:String
});

var alarm = mongoose.Schema({
    token:String,
    name:String,
    time:String
});

var userModel = mongoose.model('userModel',user);
var medicineModel = mongoose.model('medicineModel',medicine);
var userMedicineModel = mongoose.model('userMedicineModel',userMedicine);
var alarmModel = mongoose.model('alarmModel',alarm);

var auth = require('./routes/auth')(app,randomstring,userModel);
var location = require('./routes/location')(app,request);
var medicine = require('./routes/medicine')(app,request,medicineModel,userMedicineModel,alarmModel);
var push = require('./routes/push')(app,FCM,alarmModel);
var alarm = require('./routes/alarm')(app,alarmModel);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
