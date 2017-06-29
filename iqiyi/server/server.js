var http=require("http");
var express=require("express");
var qs=require("querystring");
var bodyParser=require("body-parser");
// 设置服务器端的session
var session = require('express-session');
//设置客户端的cookie
var cookieParser = require('cookie-parser');
//获取app对象
var app=express();
//创建一个app服务器
var server=http.createServer(app);

var io=require("socket.io")(server);
//服务器开通并监听一个端口
server.listen(5050);

//链接数据库程序
var mysql=require("mysql");
var pool=mysql.createPool({
	host:"127.0.0.1",
	user:"root",
	password:"",
	database:"iqiyi",
	connectionLimit:5
});

//静态中间件如果找到了资源 不会进入其他的中间件和其他的get函数
//../public
app.use(express.static('../public'));

//cookie session中间件
app.use(cookieParser());
app.use(session({
    secret: '123456',
    name: 'login',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 3600*1000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true
}));

//post中间件 将二进制流的数据转出对象
//中间件接受一个函数作为参数
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// 重定向 首页---register
app.get("",function(req,res){
    res.redirect("/html/index.html");
    //console.log(1);
});

//手机号是否被注册
app.post("/register_name_repeat",require("./index/register_name_repeat.js").register);

//注册
app.post("/register",require("./index/register.js").register);

//图形统计
app.get("/chart",require("./index/chart.js").chart);

//订单
app.post("/buy_data",require("./index/user_center_data.js").data);

//登录
app.post("/login",require("./index/login.js").login);

//把用户名发给query_user请求 require("./person/query_user.js").query_user
app.get("/query_user",require("./person/query_user").query_user);

//接受客户端穿过来的cookie--id
app.get("/user_cookie",require("./index/user_cookie").user_cookie);

//删除cookie记录
app.get("/delete_cookie",require("./index/delete_cookie").delete_cookie);

//个人中心的请求处理
(function(){
    //上传图片
    app.post('/upload',require("./index/upload.js").upload);

    //初始化头像
    app.get('/header_img',require("./person/header_img.js").header_img);
}());

//弹幕
(function(){
    io.on("connection",function(socket){
        //将form数据转对象
        function parse_obj(str) {
            var arr=str.split("&");
            var brr=[],obj={};
            for(var i=0;i<arr.length;i++){
                brr=arr[i].split("=");
                obj[brr[0]]=brr[1];
            }
            return obj;
        }
        socket.on("send",function(msg){
            //console.log(msg);
            var obj=parse_obj(msg);
            // obj["border"]=false;
            // obj["color"]=$("chose").value;
            // obj["date"]=1307940958;
            // obj["dbid"]=30728603;
            // obj["hash"]='ffc4115b';
            // obj["mode"]=1;
            // obj["pool"]=0;
            // obj["position"]="absolute";
            // obj["size"]=25;
            // obj["stime"]=abpVideo.currentTime.toFixed(2);
            // obj["text"]=$("main").value;
            //console.log(obj);
            obj["border"]=parseFloat(obj["border"]);
            obj["color"]=parseFloat(obj["color"]);
            obj["date"]=parseFloat(obj["date"]);
            obj["dbid"]=parseFloat(obj["dbid"]);
            obj["mode"]=parseFloat(obj["mode"]);
            obj["pool"]=parseFloat(obj["pool"]);
            obj["size"]=parseFloat(obj["size"]);
            obj["stime"]=parseFloat(obj["stime"])*1000;

            console.log(obj);
            socket.broadcast.emit("receive",msg);
            //把收到的数据保存到数据库
            pool.getConnection(function(err,con){
                con.query("insert into t_danmu values(null,?,?,?,?,?,?,?,?,?,?,?)",[obj["border"],obj["color"],obj["date"],obj["dbid"],obj["hash"],obj["mode"],obj["pool"],obj["position"],obj["size"],obj["stime"],obj["text"]],function (err,result) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log(result);
                        if(result){
                            console.log("弹幕插入成功");
                        }
                    }
                });
                con.release();
            });
        });
        socket.emit("first","first data");
    });
//弹幕初始化
    app.get("/danmu_init",function (req,res) {
        console.log("弹幕初始化");
        pool.getConnection(function (err,con) {
            if(err){
                console.log(err);
            }
            else{
                con.query("select * from t_danmu",function (err,result) {
                    console.log("链接数据库");
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log(result);
                        res.json(result);
                    }

                });
            }
            //如果不断开 短时间内 会把链接沾满导致无法链接数据库
            con.release();
        });
    });
}());
