var oracledb = require("oracledb");
var dbConfig = require("./dbconfig");
//输入语句，回调函数调用结果
function query_function(qry, callback) {
  var doconnect = function(next) {
    oracledb.getConnection(
      {
        user: dbConfig.user,
        password: dbConfig.password,
        connectString: dbConfig.connectString
      },
      function(err, connection) {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log("Connection was successful!");
        next(connection);
      }
    );
  };

  // Note: connections should always be released when not needed
  var doRelease = function(connection) {
    connection.close(function(err) {
      if (err) {
        console.error(err.message);
      }
    });
  };

  doconnect(function(conn) {
    conn.execute(
      qry,
      {}, // A bind variable parameter is needed to disambiguate the following options parameter
      // otherwise you will get Error: ORA-01036: illegal variable name/number
      { outFormat: oracledb.OBJECT }, // outFormat can be OBJECT or ARRAY.  The default is ARRAY
      function(err, result) {
        if (err) {
          return callback(err, {});
        } else {
          console.log(
            "----- Cities beginning with 'S' (OBJECT output format) --------"
          );
          console.log(result.rows);
          return callback(null, result.rows);
        }
      }
    );
  });
}
module.exports = query_function;
