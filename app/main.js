//main.js
var insertmany = require('../oracledb/insertmanyreal_data');
var config = require('../config');
var updatetabletable = require('../oracledb/updatetabletable');
var moment = require('moment');
var G_Refresh_Mark = require('./G_Refresh_Mark');
var JudgeDanger = require('./Judge_Danger');
var LawJudge = require('./LawJudge');
require('linqjs');
async function mainFunction() {
  var mqtt = require('mqtt');
  var test = 0;
  var client2 = mqtt.connect(config.Mqtt_Url);
  client2.subscribe(config.Mqtt_Topic, { qos: 0 }); //订阅主题为test的消息
  //全局刷新标记
  let g_Refresh_Mark = await G_Refresh_Mark();
  //全局LawJudge判断类
  let GloLawJudge = await LawJudge.BuildJudge();
  //开始监视
  let a = await SetWatch(g_Refresh_Mark, GloLawJudge);
  async function SetWatch(g_Refresh_Mark, GloLawJudge) {
    client2.on('message', function(top, message) {
      // //数据库测试成功，直接把数据存入数据库
      // //链接数据库等，现在在外围测试一下
      //当前message
      var tempTable = new Object();
      try {
        //反序列化传入的数据,此为这次传入的数据
        tempTable = JSON.parse(message);
        //获得此次message的PROC_NO主题
        let This_Proc = tempTable[0].proc_no;
        // // console.log(tempTable);
         console.log("收到一份");

        //同时做三件事:1、数据存入即时数据总表，
        // 2、刷新全局刷新标记，数据存入全局刷新标记
        // 3、进入按值判断危险逻辑

        //第一件事：数据存入即时数据总表
        var Proc_Mark = g_Refresh_Mark.where(x => x.name === This_Proc).first();
        insertmany(Proc_Mark.real_time_table, tempTable)
          .then(function(res) {
            updatetabletable(Proc_Mark.real_time_table, config.MAIN_TABLE);
          })
          .then(function(res) {
            console.log('数据存入总表结束', moment().format('YYYY-MM-DD hh:mm:ss'));
            // 2、刷新全局刷新标记，数据存入全局刷新标记
            console.log('数据录入进程读取刷新状态:  ', Proc_Mark.Refresh_Mark);
            Proc_Mark.Refresh_Mark = true;
            Proc_Mark.resent_value = tempTable;
          })
          .catch(function(err) {
            console.log('录入总表出现错误');
          });
        // // 3、进入按值判断危险逻辑(用临时值判断，可以与存储并行进行)
        //?根据需求，将判断危险逻辑移动至循环中，而不是在录入中
      } catch (e) {
        throw new Error('不能格式化，跳出');
      }
    });

    //轮询进程 暂定为20秒
    setInterval(function() {
      g_Refresh_Mark.forEach(mark => {
        if (mark.active) {
          console.log('检测到活动的刷新标记:', mark.name, mark.Refresh_Mark);
          let This_Proc = mark.name;
          let tempTable = mark.resent_value;
          
          if(mark.Refresh_Mark){
            //如果全局刷新标记已经刷新则进入数据判断
            JudgeDanger(tempTable, GloLawJudge[This_Proc])
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });
          //重置刷新标记，记录下一次更新
          mark.Refresh_Mark = false;
          }
          else{
            // 如果全局刷新标记没有刷新则直接将该单位所有数据标记为超时

          }
         
        }
      });
    }, config.Polling_Time);
    return 0;
  }
}

module.exports = mainFunction;
