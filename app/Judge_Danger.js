require('linqjs');
const path = require('path');
const moment = require('moment');
const linqjs = require('linqjs');
var query = require(path.join(process.cwd(), 'oracledb', 'query'));
const config = require(path.join(process.cwd(), 'config', 'index'));
const insertwarning_data = require(path.join(process.cwd(), 'oracledb', 'insertwarning_data'));
JudgeDanger = function() {};
//判断危险流程
//对于警告数值的保存，现在拟定为20秒保存一次。任何超过normal的值都要保存起来
JudgeDanger.doJudge = function(DataArr, Law) {
  //1、Law的格式：Obj{Judge(gas_data),Law:Array[{LAW_NAME:,LAW_TYPE:,LAW_PROC:,LAW_STATUS_NAME:,LAW_MIN_VALUE:,LAW_MAX_VALUE:,LAW_CNAME:}] }
  return new Promise(function(resolve, reject) {
    DataArr.forEach(gas_data => {
      //通过judge函数获得status结果。包括超时、正常、数据违规、危险警报等
      let StatusResult = Law.Judge(gas_data);
      //使用dosave函数保存结果
      JudgeDanger.doSave(StatusResult);
    });
    resolve(1);
  });
};

//new_status结构
// ret.STATUS_ID = randomWord(false, 16);
// ret.PROP_ID =gas_data.prop;
// ret.STATUS_NAME = Law.LAW_STATUS_NAME;
// ret.STATUS_CNAME = Law.LAW_CNAME;
// ret.STATUS_TIME = moment().format('YYYYMMDDhhmmss');
// ret.STATUS_START_TIME = moment().format('YYYY-MM-DD hh:mm:ss');
// ret.VALUE = gas_data.value;
// ret.PROC_NO= gas_data.proc_no;
//?用于将该数据录入几个不同的表格中，进行统一判断
JudgeDanger.doSave = async function(StatusResult) {
  try {
    //* 1、查找status_realtime表，是否有这个proc_id+prop_id节点的数据。
    //* IF：如果没有，说明这个节点第一次接收数据,新建一个status记录
    //* IF：如果有，判断这个节点的状态与现在状态是否一致
    let findStatus = await query("select * from GAS_STATUS_REAL where PROC_NO='" + StatusResult.PROC_NO + "' and PROP_ID='" + StatusResult.PROP_ID + "'");
    if (findStatus.length == 0) {
      //没有这个类型的记录
    } else {
      //有这个类型的记录
    }
  } catch (e) {}
};

//?用于处理mqtt断流时的数据状况
//与前面的DoSave是互易并行关系
JudgeDanger.DoDisconnect = async function(PROC_NO, PROC_Law) {
  try {
    let findProcList = await query("select * from GAS_STATUS_REAL where PROC_NO='" + PROC_NO + "'");
    let disconnectLaw = PROC_Law.where(x => x.LAW_TYPE == 'D').first();
    findProcList.forEach(ele => {});
  } catch (e) {}
};

//?用于判断现有status与判断出来的status是否一致，如果不一致则更新status，并update数据库
//如果不一致，将原来的数据加上一个结束时间，并存入历史数据库
//所有数据，只要是异常，都存入数据情况记录表中
//new_status:新生成的status
//data_status：数据库中的status
JudgeDanger.JudgeRealAndChangeSave = async function(new_status, data_status) {
  //状态无变化
  if (new_status.STATUS_NAME == data_status.STATUS_NAME) {
    let a = await JudgeDanger.SaveToWarningData(data_status);
  } else {
    // 状态有变化
    //1、新状态直接存入报警历史数据库
    let b = await JudgeDanger.SaveToWarningData(new_status);
    //2、旧状态中结束时间=新状态的开始时间
    data_status.STATUS_END_TIME = new_status.STATUS_START_TIME;
  }
};

//?将数据异常存入数据异常历史记录表
//判断datastatus的数据中STATUS_NAME是否为normal，如果是不需要存
JudgeDanger.SaveToWarningData = async function(data_status) {
  //此处应该读取config，现在做简化处理
  //只写不是normal的操作
  if (data_status.STATUS_NAME != 'normal') {
    let tmp_arr = [{ STATUS_ID: data_status.STATUS_ID, REAL_TIME: data_status.REAL_TIME, REAL_TIME_VALUE: data_status.REAL_TIME_VALUE, STATUS_NAME: data_status.STATUS_NAME }];
    let a = await insertwarning_data(tmp_arr);
    return true;
  }
  return true;
};

//?将已经完结的历史状态存入历史记录表
//判断datastatus的数据中STATUS_NAME是否为normal，如果是不需要存
JudgeDanger.SaveToStatusHistory = async function(data_status) {
  //此处应该读取config，现在做简化处理
  if (data_status.STATUS_NAME != 'normal') {
    let tmp_arr = [{ STATUS_ID: data_status.STATUS_ID, PROP_ID: data_status.PROP_ID, STATUS_NAME: data_status.STATUS_NAME, STATUS_CNAME: data_status.STATUS_CNAME,STATUS_START_TIME: data_status.STATUS_START_TIME,STATUS_END_TIME: data_status.STATUS_END_TIME }];
    let a = await insertwarning_data(tmp_arr);
    return true;
  }
  return true;
};
module.exports = JudgeDanger;
