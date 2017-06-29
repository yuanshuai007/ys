/**
 * Created by Administrator on 2017/4/16.
 */
//全局匿名函数
(function(){
    //ajax封装函数
    function ajax(method,url,data,success){
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            //连接服务器成功
            if(xhr.readyState===4&&xhr.status===200){
                //console.log("与服务器连接成功");
                if(success!=undefined){
                    success(xhr);
                }
                else{
                    console.log("没有传入成功函数");
                }
                //eval(xhr.responseText);
                //success(xhr);
            }
        };
        if(arguments[0]==="get"){
            xhr.open("get",url,true);
            xhr.send(null);
        }
        else if(arguments[0]==="post"){
            xhr.open("post",url,true);
            xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
            xhr.send(data);
        }
        else{
            console.log("第一个参数必须是get或是post");
            return;
        }
    }

    //免登录 存取数据到服务器的session
    (function(){

        (function(){
            var success=function(xhr){
                //json数据转数组
                var arr=JSON.parse(xhr.responseText);
                if(arr.msg===-1){
                    //location.href="../html/index.html";
                    console.log("没有收到");
                }
                else{
                    //console.log(arr);
                }

            };
            ajax(
                "get",
                "/query_user",//请求的地址
                null,
                success
            );
        }());
        //把cookie发给服务器 接受用户名和密码
        (function(){
            var success=function(xhr){
                //json数据转数组
                var arr=JSON.parse(xhr.responseText);
                console.dir(xhr.responseText);
                //console.log(xhr.responseText.length);
                //console.log(xhr.responseText.toString().toString().toString());
                if(arr.code>0){
                    //console.log(11);
                    //将用户名显示到导航条上
                    (function(){
                        // 各种按钮的总对象
                        var btn=document.getElementById("button");
                        // 按钮上的用户名
                        var button_username=btn.children[0].children[0];
                        // 个人中心对象
                        var person=document.getElementById("person");
                        // 个人中心的用户名对象
                        var username=person.getElementsByClassName("username")[0];
                        var a=arr.msg[0].ename;
                        // 按钮上的用户名
                        btn.children[0].children[0].innerHTML=a;
                        // 判断用户名的长度 偏移量
                        var offset=0;
                        if(button_username.offsetWidth>=67){
                            button_username.className="text-hidden";
                            offset=67/2;
                        }
                        else{
                            offset=button_username.offsetWidth/2;
                        }
                        //给个人中心的left值
                        person.style.left=(-210+offset)+"px";
                        // 个人中心的用户名
                        username.innerHTML=a;
                    }());
                }

            };
            ajax(
                "get",
                "/user_cookie",//请求的地址
                null,
                success
            );
        }());

    }());

    // 导航条的滚动事件
    (function(){
        //返回顶部
        var top= document.getElementById("return").getElementsByClassName("return-top")[0];
        // 电梯楼层对象
        var lift=document.getElementById("lift");
        // 电梯楼层 娱乐 电视剧 对象
        var variety=lift.getElementsByClassName("variety")[0];
        var tv=lift.getElementsByClassName("tv")[0];
        var return_top=document.getElementById("return");
        var id1 = document.getElementById("navbar");
        window.onscroll=function () {
            //变量t是滚动条滚动时，距离顶部的距离
            var t = document.body.scrollTop;
            console.log(t);
            //当滚动到距离顶部200px时，返回顶部的锚点显示
            if (t > 589) {
                id1.className="js-navbar-start";
                return_top.className="return return-top-click";
                lift.style.bottom="500px";
            }
            if (t <= 589) {
                id1.className="";
                return_top.className="return";
                lift.style.bottom="";
            }
            // 娱乐
            if(t>=1900&&t<=2480){
                variety.style.background="#699F00";
                variety.style.color="#fff";
            }
            if(t<=1900||t>=2480){
                variety.style.background="";
                variety.style.color="";
            }
            if(t>=4450&&t<=5300){
                tv.style.background="#699F00";
                tv.style.color="#fff";
            }
            if(t<=4450||t>=5300){
                tv.style.background="";
                tv.style.color="";
            }
        };
        //回到顶部的运动函数
        // speed就是每次走的距离
        function move(obj,speed,distance){
            var index=0;
            clearInterval(time);//避免定时器重复执行
            var time=setInterval(
                function(){
                    if(parseFloat(obj.scrollTop)==distance){
                        clearInterval(time);
                    }
                    else{
                        obj.scrollTop=obj.scrollTop+speed;
                    }
                },
                30//每次走的时间
            );
        }
        // 电梯楼层的远动函数--向上走
        function move_up(speed,distance){
            var index=0;
            clearInterval(timer);//避免定时器重复执行
            var timer=setInterval(
                function(){
                    if(document.body.scrollTop<=distance){
                        clearInterval(timer);
                    }
                    else{
                        if(parseInt((document.body.scrollTop-distance)/150)==0){
                            speed=-10;
                        }
                        document.body.scrollTop=document.body.scrollTop+speed;
                    }
                },
                30//每次走的时间
            );
        }
        // 电梯楼层的远动函数--向下走
        function move_down(speed,distance){
            var index=0;
            clearInterval(timer);//避免定时器重复执行
            var timer=setInterval(
                function(){
                    if(document.body.scrollTop>=distance){
                        clearInterval(timer);
                    }
                    else{
                        if(parseInt((distance-document.body.scrollTop)/150)==0){
                            speed=10;
                        }
                        document.body.scrollTop=document.body.scrollTop+speed;
                    }
                },
                30//每次走的时间
            );
        }
        //返回顶部的点击事件
        top.onclick=function(){
            // 每次是0.3秒
            move(document.body,-(document.body.scrollTop/10),0);
            //document.body.scrollTop=0;
        };
        // 电梯楼层
        variety.onclick=function(){
            if(document.body.scrollTop<=2058){
                move_down(150,2058);
            }
            else if(document.body.scrollTop>=2480){
                move_up(-150,2058);
            }
        };
        tv.onclick=function(){
            if(document.body.scrollTop<=4593){
                move_down(150,4593);
            }
            else if(document.body.scrollTop>=5300){
                move_up(-150,4593);
            }
        };
    }());

    // 给搜索框做的js
    (function(){
        var input = document.getElementById("search").firstElementChild;
        var search= document.getElementById("search");
        input.onfocus = function () {
            input.nextElementSibling.style.display = "block";
        };
        input.onblur = function () {
            input.nextElementSibling.style.display = "none";
        };
        // 搜索框旁的按钮
        var btn = document.getElementById("search").lastElementChild;
        var ul = document.getElementById("search").children[1];
        // 锚点
        //var point= document.getElementById("point")
        btn.onclick=function(){
            if(input.value){
                // 历史搜索显示
                ul.children[0].style.display="block";
                var a=document.createElement("a");
                var li=document.createElement("li");
                // 所有的历史搜索都不能相等
                var a_history=search.querySelectorAll(".history");
                for(var i=0;i<a_history.length;i++){
                    if(input.value==a_history[i].innerHTML){
                        return;
                    }
                }
                a.innerHTML=input.value;
                a.className="history";
                li.appendChild(a);
                ul.insertBefore(li,ul.children[1]);
            }
            else{
                return;
            }
            if(ul.children.length==10){
                ul.removeChild(ul.lastElementChild);
            }
        }
    }());

    //导航条右边的各种按钮
    (function(){
        // 各种按钮的总对象
        var btn=document.getElementById("button");
        // 遮罩层对象
        var zzc=document.getElementById("zzc");
        // 登录界面对象
        var login=document.getElementById("login");
        // 注册界面对象
        var register=document.getElementById("register");
        // 表单对象
        var form=login.getElementsByTagName("form")[0];
        // 个人中心对象
        var person=document.getElementById("person");
        // 个人中心的用户名对象
        var username=person.getElementsByClassName("username")[0];
        // 个人中心的退出按钮
        var exit=document.getElementById("exit");
        // 按钮上的用户名
        var button_username=btn.children[0].children[0];
        // 各种按钮事件
        btn.addEventListener(
            "click",
            function(e){
                // 登录点击
                var menu=btn.querySelector("#button li:first-child ul");
                if(e.target==btn.children[0].children[0]&&e.target.innerHTML=="登录"){
                    zzc.style.display="block";
                    login.style.display="block";
                }
                // 个人中心界面显示
                if(e.target==btn.children[0].children[0]&&e.target.innerHTML!="登录"&&(person.style.display==""||person.style.display=="none")){
                    person.style.display="block";
                    return;
                }
                if(e.target==btn.children[0].children[0]&&e.target.innerHTML!="登录"&&(person.style.display=="block")){
                    person.style.display="none";
                }
                // 个人中心的退出按钮
                if(e.target==exit){
                    person.style.display="none";
                    // 退出时清除按钮上用户名的class
                    button_username.className="";
                    btn.children[0].children[0].innerHTML="登录";
                    //删除t_cookie记录
                    (function(){
                        var success=function(xhr){
                            //json数据转数组
                            var arr=JSON.parse(xhr.responseText);
                            if(arr.msg===-1){
                                //location.href="../html/index.html";
                                console.log("没有收到");
                            }
                            else{
                                //console.log(arr);
                            }

                        };
                        ajax(
                            "get",
                            "/delete_cookie",//请求的地址
                            null,
                            success
                        );
                    }());
                }
                // 点击注册
                if(e.target==btn.children[1].children[0]){
                    zzc.style.display="block";
                    register.style.display="block";
                }
            }
        );
        // 登录界面事件
        login.addEventListener(
            "click",
            function(e){
                // 叉叉的点击事件
                if(e.target.textContent=="×"){
                    zzc.style.display="none";
                    login.style.display="none";
                }

                // 登录--发送ajax
                //表单中找元素 可以用form.name
                //提示信息
                var tip=form.querySelectorAll(".tip");
                if(e.target==form.login_btn){
                    //发送ajax
                    var success=function(xhr){
                        //console.log(xhr.responseText);
                        var news=JSON.parse(xhr.responseText).msg;
                        // 只有注册成功才能将注册界面隐藏
                        if(news==="1"){
                            zzc.style.display="none";
                            login.style.display="none";
                            console.log("登录成功");
                            //将用户名显示到导航条上
                            (function(){
                                var a=form.ename.value;
                                // 按钮上的用户名
                                btn.children[0].children[0].innerHTML=a;
                                // 判断用户名的长度 偏移量
                                var offset=0;
                                if(button_username.offsetWidth>=67){
                                    button_username.className="text-hidden";
                                    offset=67/2;
                                }
                                else{
                                    offset=button_username.offsetWidth/2;
                                }
                                //给个人中心的left值
                                person.style.left=(-210+offset)+"px";
                                // 个人中心的用户名
                                username.innerHTML=a;
                            }());
                        }
                        else if(news==="-1"){
                            tip[0].innerHTML="用户名不存在";
                            tip[1].innerHTML="";
                            console.log("用户名不存在");
                        }
                        else{
                            tip[1].innerHTML="密码不对";
                            tip[0].innerHTML="";
                            console.log("密码不对");
                        }
                    };
                    //注册ajax 将ename pw 传到服务器
                    ajax(
                        "post",
                        "/login",
                        `ename=${form.ename.value}&pw=${form.pw.value}`,
                        success
                    );


                }
                //立即注册
                if(e.target==form.children[2].lastElementChild){
                    login.style.display="none";
                    register.style.display="block";
                }
            }
        );
    }());

    //注册
    (function(){
        var a=false,b=false,c=false;

        //注册界面--手机号码--失焦事件
        var phone=register.querySelector(".phone");
        phone.onblur=function(e){
            var msg0=register.querySelectorAll(".msg")[0];
            //提示信息
            var phone_tip=register.querySelector(".phone-tip");
            if(/^1[3578][0-9]{9}$/.test(this.value)){
                //手机格式正确后，发送ajax确认手机是否已被注册
                var success=function(xhr){
                    //console.log(xhr.responseText);
                    var news=JSON.parse(xhr.responseText).msg;
                    //手机没有被注册
                    if(news==="-1"){
                        console.log("手机没有被注册");
                        msg0.style.background="url(../img/background.png)"+" "+(-40)+"px"+" "+0;
                        a=true;
                        phone_tip.innerHTML="";
                    }
                    else{
                        console.log("手机被注册");
                        msg0.style.background="url(../img/background.png)"+" "+(-60)+"px"+" "+0;
                        a=false;
                        phone_tip.innerHTML="已被注册";
                    }

                };
                //注册ajax 将ename pw 传到服务器
                ajax(
                    "post",
                    "/register_name_repeat",
                    `ename=${phone.value}`,
                    success
                );

            }
            else{
                // 手机格式不正确
                msg0.style.background="url(../img/background.png)"+" "+(-60)+"px"+" "+0;
                a=false;
                phone_tip.innerHTML="格式不对";
            }

        };

        //注册界面--密码--失焦事件
        var pw=register.querySelector(".pw");
        pw.onblur=function(e){
            var msg1=register.querySelectorAll(".msg")[1];
            var reg=new RegExp("^[0-9a-zA-Z!@#$%^&*?(){}]{8,20}$");
            var reg0=new RegExp("^[0-9]{8,20}$");
            var reg1=new RegExp("^[a-zA-Z]{8,20}$");
            if(reg.test(this.value)){
                if(reg0.test(this.value)||reg1.test(this.value)){
                    msg1.style.background="url(../img/background.png)"+" "+(-60)+"px"+" "+0;
                    b=false;
                }
                else{
                    msg1.style.background="url(../img/background.png)"+" "+(-40)+"px"+" "+0;
                    b=true;
                }
            }
            else{
                msg1.style.background="url(../img/background.png)"+" "+(-60)+"px"+" "+0;
                b=false;
            }
        };

        //注册界面--验证码--失焦事件
        var words="";//随机生成的验证码
        //验证码出现的位置
        var canvas=register.querySelector("canvas");
        //验证码刷新
        var auth_refresh=function(){
            var pen=canvas.getContext("2d");
            var word="ABCDEFGHJKLMNPQRSTWXY3456789";
            //随机数
            function rn(min,max){
                return parseInt(Math.random()*(max-min)+min);
            }
            //随机颜色
            function rc(degree){
                // console.log(degree);
                if(degree===undefined){
                    return `rgb(${rn(0,256)},${rn(0,256)},${rn(0,256)})`;
                }
                else if(degree==="light"){
                    return `rgb(${rn(200,256)},${rn(200,256)},${rn(200,256)})`;
                }
                else if(degree==="deep"){
                    return `rgb(${rn(0,100)},${rn(0,100)},${rn(0,100)})`;
                }
            }
            //随机文字
            function rw(i){
                var str=word.charAt(rn(0,word.length));
                pen.font = '25px sans-serif';
                pen.fillStyle=rc("deep");
                pen.textBaseline = 'top';

                var width=pen.measureText(str).width;
                var space=(canvas.width-4*width)/5;

                pen.fillText(str,space*(i+1)+width*i,0);
                return str;
            }
            //随机的干扰线
            function rl(){
                var n=parseInt(Math.random()*101);//宽
                var m=parseInt(Math.random()*31);//高
                pen.beginPath();
                pen.moveTo(n,m);
                n=parseInt(Math.random()*101);//宽
                m=parseInt(Math.random()*31);//高
                pen.lineTo(n,m);
                pen.strokeStyle=rc();
                pen.stroke();
            }
            //100个半径为1的圆点
            function rr(){
                for(var i=0;i<100;i++){
                    var n=parseInt(Math.random()*101);//宽
                    var m=parseInt(Math.random()*31);//高
                    pen.beginPath();
                    pen.arc(n,m,1,0,2*Math.PI);
                    pen.fillStyle=rc();
                    //console.log(rc());
                    pen.fill();
                }
            }
            //背景颜色
            pen.fillStyle=rc("light");
            pen.fillRect(0,0,canvas.width,canvas.height);
            for(var i=0;i<4;i++){
                words+=rw(i);
                rl();
            }
            rr();
        };
        //第一次刷新
        auth_refresh();
        //注册码失焦事件
        var auth_enter=register.querySelector(".auth_enter");
        auth_enter.onblur=function(e){
            var msg2=register.querySelectorAll(".msg")[2];
            var re=new RegExp("^"+words+"$","i");
            if(re.test(auth_enter.value)){
                msg2.style.background="url(../img/background.png)"+" "+(-40)+"px"+" "+0;
                c=true;
            }
            else{
                msg2.style.background="url(../img/background.png)"+" "+(-60)+"px"+" "+0;
                c=false;
            }
        };


        // 注册界面点击事件
        register.onclick=function(e){

            // 叉叉的点击事件
            if(e.target.textContent=="×"){
                zzc.style.display="none";
                register.style.display="none";
            }
            if(e.target.className=="refresh"){
                auth_refresh();
            }
            // 注册界面--注册--点击事件
            if(e.target==reg_btn){
                if(!a){
                    phone.focus();
                }
                else if(!b){
                    pw.focus();
                }
                else if(!c){
                    auth_enter.focus();
                }
                else if(a&&b&&c){
                    var success=function(xhr){
                        //console.log(xhr.responseText);
                        var news=JSON.parse(xhr.responseText).msg;
                        // 只有注册成功才能将注册界面隐藏
                        if(news==="1"){
                            zzc.style.display="none";
                            register.style.display="none";
                            console.log("注册成功");
                        }
                        else if(news==="-1"){
                            console.log("注册失败");
                        }
                    };
                    //注册ajax 将ename pw 传到服务器
                    ajax(
                        "post",
                        "/register",
                        `ename=${phone.value}&pw=${pw.value}`,
                        success
                    );

                }
            }
            // //注册界面--立即登录--点击事件
            // var right_now=form.children[4].children[2];
            // if(e.target==right_now){
            //     register.style.display="none";
            //     login.style.display="block";
            // }
        };

    }());

    //头部大幅图片轮播
    (function(){
        // 头部对象
        var header=document.getElementById("header");
        // 图片对象
        var banner=document.getElementById("banner");
        //图片对应的文字对象
        var words_banner=document.getElementById("words_banner");
        //banner轮播函数
        var index=0;//图片轮播时 对应的序号
        var x=0;//文字列表移入时 对应的序号
        //自动轮播
        function task(){
            for(var i=0,len=banner.children.length;i<len;i++){
                if(banner.children[i].className=="active"){
                    index=i;
                }
                banner.children[i].className="";
                words_banner.children[i].children[0].className="";
            }
            if(banner.children[index+1]==null){
                banner.children[0].className="active";
                words_banner.children[0].children[0].className="select";
            }
            else{
                banner.children[index+1].className="active";
                words_banner.children[index+1].children[0].className="select";
            }

        }
        var time=setInterval(task,3000);
        // 头部的移入事件
        header.onmouseenter=function(){
            clearInterval(time);
            time=null;
        };
        // 头部的移出事件
        header.onmouseleave=function(){
            time=setInterval(task,3000);
        };
        // 文字列表的移入事件
        for(var i=0,len=banner.children.length;i<len;i++){
            words_banner.children[i].children[0].onmouseenter=function(e){
                // 图片,文字列表先都清除class
                for(var j=0,len=banner.children.length;j<len;j++){
                    banner.children[j].className="";
                    words_banner.children[j].children[0].className="";
                }
                for(var j=0,len=banner.children.length;j<len;j++){
                    if(e.target==words_banner.children[j].children[0]){
                        banner.children[j].className="active";
                        words_banner.children[j].children[0].className="select";
                        break;
                    }
                }

            };
        }
    }());

    //焦点的轮播
    (function(){
        function srcoll(obj_img){
            // 封装一个运动函数
            function move(obj,speed,distance){
                var index=0;
                clearInterval(time);//避免定时器重复执行
                var time=setInterval(
                    function(){
                        if(parseFloat(obj.style.left)==distance){
                            clearInterval(time);
                        }
                        else{
                            obj.style.left=obj.offsetLeft+speed+"px";
                        }
                    },
                    30
                );
                // 清除所有文字列表的class
                for(var i=0,len=banner.children.length;i<len;i++){
                    if(p[i].className=="visible"){
                        index=i;
                    }
                    p[i].className="";
                }
                if(p[index+1]==null){
                    p[0].className="visible";
                }
                else{
                    p[index+1].className="visible";
                }
            }
            // 图片的父对象
            var parent=obj_img.parentElement;
            var next=parent.getElementsByClassName("next")[0];
            var previous=parent.getElementsByClassName("previous")[0];
            // 文字列表对象
            var p=parent.getElementsByTagName("p");
            // 自动轮播函数
            var timer=setInterval(function(){
                move(obj_img,-38,-380);
                if(obj_img.style.left!=""){
                    obj_img.appendChild(obj_img.removeChild(obj_img.children[0]));
                    obj_img.style.left="";
                }


            },2000);
            // 移入事件
            parent.onmouseenter=function(){
                clearInterval(timer);
            };
            // 移出事件
            parent.onmouseleave=function(){
                timer=setInterval(function(){
                    move(obj_img,-38,-380);
                    if(obj_img.style.left!=""){
                        obj_img.appendChild(obj_img.removeChild(obj_img.children[0]));
                        obj_img.style.left="";
                    }
                },2000);
            };
            next.onclick=function(){
                /* var time=setTimeout(
                 function(){
                 banner.appendChild(banner.removeChild(banner.children[0]));
                 banner.className="banner_img";
                 },
                 1000
                 );
                 banner.className="banner_img move";*/
                move(obj_img,-38,-380);
                if(obj_img.style.left!=""){
                    obj_img.appendChild(obj_img.removeChild(obj_img.children[0]));
                    obj_img.style.left="";
                }
            };
            previous.onclick=function(){
                //初始化
                /*if( banner.style.left==""){
                 banner.style.left=-380+"px";
                 for(var i=0,len=banner.children.length;i<len;i++){
                 banner.children.className="rf";
                 }
                 }
                 //var time=setTimeout(
                 //function(){
                 banner.insertBefore(banner.removeChild(banner.children[1]),banner.children[0]);
                 banner.children[0].className="rf";
                 // },
                 //1000
                 //  );*/
                // banner.children[1].className="rf move_previous";
                /*var time=setTimeout(
                 function(){
                 banner.children[0].className="move_previous";
                 },
                 1000
                 );
                 banner.insertBefore(banner.removeChild(banner.children[1]),banner.children[0]);
                 banner.children[0].className="";*/
                move(obj_img,38,0);
                if(obj_img.style.left!=-380+"px"){
                    obj_img.insertBefore(obj_img.removeChild(obj_img.children[1]),obj_img.children[0]);
                    obj_img.style.left=-380+"px";
                }

            };
        }
        var banner=document.getElementById("banner_img");
        var banner_variety=document.getElementById("banner_variety");
        srcoll(banner);
        srcoll(banner_variety);
    }());

    //原创按钮的js
    (function(){
        var btn=document.getElementById("original").getElementsByTagName("button");
        for(var i=0;i<btn.length;i++) {
            btn[i].addEventListener(
                "click",
                function(e){
                    if(this.className==""){
                        this.className="button_color";
                    }
                    else{
                        this.className="";
                    }
                }
            );
            btn[i].addEventListener(
                "blur",
                function(){
                    this.className="";
                }
            );
        }
    }());

    //推广广告
    (function() {
        var index=0;//开始图片的序号；
        var arr_index = [0, 6, 12, 5, 11, 4, 10, 3, 9, 2, 8, 1, 7];
        // 获取可视区域的图片对象
        var pic = document.getElementById("ad_pic");
        // 两张小图片的对象
        var two=pic.getElementsByClassName("two");
        // 大图的对象
        var big=pic.getElementsByClassName("big");
        // 上一页的对象
        var previous = pic.parentElement.parentElement.getElementsByClassName("ad-previous")[0];
        // 下一页的对象
        var next = pic.parentElement.parentElement.getElementsByClassName("ad-next")[0];
        previous.onclick = function () {
            index++;
            if(index==13){
                index=0;
            }
            var y=arr_index[index];
            for(var i=0;i<7;i++){
                if(y==13){
                    y-=13;
                }
                two[i].children[0].src="../img/ad/"+(y+1)+".0.jpg";
                two[i].children[1].src="../img/ad/"+(y+1)+".1.jpg";
                big.src="../img/ad/"+(y+1)+".2.jpg";
                y++;
            }
        };
        next.onclick = function () {
            index--;
            if(index==-1){
                index=12;
            }
            var y=arr_index[index];
            for(var i=0;i<7;i++){
                if(y==13){
                    y-=13;
                }
                two[i].children[0].src="../img/ad/"+(y+1)+".0.jpg";
                two[i].children[1].src="../img/ad/"+(y+1)+".1.jpg";
                big[i].children[0].src="../img/ad/"+(y+1)+".2.jpg";
                y++;
            }
        };
        // 为每一个pic绑定移入事件
        var z=0;
        for(var i=0;i<7;i++){
            pic.children[i].children[0].addEventListener(
                "mouseenter",
                function(e){
                    for(var j=0;j<7;j++){
                        if(e.target==pic.children[j].children[0]){
                            z=j;
                            if(j<=4){
                                for(var x=0;x<j;x++){
                                    pic.children[x].style.width="0";
                                    pic.children[x].style.marginRight="0";
                                }
                            }
                            else if(j>=5){
                                for(var x=0;x<j-2;x++){
                                    pic.children[x].style.width="0";
                                    pic.children[x].style.marginRight="0";
                                }
                            }
                            pic.children[j].className="pic-visible pic-hover";
                            big[j].className="lf big big-hover";
                        }
                    }
                }
            );
            pic.children[i].addEventListener(
                "mouseleave",
                function(){
                    for(var x=0;x<7;x++){
                        pic.children[x].style.width="";
                        pic.children[x].style.marginRight="";
                    }
                    pic.children[z].className="pic-visible";
                    big[z].className="lf big";
                }
            );
        }
    }());


}());




