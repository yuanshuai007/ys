/**
 * Created by Administrator on 2017/6/18.
 */
var pool=require("../index/pool").pool;
module.exports={
    query_user:function (req,res) {
        //session没有取到
        if(!req.session.user){
            console.log("req.session.user没有数据");
            //console.log(req.session);
            //到服务器里面去找
            // pool.getConnection(function (con) {
            //     con.query("")
            // });
            res.json({code:-1,msg:"没有找到"});
        }
        else{
            console.log(req.session.user);
            res.json(req.session.user);
        }
    }
};