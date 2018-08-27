var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

// bindDefs is optional for IN binds but it is generally recommended.
// Without it the data must be scanned to find sizes and types.

  

async function insert_many(tablename,manyArray){
  let conn;
  let result;
  // let k=[{real_time: "20180821131410", prop: "RFL4.RFL4.MQBJ.MQBJ_1BRFL1", prop_cname: "热风炉底东面", value: 5}];
  const options = {
    autoCommit: true
    
  };
  try{
    const truncateSql = "TRUNCATE TABLE "+tablename;
    const insertSql = "INSERT INTO "+tablename+" values (to_date(replace(:real_time,\'T\',\' \'), 'YYYY-MM-DD HH24:MI:SS'), :prop,:prop_cname,:value,:proc_no)";
    conn = await oracledb.getConnection(dbConfig);
    await conn.execute(truncateSql);
    result = await conn.executeMany(insertSql, manyArray, options);
  }catch(e){
    console.log(e);
    return e;
  }
  
    // console.log(result);
    return result;
  
}

module.exports=insert_many;