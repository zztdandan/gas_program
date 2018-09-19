var oracledb = require("oracledb");
var dbConfig = require("./dbconfig");
//输入语句，回调函数调用结果
async function query_function(qry) {
  var doconnect = new Promise(function(resolve, reject) {
    oracledb.getConnection(
      {
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString
      },
      function(err, connection) {
        if (err) {
          reject(err);
        } else {
          resolve(connection);
        }
      }
    );
  });
  var doqry = async function(conn, qry) {
    try {
      var res = await conn.execute(qry, {}, { outFormat: oracledb.OBJECT });
      // outFormat can be OBJECT or ARRAY.  The default is ARRAY
    } catch (err) {
      return err;
    } finally {
      // console.log(res.rows);
      return res.rows;
    }
  };
  try {
    var conn = await doconnect;
    var result = await doqry(conn, qry);
  } catch (err) {
    return err;
  }
  if (conn) {
    await conn.close();
  }
  return result;
}
module.exports = query_function;
