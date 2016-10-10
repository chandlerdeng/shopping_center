/**
 * Created by Administrator on 2016/8/15.
 */
/**
 * Created by Administrator on 2016/8/13.
 */
define(function(require, exports, module) {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    //判断测试
    if (Sys.ie){
        console.log('IE: ' + Sys.ie);
        if(parseInt(Sys.ie)<10){
            document.getElementById("sh_css").src="../css/common_ie.css"
        }
    }
//	if (Sys.firefox) console.log('Firefox: ' + Sys.firefox);
    if (Sys.chrome){
     console.log(Sys.chrome)
    }
//	if (Sys.opera) console.log('Opera: ' + Sys.opera);
//	if (Sys.safari)console.log('Safari: ' + Sys.safari);
});