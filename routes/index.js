var express = require("express");
var router = express.Router();
var mainFunction=require('../app/main');
/* GET home page. */
router.get("/",function(req, res, next) {
  mainFunction().then(function(res){
   
  }).catch(function(err){
   console.log(err);
  });
  res.send("数据录入开始运行");
});

module.exports = router;
