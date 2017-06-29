/**
 * Created by Administrator on 2017/6/2.
 */
//链接数据库程序
var mysql=require("mysql");
var pool=mysql.createPool({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:"iqiyi",
    connectionLimit:5
});
module.exports={
    pool:pool
};