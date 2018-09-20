var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

// bindDefs is optional for IN binds but it is generally recommended.
// Without it the data must be scanned to find sizes and types.

async function update_to_status_real(data_status) {
  let conn;
  let result;
  // let k=[{real_time: "20180821131410", prop: "RFL4.RFL4.MQBJ.MQBJ_1BRFL1", prop_cname: "热风炉底东面", value: 5}];
  const options = {
    autoCommit: true
  };
  try {
    const insertSql = "INSERT INTO  GAS_STATUS_REAL values( :STATUS_ID,:PROP_ID,:STATUS_NAME,:STATUS_CNAME,to_date(:STATUS_START_TIME, 'YYYY-MM-DD HH24:MI:SS'),NULL,:VALUE,:PROC_NO )";
    conn = await oracledb.getConnection(dbConfig);

    result = await conn.execute(insertSql, data_status, options);
  } catch (e) {
    console.log(e);
    return e;
  }

  // console.log(result);
  return result;
}

module.exports = insert_many;
