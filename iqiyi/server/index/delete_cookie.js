/**
 * Created by Administrator on 2017/6/18.
 */
var pool=require("./pool.js").pool;
module.exports={
    delete_cookie:function (req,res) {
        pool.getConnection(function (err,con) {
            console.log(req.cookies.login);
            con.query("delete from t_cookie where cookie=?",[req.cookies.login],function (err,result) {
                console.log(111);
               res.json({"code":1,msg:"删除成功"});
            });
            con.release()
        })
    }
};