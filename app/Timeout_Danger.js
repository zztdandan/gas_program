const momnet=require('moment');
const query = require(path.join(process.cwd(), 'oracledb', 'query'));
async function Timeout_Danger(data) {//参数是传入的该超时节点的数据结构，主要是读取ID
data_time=momnet(data.real_time.replace('T',' '),'YYYY-MM-DD hh:mm:ss').valueOf();
query('select * from ')
}