require('linqjs');
const path = require('path');
const moment=require('moment');
var query = require(path.join(process.cwd(), 'oracledb', 'query'));
//判断危险流程
//对于警告数值的保存，现在拟定为30秒保存一次。任何超过normal的值都要保存起来
async function JudgeDanger(DataArr, proc) {
  //1、读取相应的Law，分为超时和普通两种

  query("select * from GAS_LAW_CONFIG where LAW_PROC= '" + proc + "'").then(function(dbres) {
    //   分类出两者的超时情况
    let normallaw = dbres.where(x => x.LAW_TYPE == 'normal');
    let timeoutlaw = dbres.where(x => x.LAW_STATUS == 'unit_timeout').first();
    //2、 取出Data中每一个数值做判断
    DataArr.forEach(Gas_Data => {
        //第一步先做超时law判断，如果超时了可以直接跳过后续的值判断了
        //先弄出时间戳

        let data_time_str=Gas_Data.real_time.replace('T',' ');
        
        let TimeLast=Date.now()-moment(data_time_str,'YYYY-MM-DD hh:mm:ss').valueOf();//获得当前时间戳与datas时间戳的差值
        
        let Law_time=timeoutlaw.LAW_MIN_VALUE;//获得设定的超时时间戳
        let prop_id=Gas_Data.prop;
                
        if(TimeLast>Law_time){//超时了

        }
        else{
            // 开启按值判断逻辑            
        normallaw.forEach(law=>{

        });
        }

    });
  });
}

module.exports = JudgeDanger;
