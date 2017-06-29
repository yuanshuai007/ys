/**
 * Created by Administrator on 2017/5/6.
 */
// 三个点的自动隐藏
(function(){
    var self=document.getElementById("byself");
    var p=self.getElementsByTagName("p");
    // 判断p的高度
    for(var i=0,len=p.length;i<len;i++){
        if(p[i].offsetHeight>42){
            p[i].style.overflow="hidden";
            p[i].innerHTML=p[i].innerHTML.slice(0,17)+"...";
        }
        else{
            p[i].style.height=42+"px";
        }
    }

}());