var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

// bindDefs is optional for IN binds but it is generally recommended.
// Without it the data must be scanned to find sizes and types.

async function insert_many(manyArray) {
  let conn;
  let result;
  const options = {
    autoCommit: true
  };
  try {
    const insertSql = "INSERT INTO GAS_STATUS_HISTORY values ( :STATUS_ID ,:PROP_ID,:STATUS_NAME,:STATUS_CNAME,to_date(:STATUS_START_TIME, 'YYYY-MM-DD HH24:MI:SS'),to_date(:STATUS_START_TIME, 'YYYY-MM-DD HH24:MI:SS'))";
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
