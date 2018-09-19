var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

// bindDefs is optional for IN binds but it is generally recommended.
// Without it the data must be scanned to find sizes and types.

async function insert_many(manyArray) {
  let conn;
  let result;
  // let k=[{real_time: "20180821131410", prop: "RFL4.RFL4.MQBJ.MQBJ_1BRFL1", prop_cname: "热风炉底东面", value: 5}];
  const options = {
    autoCommit: true
  };
  try {
    const insertSql = "INSERT INTO GAS_WARNING_DATA values ( :STATUS_ID , to_date(:REAL_TIME, 'YYYYMMDDHH24MISS'), :REAL_TIME_VALUE , :STATUS_NAME)";
    conn = await oracledb.getConnection(dbConfig);

    result = await conn.executeMany(insertSql, manyArray, options);
  } catch (e) {
    console.log(e);
    return e;
  }

  // console.log(result);
  return result;
}

module.exports = insert_many;
