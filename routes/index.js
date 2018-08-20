var express = require("express");
var router = express.Router();
var oraquery = require("../oracledb/query");
/* GET home page. */
router.get("/", function(req, res, next) {
  var mqtt = require("mqtt");
  var client2 = mqtt.connect("mqtt://10.10.104.134:1883");
  client2.subscribe("/lt/gas", { qos: 1 }); //订阅主题为test的消息
  client2.on("message", function(top, message) {
    //链接数据库等，现在在外围测试一下
    console.log(message.toString());
  });
  oraquery("select WORKFLOW_ID,TABLEDBCONTEXT from VERI_WORKFLOW t ", function(
    err,
    data
  ) {
    if (err) throw err;
    else {
      console.log(data);
    }
  });
});

module.exports = router;
