/**
 * Created by Administrator on 2017/5/4.
 */
// 地区选择js
(function(){
    var select=document.getElementById("content").getElementsByTagName("select");
    var arr_country=["中国","美国"];
    var arr_province=[
        ["北京","天津","湖北","湖南"],
        ["旧金山","纽约州"]
    ];
    var arr_city=[
        [
            ["北京"],
            ["天津"],
            ["武汉","荆州","襄阳","天门"],
            ["长沙","郴州"]
        ],
        [
            ["旧金山0","旧金山1","旧金山2","旧金山3"],
            ["纽约0","纽约1","纽约2","纽约3"]
        ]

    ];
    //给定数组，select[?],把数组的内容循环添加进select[?]
    function add(select,arr){
        for(var i=0,str="";i<arr.length;i++){
            str+="<option>"+arr[i]+"</option>";
        }
        select.innerHTML=str;
    }
    // 起始状态
    add(select[0],arr_country);
    add(select[1],arr_province[0]);
    select[1].children[2].selected=true;
    add(select[2],arr_city[0][2]);
    // 省份
    // 判断国家的下拉菜单中哪个被选中
    var country=0;//被选中国家的索引
    select[0].onchange=function(){
        for(var i=0;i<arr_country.length;i++){
            if(select[0].children[i].selected==true){
                country=i;
            }
        }
        //把对应的省份放进去
        add(select[1],arr_province[country]);
        add(select[2],arr_city[country][0]);
    };
    //城市
    //判断哪个省份被选中
    var province=0;//被选中国家的索引
    select[1].onchange=function(){
        for(i=0;i<arr_province[country].length;i++){
            if(select[1].children[i].selected==true){
                province=i;
            }
        }
        //把对应的省份放进去
        add(select[2],arr_city[country][province]);
    };
}());

// 帮助和反馈的js
(function(){
    // 帮助,反馈对象
    var help=document.getElementById("content").getElementsByClassName("help")[0];
    var suggest=document.getElementById("content").getElementsByClassName("suggest")[0];
    // 点击的对象
    var title=document.getElementById("title");
    title.onclick=function(e){
        if(e.target==title.children[0]){
            title.children[0].className="click";
            title.children[1].className="";
            help.style.display="block";
            suggest.style.display="none";
            help.parentElement.style.height="1360px";
        }
        else{
            title.children[1].className="click";
            title.children[0].className="";
            help.style.display="none";
            suggest.style.display="block";
            help.parentElement.style.height="911px";
        }
    };
}());
