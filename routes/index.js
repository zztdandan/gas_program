var express = require("express");
var router = express.Router();
var insertmany = require("../oracledb/insertmany");
/* GET home page. */
router.get("/", function(req, res, next) {
  var mqtt = require("mqtt");
  var client2 = mqtt.connect("mqtt://10.10.104.134:1883");
  client2.subscribe("/lt/gas", { qos: 1 }); //订阅主题为test的消息
  client2.on("message", function(top, message) {
    //数据库测试成功，直接把数据存入数据库
    //链接数据库等，现在在外围测试一下
    var tempTable = new Object();
    try {
      tempTable = JSON.parse(message);
      insertmany("GAS_REAL_TIME_BF", tempTable, "BF").then(function(res) {
        console.log(res);
      });
    } catch (e) {
      throw new Error("不能格式化，跳出");
    }
  });
});

module.exports = router;
