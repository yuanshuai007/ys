/**
 * Created by Administrator on 2017/6/15.
 */
/*
* 接受上传的图片保存在img目录中
* 并把图片的地址上传到数据库
*
*
* */
const formidable=require("formidable");
const pool = require('./pool').pool;
module.exports={
    upload:function(req,res){
        var form = new formidable.IncomingForm();
        form.uploadDir ='../public/upload_img';
        form.encoding = 'utf-8';
        form.keepExtensions = true;	 //保留后缀
        //form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
        form.parse(req, function(err, fields, files) {
            //console.log("parse done");
            //console.log(fields,files);
            var obj={};
            if(err){
                console.log("上传发送错误"+err);
            }
            else{
                //console.log(files.upload);
                //console.log(files.upload.path);
                obj['code']=1;
                obj["src"]=files.upload.path;
                //把图片的地址存到数据库
                pool.getConnection(function (err,con) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        //console.log(req.session);
                        con.query("insert into t_upload_img values(null,?,?,?)",[req.session.user.uid,files.upload.path,new Date().getTime()],function (err,result) {
                            if(err){
                                console.log(err);
                            }
                            else{
                                if(result){
                                    res.json(obj);
                                }
                                else{
                                    console.log("把图片地址存入数据库失败");
                                }
                            }
                        });
                        con.release();
                    }
                })
            }

        });
    }
};