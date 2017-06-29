/**
 * Created by Administrator on 2017/6/7.
 */
var pool=require("./pool").pool;
module.exports={
    register:function(req,res){
        var ename=req.body.ename;
        //console.log("收到发过来的手机号:"+ename);
        pool.getConnection(function(err,con){
            if(err){
                console.log("链接数据库错误:"+err);
            }
            else{         //要改的sql语句 普通数据类型字符串,数字要用?代替
                con.query("select id from t_user where tel=?",[ename],function(err,result){
                    if(err){
                        console.log(err);
                    }
                    else{
                        //空数组和有值得数组 用长度判断
                        if(result.length!=0){
                            //1:手机已被注册
                            res.json({"msg":"1"});
                            //console.log(11);
                        }
                        else{
                            //-1:手机没有被注册
                            res.json({"msg":"-1"});
                            //console.log(-11);
                        }

                    }
                    con.release();
                });
            }
        });
    }
};