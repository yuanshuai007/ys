/**
 * Created by Administrator on 2017/5/6.
 */
//ajax封装函数
function ajax(method,url,data,success){
    var xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        //连接服务器成功
        if(xhr.readyState===4&&xhr.status===200){
            console.log("与服务器连接成功");
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

//页面一加载就发的ajax ename和头像
(function(){
    //document.getElementById("username").innerHTML=window.opener.document.getElementById("person").getElementsByClassName("username")[0].innerHTML;
    //从服务器的session请求ename,pw
    var ename="";
    (function(){
        var success=function(xhr){
            //json数据转数组
            var arr=JSON.parse(xhr.responseText);
            if(arr.code===-1){
                //location.href="../html/index.html";
                console.log("没有收到");
            }
            else{
                console.log(arr);
                ename=arr.ename;
                document.getElementById("username").innerHTML=ename;
            }
        };
        ajax(
            "get",
            "/query_user",//请求的地址
            null,
            success
        );
    }());
    //向数据库中加载头像
    (function(){
        var success=function(xhr){
            //json数据转数组
            var arr=JSON.parse(xhr.responseText);
            if(arr.code===-1){
                //location.href="../html/index.html";
                console.log("没有收到");
            }
            else{
                // 头像图片对象
                var img=person.getElementsByClassName("head-pic")[0].children[0];
                var obj=arr[arr.length-1];
                console.log("收到的json"+arr);
                console.dir(arr);
                var index=obj.img.lastIndexOf("\\");
                var img_index=obj.img.slice(index+1);
                console.log(img_index);
                img.src="../upload_img/"+img_index;
            }
        };
        ajax(
            "get",
            "/header_img",//请求的地址
            null,
            success
        );
    }());

    //input 值事件
    var person=document.getElementById("person");
    // 因为前面头像上有一个input type=file 所以是1
    var input=person.getElementsByTagName("input")[1];
    // input.oninput=function(){
    //     console.log(1);
    // };
    // 给铅笔图标添加点击事件
    var pen=person.getElementsByClassName("signature")[0].getElementsByTagName("b")[0];
    // 取消对象
    var cancel=person.getElementsByClassName("input")[0].getElementsByClassName("cancel")[0];
    // 保存对象
    var save=person.getElementsByClassName("input")[0].getElementsByClassName("save")[0];
    pen.onclick=function(){
        pen.parentElement.style.display="none";
        enter.style.display="block";
        input.focus();
    };
    cancel.onclick=function(){
        pen.parentElement.style.display="block";
        enter.style.display="none";
    };
    save.onclick=function(){
        if(save.style.background=="rgb(90, 167, 0)"){
            pen.parentElement.style.display="block";
            pen.previousElementSibling.innerHTML=enter_content.value;
            enter.style.display="none";
            save.style.background="";
        }
    };
    // 给输入框添加值变化事件
    enter_content.oninput=function(){
        // 如果value为空颜色不能变
        if(enter_content.value!=""){
            save.style.background="#5AA700";
        }
        else{
            save.style.background="";
        }
    }
}());

// 下面动态，赞，上传的js
(function(){
    var title=document.getElementById("title");
    var main=document.getElementById("main");
    var index=0;
    title.onclick=function(e){
        for(var i=0,len=title.children[0].children.length;i<len;i++){
            if(e.target==title.children[0].children[i]){
                index=i;
            }
            main.children[0].children[i].style.display="none";
        }
        main.children[0].children[index].style.display="block";
    }
}());

// 换头像的js
(function(){
    var person=document.getElementById("person");
    // 头像图片对象
    var img=person.getElementsByClassName("head-pic")[0].children[0];
    // 上传input对象
    var input=form.upload;
    input.onchange=function(){
        //头像上传的ajax
        function ajax(data){
            var xhr= new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 &&xhr.status == 200) {
                    var obj=JSON.parse(xhr.responseText);
                    console.log(obj);
                    //切割找到文件名
                    var index=obj.src.lastIndexOf("\\");
                    var img_index=obj.src.slice(index+1);
                    console.log(img_index);
                    img.src="../upload_img/"+img_index;
                }
            };
            xhr.open("post", "/upload", true);
            xhr.send(data);
        }

        ajax(new FormData(form));
        // console.dir(input);
        // 新建一个FileReader对象
        // var reader=new FileReader();
        // // 将文件的url传给FileReader对象
        // reader.readAsDataURL(file);
        // // 给reader添加加载完成事件
        // reader.onload=function(e){
        //     // 加载事件的结果储存加载对象的路径
        //     img.src=e.target.result;
        //     // 给首页的头像换图片
        //     window.opener.document.getElementById("person").getElementsByTagName("img")[0].src=e.target.result;
        // };
    };
}());