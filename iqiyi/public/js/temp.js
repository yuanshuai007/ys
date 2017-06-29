/**
 * Created by Administrator on 2017/4/22.
 */
// 给搜索框做的js
(function(){
    var input = document.getElementById("search").firstElementChild;
    var search= document.getElementById("search");
    input.onfocus = function () {
        input.nextElementSibling.style.display = "block";
    }
    input.onblur = function () {
        input.nextElementSibling.style.display = "none";
    }
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


// 登录

// 原创按钮的js
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

