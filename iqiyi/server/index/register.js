/**
 * Created by Administrator on 2017/6/8.
 */
var pool=require("./pool.js").pool;
module.exports={
    register:function (req,res) {
        var ename=req.body.ename;
        var pw=req.body.pw;
        pool.getConnection(function(err,con){
            if(err){
                console.log("链接数据库错误:"+err);
            }
            else{         //要改的sql语句 普通数据类型字符串,数字要用?代替
                con.query("insert into t_user values (null,?,?,?,?)",[ename,pw,ename,0],function(err,result){
                    if(err){
                        console.log(err);
                    }
                    else{

                        if(result.length!=0){

                            res.json({"msg":"1"});
                            //console.log(11);
                        }
                        else{

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