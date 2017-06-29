function comma(str){
    str=String(str);
    var start=0;
    var end=str.length%3;
    var len=0;//数组的长度
    if(str.length%3==0){
        len=parseInt(str.length/3);
    }
    else{
        len=parseInt(str.length/3)+1;
    }
    for(var i=0,arr=[];i<len;i++){
        arr[i]=str.slice(start,end);
        start=end;
        end+=3;
    }
    return arr.join();
}
console.log(comma(12345678));