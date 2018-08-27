var oracledb = require("oracledb");
var dbConfig = require("./dbconfig.js");

// bindDefs is optional for IN binds but it is generally recommended.
// Without it the data must be scanned to find sizes and types.

async function updatetable_table(fromtable, totable, where_condi) {
  let conn;
let result;
  try {
    const options = {
        autoCommit: true
        
      };
      let bind=new Array();
      bind.push(1);
    const truncateSql =
      "merge into "+totable+" t1 " +
      "USING "+fromtable+" t2 " +
      "on (t1.PROP = t2.PROP) " +
      "when matched then " +
      "update set t1.REAL_TIME=t2.REAL_TIME,t1.VALUE=t2.VALUE,t1.PROP_CNAME=t2.PROP_CNAME,t1.PROC_NO=t2.PROC_NO " +
      "when not matched then " +
      "insert " +
      "values " +
      "(t2.REAL_TIME,t2.PROP,t2.PROP_CNAME,t2.VALUE,t2.PROC_NO) ";
    conn = await oracledb.getConnection(dbConfig);
    result= await conn.execute(truncateSql,{},options);
  } catch (e) {
      console.log(e);
    return e;
  } 
    return result;
  
}

module.exports = updatetable_table;
