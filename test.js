var oracledb = require('oracledb');
var config = {
  user:'safe',
  password:'safe',
  connectString : "172.16.2.159:1521/web"
};
oracledb.getConnection(
  config,
  function(err, connection)
  {
    if (err) {
      console.error(err.message);
      return;
    }
    connection.execute("SELECT * from veri_workflow",
      function(err, result)
      {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        //打印返回的表结构
        console.log(result.metaData);
        //打印返回的行数据
        console.log(result.rows);    
      });
  });

function doRelease(connection)
{
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}


