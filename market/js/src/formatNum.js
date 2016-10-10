/**
 * Created by Administrator on 2016/9/13.
 */
/**
 * Created by Administrator on 2016/8/24.
 */
define(function(require, exports, module) {
    function formatNum(str){//实现数字每三位
    // 加逗号
        var newStr = "";
        var count = 0;
        if(str.indexOf(".")==-1){
            for(var i=str.length-1;i>=0;i--){
                if(count % 3 == 0 && count != 0){
                    newStr = str.charAt(i) + "," + newStr;
                }else{
                    newStr = str.charAt(i) + newStr;
                }
                count++;
            }
            str = newStr + ".00"; //自动补小数点后两位
            return str
        }
        else
        {
            for(var i = str.indexOf(".")-1;i>=0;i--){
                if(count % 3 == 0 && count != 0){
                    newStr = str.charAt(i) + "," + newStr;
                }else{
                    newStr = str.charAt(i) + newStr; //逐个字符相接起来
                }
                count++;
            }
            str = newStr + (str + "00").substr((str + "00").indexOf("."),3);
            return str
        }
    }
    module.exports=formatNum;
})