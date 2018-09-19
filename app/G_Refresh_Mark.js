const oraquery = require('../oracledb/query');
var config = require('../config');
var G_Refresh_Mark = async function() {
  let G_Mark = new Array();
  let List = await oraquery('select * from GAS_PROC_CONFIG t');
  async function doa(List){
    List.forEach(proc_no => {
      let name = proc_no.PROC_NO;
      let cname = proc_no.CNAME;
      G_Mark.push({
        name: name,
        cname: cname,
        Refresh_Mark: !(proc_no.ACTIVE === 'Y'),
        real_time_table:proc_no.REAL_TIME_TABLE,
        active: proc_no.ACTIVE === 'Y',
        resent_value:{},
        resent_refresh_time:0
      });
    });
    return G_Mark;
  }
   return doa(List);
  
};

module.exports = G_Refresh_Mark;
