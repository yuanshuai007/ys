/**
 * Created by Administrator on 2017/6/2.
 */
var pool=require("./pool").pool;
module.exports={
    login:function(req,res){
        var ename=req.body.ename;
        var pw=req.body.pw;
        //链接数据库
        pool.getConnection(function(err,con){
            //var judge="";
            if(err){
                console.log("111"+err);
            }
            else{
                con.query("select id from t_user where tel=?",[ename],function(err,result){
                    if(err){
                        console.log(err);
                    }
                    else{
                        //空数组和有值得数组 用长度判断
                        if(result.length===0){
                            //-1:用户名不存在
                            res.json({"msg":"-1"});
                            //console.log(11);
                        }
                        else{
                            con.query("select id from t_user where tel=? and pw=?",[ename,pw],function(err,result){
                                if(result.length===0){
                                    //-2:用户名与密码不符
                                    res.json({"msg":"-2"});
                                    //console.log(11);
                                }
                                else{
                                    //把用户名和密码存在session
                                    req.session.user={};
                                    req.session.user["ename"]=ename;
                                    req.session.user['pw']=pw;
                                    //result返回的是数组对象
                                    //console.log(result);
                                    req.session.user['uid']=result[0].id;
                                    //console.log("存到session里面的user:");
                                    //console.log(req.session);
                                    //console.log(req.sessionStore);
                                    //console.log(req.cookies);
                                    //console.log(req.cookies.login);
                                    //把cookie的id 用户名 密码存到数据库
                                    var time=new Date().getTime();

                                    con.query("insert into t_cookie values (null,?,?,?,?)",[req.cookies.login,ename,pw,time],function (err,result) {
                                        if(err){
                                            console.log("存cookie到数据库时发生错误");
                                        }
                                        else{
                                            console.log(result);
                                        }
                                    });
                                    res.json({"msg":"1"});
                                }
                            });
                        }

                    }
                    con.release();
                });
            }
        });
    }
};

