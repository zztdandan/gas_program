const oraquery = require('../oracledb/query');
const randomWord = require('./randomword');
require('linqjs');
let LawJudge = function() {};

//创造一个判断类
LawJudge.BuildJudge = async function() {
  let Proc_List = await oraquery('select * from GAS_PROC_CONFIG t');
  let Law_List = await oraquery('select * from GAS_LAW_CONFIG');
  async function doa(Proc_List, Law_List) {
    let JudgeObject = new Object(); //要return的judge实体
    //循环每个proc_unit进行设置
    Proc_List.forEach(proc_no => {
      let proc_name = proc_no.PROC_NO;
      JudgeObject[proc_name] = new Object();
      //选出最新的生效的规则
      let ObjectLaw = Law_List.where(x => x.LAW_PROC == proc_name)
        .groupBy(x => x.LAW_STATUS_NAME)
        .select(function(g) {
          let a = g.orderByDescending(t => t.LAW_ACTION_TIME).first();
          return a;
        });
      //给该类指定规则列表
      JudgeObject[proc_name].Law = ObjectLaw;
      //给该类定义判断函数
      //输入:gas_data:{REAL_TIME:,PROP,PROP_CNAME,VALUE,PROC_NO}
      JudgeObject[proc_name].Judge = function(gas_data) {
        let Law = this.Law;
        //超时规则
        let timeoutlaw = Law.where(x => x.LAW_TYPE == 'T').first();
        //由于数据错误无法判断的规则
        let wrongdatalaw = Law.where(x => x.LAW_TYPE == 'W').first();
        //数据判断规则（多列）
        let valuelaw = Law.where(x => x.LAW_TYPE == 'N');
        let time_judge = LawJudge.TimeoutJudge(gas_data, timeoutlaw);
        if (time_judge != null) {
          return time_judge;
        }
        valuelaw.forEach(one_value_law => {
          let this_law_judge = LawJudge.ValueJudge(gas_data, one_value_law);
          if (this_law_judge != null) {
            return this_law_judge;
          }
        });
      };
    });
    return JudgeObject;
  }
  return doa(Proc_List, Law_List);
};

LawJudge.BuildStatus = function(Law, gas_data) {
  let ret = new Object();
  //16字长的字符串
  ret.STATUS_ID = randomWord(false, 16);
  ret.PROP_ID =gas_data.prop;
  ret.STATUS_NAME = Law.LAW_STATUS_NAME;
  ret.STATUS_CNAME = Law.LAW_CNAME;
  ret.STATUS_TIME = moment().format('YYYYMMDDhhmmss');
  ret.STATUS_START_TIME = moment().format('YYYY-MM-DD hh:mm:ss');
  ret.VALUE = gas_data.value;
  ret.PROC_NO= gas_data.proc_no;
  return ret;
};
//判断超时的函数
LawJudge.TimeoutJudge = function(gas_data, timeoutlaw) {
  //第一步超时判断，如果超时不需要做后续任何判断
  try {
    let data_time_str = gas_data.real_time.replace('T', ' ');

    let TimeLast = Date.now() - moment(data_time_str, 'YYYY-MM-DD hh:mm:ss').valueOf(); //获得当前时间戳与datas时间戳的差值
  } catch (e) {
    return LawJudge.BuildStatus(wrongdatalaw, gas_data);
  }

  let Law_time = timeoutlaw.LAW_MIN_VALUE; //获得设定的超时时间戳
  let prop_id = Gas_Data.prop;
  if (TimeLast > Law_time) {
    //超时了
    return LawJudge.BuildStatus(timeoutlaw, gas_data);
  } else {
    return null;
  }
};

//判断值区间的函数
LawJudge.ValueJudge = function(gas_data, one_value_law) {
  //值域判断，如果在至于内就返回值域，不在就返回空

  let value = gas_data.value;
  if (value > one_value_law.LAW_MIN_VALUE && value < one_value_law.LAW_MAX_VALUE) {
    return LawJudge.BuildStatus(one_value_law, gas_data);
  } else {
    return null;
  }
};
module.exports = LawJudge;
