/**
 * Created by Administrator on 2017/6/19.
 */
const pool=require("../index/pool.js").pool;
module.exports={
    header_img:function (req,res) {
        pool.getConnection(function (err,con) {
            if(err){
                console.log(err);
            }
            else{
                console.log(req.session.user.uid);
                con.query(`select img from t_upload_img where uid=${req.session.user.uid}`,function (err,result) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        if(result.length>0){
                            res.json(result);
                        }
                        else{
                            res.json({code:-1,msg:'没有找到'});
                        }
                    }
                });
                con.release();
            }
        })
    }
};