var proc_no_list=require('./proc_no')
module.exports = {
  Mqtt_Url:"mqtt://10.10.104.134:1883",
  //mqtt订阅话题
  Mqtt_Topic:"/lt/gas",
  //轮询进程轮询时间
  Polling_Time: 30000,
  //警告数值存储间隔
  Warning_Time_Save_Step:30000,
  //总表名
  MAIN_TABLE:"GAS_REAL_TIME",
  // //全二级单位代号
  // //为了不进入回调函数，所有代号直接存在文件里面
  // PROC_NO_LIST: proc_no_list
  //? 现在整个main函数为同步函数，有条件进行先决读取
};
