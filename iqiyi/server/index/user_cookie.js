/**
 * Created by Administrator on 2017/6/18.
 */
/*
*  主页一加载时，
*  把数据库里面的账号密码发给客户端
*/
var pool=require("./pool.js").pool;
module.exports={
    user_cookie:function (req,res) {
        var expires=3600*1000;
        //console.log(111);
        pool.getConnection(function (err,con) {
            if(err){
                console.log(err);
            }
            else{
                //console.log(req.cookies.login);
                con.query("select id,ename,time from t_cookie where cookie=?",[req.cookies.login],function (err,result) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        //console.log("返回的结果"+result);
                        console.dir(result);
                        //res.json(result);
                        //找的到记录
                        if(result.length>0){
                            //如果过期则发回-1
                            //console.log(new Date().getTime());
                            //console.log(result[0].time);
                            if(new Date().getTime()-result[0].time>=expires){
                                //console.log(111);
                                con.query("delete from t_cookie where id=?",[result[0].id],function (err,result) {
                                    //res.json({code:-2,msg:"数据库里面的cookie过期了"});
                                });
                                res.json({"code":-2,msg:"账号密码过期了"});
                            }
                            else{
                                var arr={};
                                arr["code"]=1;
                                arr["msg"]=result;
                                res.json(arr);
                            }
                        }
                        else{
                            res.json({code:-1,msg:"数据库里面没有cookie记录"});
                        }
                    }

                });
            }
            con.release();
        });
        //console.log(req.body.id);
        //res.send("收到了");
    }
};