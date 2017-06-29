/**
 * Created by Administrator on 2017/6/12.
 * 播放页面
 */
(function () {
    var $1=function (id) {
        //console.log(444);
        return document.getElementById(id);
    };
    //ajax封装函数
    function ajax(method, url, data, success) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            //连接服务器成功
            if (xhr.readyState === 4 && xhr.status === 200) {
                //console.log("与服务器连接成功");
                if (success != undefined) {
                    success(xhr);
                }
                else {
                    console.log("没有传入成功函数");
                }
                //eval(xhr.responseText);
                //success(xhr);
            }
        };
        if (arguments[0] === "get") {
            xhr.open("get", url, true);
            xhr.send(null);
        }
        else if (arguments[0] === "post") {
            xhr.open("post", url, true);
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            xhr.send(data);
        }
        else {
            console.log("第一个参数必须是get或是post");
            return;
        }
    }

    //form数据和对象转化的方法
    var parse={
        _str:function parse_str(obj){
            var str="";
            for(key in obj){
                str+=key+"="+obj[key]+"&";
            }
            str=str.slice(0,str.length-1);
            return str;
        },
        _obj:function parse_obj(str) {
            var arr=str.split("&");
            var brr=[],obj={};
            for(var i=0;i<arr.length;i++){
                brr=arr[i].split("=");
                obj[brr[0]]=brr[1];
            }
            return obj;
        }
    };

    //播放器的各种事件
    (function(){
        //双击--全屏--退出全屏
        (function () {
           //全屏
            $1("player").ondblclick=function () {
                var element=$1("player");
                //console.log(document.webkitIsFullScreen);
                // if(document.webkitIsFullScreen){
                //     //谷歌退出全屏函数
                //     document.webkitCancelFullScreen();
                //     console.log("退出全屏");
                // }
                //else{
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.mozRequestFullscreen) {
                        element.mozRequestFullscreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen();
                    }
                //}
            };
            document.onwebkitfullscreenchange=function () {
                console.log(111);
                if(document.webkitIsFullScreen){
                    document.body.ondblclick=function () {
                        document.webkitCancelFullScreen();
                    }
                }
                else{
                    document.body.ondblclick=null;
                }
            }
        }());

    }());

    //加载头和尾
    (function () {
        //头部请求
        var success = function (xhr) {
            //json数据转数组
            //var arr=JSON.parse(xhr.responseText);
            //console.log(xhr.responseText);
            header.innerHTML = xhr.responseText;
        };
        ajax(
            "get",
            "header.html",//法送的地址
            null,
            success
        );
        //尾部请求
        var success1 = function (xhr) {
            //json数据转数组
            //var arr=JSON.parse(xhr.responseText);
            //console.log(xhr.responseText);
            foot.innerHTML = xhr.responseText;
        };
        ajax(
            "get",
            "footer.html",//法送的地址
            null,
            success1
        );
    }());

    //发弹幕的控制条
    (function(){
        //弹幕的开关
        (function(){
            var switch_=play.querySelector(".out_container").querySelector(".switch");
            switch_.onclick=function () {
                //console.log(switch_.className);
                if(switch_.className=="switch off"){
                    switch_.className="switch on";
                }
                else{
                    switch_.className="switch off";
                }
            };
        }());
        //颜色的选择
        var color_index=0;
        (function(){
            var li=color_select.querySelectorAll("li");
            var div=color_select.querySelectorAll("div");
            color_select.onclick=function (e) {
                for(var i=0;i<li.length;i++){
                    li[i].className="";
                    if(e.target==li[i]||e.target==div[i]){
                        li[i].className="circle";
                        color_index=i;
                    }
                }
            };
            color_select.onmouseleave=function () {
                setTimeout(function () {
                    color_select.style.display="none";
                },500);
            }
        }());
        //颜色选择的弹出
        (function(){
            var color=play.querySelector(".out_container").querySelector(".set").querySelector(".color");
            color.onclick=function () {
                if(color_select.style.display==="none"){
                    color_select.style.display="block";
                }
                else{
                    color_select.style.display="none";
                }
            }
        }());
        //发弹幕
        (function(){

            //颜色数组
            var arr=["0xfffff","0xF30715","0xFD9922","0xFEF032","0x25FD30","0x28FCFE"];
                //这里不能写window.load 因为已经先执行了
                //加载前端弹幕发射功能
                (function(){
                    var CM = new CommentManager($1('commentCanvas'));
                    abpVideo.onloadeddata=function(){
                        //console.log("自定义执行init");
                        CM.init();

                        CM.start();
                        window.CM = CM;
                        var list={
                            "dur": 3000,
                            "size": 25,
                            "stime": 0,
                            "mode": 1
                        };
                        //socket.io链接服务器
                        var socket=io("http://127.0.0.1:8080");
                        socket.on("first",function(msg){
                            console.log(msg);
                        });
                        //把弹幕发送到其他用户的屏幕上
                        socket.on("receive",function(msg){
                            var obj=parse._obj(msg);
                            list.text=obj.text;
                            list.color=parseInt(obj.color);
                            CM.send(list);
                            console.log(obj.color);
                        });
                        //把弹幕发送到自己的屏幕上
                        $1("send").addEventListener("click",function(e){
                            if($1("main").value==""){
                                console.log("输入为空");
                                return ;
                            }
                            else{
                                list.text=$1("main").value;
                                //颜色必须是十进制的数字
                                list.color=(parseInt(arr[color_index]));
                                CM.send(list);
                                e.stopPropagation();
                                e.preventDefault();
                                //把弹幕发送给服务器
                                (function(){

                                    var obj={};

                                    obj["border"]=0;
                                    obj["color"]=parseInt(arr[color_index]);
                                    obj["date"]=1307940958;
                                    obj["dbid"]=30728603;
                                    obj["hash"]='ffc4115b';
                                    obj["mode"]=1;
                                    obj["pool"]=0;
                                    obj["position"]="absolute";
                                    obj["size"]=25;
                                    obj["stime"]=abpVideo.currentTime.toFixed(2);
                                    console.log(obj["stime"]);
                                    obj["text"]=$1("main").value;
                                    var str=parse._str(obj);
                                    socket.emit("send",str);
                                }());
                            }
                        })
                    };
                }());

        }());
    }());

    //动态生成列表
    (function(){

        for(var i=0,arr=[];i<50;i++){
            arr.push("第"+(i+1)+"集");
        }
        for(var i=0,str="";i<arr.length;i++){
            str+=`<div>${arr[i]}</div>`;
        }
        v_list.querySelector(".list_container").innerHTML=str;
        //滚动设置
        (function () {
            //console.log($,$("#v_list"));
            document.querySelector("#v_list").querySelector(".list_container").onmousewheel=function (event) {
                var scrollTop = this.scrollTop,
                    scrollHeight = this.scrollHeight,
                    height = this.clientHeight;

                var delta = (event.wheelDelta) ? event.wheelDelta : -(event.detail || 0);
                //console.log(delta);
                if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
                    // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
                    this.scrollTop = delta > 0? 0: scrollHeight;
                    // 向上滚 || 向下滚
                    event.preventDefault();
                }
            };
        }());
    }());
}());
