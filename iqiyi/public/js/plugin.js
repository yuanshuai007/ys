/**
 * Created by Administrator on 2017/5/4.
 */
if(window.$===undefined){
    $.obj={};
    $.obj.sum=function(arr){
        for(var i=0,str=0;i<arr.length;i++){
            str+=arr[i];
        }
        return str;
    };
}