/**
 * Created by Administrator on 2016/9/23.
 */

define(function(require, exports, module) {
    var name,value='', i;
    var str=location.href.toString().toLowerCase(); //获得浏览器地址栏URL串
    var num=str.indexOf("?")
    str=str.substr(num+1); //截取“?”后面的参数串
    var arrtmp=str.split("&"); //将各参数分离形成参数数组
    var showStr="";
    for(i=0;i < arrtmp.length;i++)
    {
        num=arrtmp[i].indexOf("=");
        if(num>0)
        {
            name=arrtmp[i].substring(0,num);//取得参数名称
            value=arrtmp[i].substr(num+1); //取得参数值
            this[name]=value; //定义对象属性并初始化
            showStr+="name="+name+" value="+value+"<br />";//测试是否获取到url地址里面参数
        }
    }
    module.exports=value;
})
