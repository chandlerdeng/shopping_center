/**
 * Created by Administrator on 2016/9/7.
 */
define(function (require, exports, module) {
    var fastclick = require("http://res.csc86.com/f=v2/shopping_center/market/js/src/fastclick");
    $(function() {
        FastClick.attach(document.body);
    });
    (function(win){
        var win = win,
            tips = function(adress,msg,id) {
                $("#"+adress).html(msg).show();
                $(id).is(":disabled") || $(id).focus().select();
                return false;
            },
            option = {
                regNum : /^\d+$/,
                regxphone:/^1\d{10}$/,
                num:60
            },
            countclear = "",
            codeId=null;
        //发送验证码还原到初时状态
        function reductionCount(id){
            clearInterval(countclear);
            option.num=60;
            $("#msg-content").hide();
            $("#"+id).val("重新获取验证码").prop("disabled", false)
        }
        //发送验证码倒计时
        function count(id,num) {
            if(num){
                option.num = num;
            }
            var id=id;
            function _c(){
                if(option.num<=0){
                    reductionCount(id);
                    return;
                }
                if($("#"+id).length){ $("#"+id).val(option.num+"秒后重新获取");}
                option.num--;
            };
            _c();
            countclear = setInterval(_c,1000);
        }

        function _uniq($pwd){
            var arr=[],l=$pwd.length;
            for(var i=0;i<l;i++){
                arr.push($pwd.charAt(i));
            }
            for(var i=0;i<arr.length;i++){
                for(var j=i+1;j<arr.length;j++){
                    if(arr[j]===arr[i]) {
                        arr.splice(j,1);
                        j--;
                    }
                }
            }
            if(arr.length<=1){
                $(".login_psd_e").show();
                return tips("msg-content",'不能使用相同的字母﹑数字或符号作为密码',"",null);
            }else{
                $(".login_psd_e").hide();
                $("#msg-content").html("").hide();
            }
            return true;
        }
        //对象的构造函数
        function sign(){};
        //手机格式验证长度大于等于11时
        sign.prototype.phonevaliate=function(){
            if($(this).is("[readonly]")) return;
            var $val=$.trim($(this).val());
            if($val.length>=11){
                if($val&&option.regxphone.test($val) == false){
                     tips("msg-content",'格式不正确,手机号码为11位数字',"", null);
                    $("#getPhoneCode").prop("disabled", true).removeClass("sh_bg_color_4");
                }else if($val&&option.regxphone.test($val)){
                    $("#msg-content").html("").hide();
                    $("#getPhoneCode").prop("disabled", false).addClass("sh_bg_color_4");
                }
            }
            if($val== ""){
                return tips("msg-content","手机号不能为空");
            }
        };
        //手机格式验证长度小于等于11时
        sign.prototype.phonevaliate_keyup=function(){
            if($(this).is("[readonly]")) return;
            var $val=$.trim($(this).val());
            if($val.length!=11){
                $("#getPhoneCode").prop("disabled", true).removeClass("sh_bg_color_4");
                return tips("msg-content",'请输入正确手机号码',"", null);
            }else{
                $("#getPhoneCode").prop("disabled", false).addClass("sh_bg_color_4");
                $("#msg-content").hide()
            }
        };
        //手机获取验证码(发送post请求)
        sign.prototype.getpluginPhoneCode=function(){
            var $val = $("#phone").val();
            $.post("http://m.csc86.com/register/getCode",{"phoneNumber":$val}, function(data) {
                console.log(data)
                if(data.status===false){
                    $("#msg-content").html(data.msg).show();
                    $("#getPhoneCode").prop("disabled",true).removeClass("sh_bg_color_4");
                    return ;
                }else if(data.status){
                    $("#msg-content").html("验证码发送成功，如1分钟后仍未收到,请重新获取").show();
                    codeId=data.data.codeId;
                    $("#phone").prop("disabled",true)
                    count("getPhoneCode");
                }else{
                    alert(data.msg);
                }
            },"jsonp");
        };

        //验证码长度认证
        sign.prototype.rcodevaliate_keyup = function(){
            var code = $("#rcode").val();
            if(code.length != 6){
                return tips("msg-content","请输入正确验证码");
            }else{
                $("#msg-content").html("").hide();
            }
        };
        //验证码是否为空认证
        sign.prototype.rcodevaliate = function(){
            var code = $("#rcode").val();
            if(code ==""){
                return tips("msg-content","短信验证码不能为空");
            }
        };
        //密码验证不能为空
        sign.prototype.pwdvaliate=function(){
            var $val=$.trim($("#password").val());
            if($val == ""){
                return tips("msg-content","密码不能为空");
            }
        };
        //密码验证长度及格式
        sign.prototype.pwdvaliate_keyup=function(){
            var $val=$.trim($("#password").val());
            var l=$val.length;
             if(($val&&l<6)||($val&&l>20)||$val == ""){
                 $(".login_psd_e").show();
                return tips("msg-content",'密码长度为6-20位，区分大小写');
            }else{
                 if($val){
                     return _uniq($val);
                 }
                 $("#msg-content").html("").hide();
             }
        };
        //手机注册验证(submit提交)
        sign.prototype.submitreg=function (){
            var $val=($("#phone").length&&$.trim($("#phone").val())),$pwd=$.trim($("#password").val()),l=$pwd.length;
            var flag=true,ped=true;
            //debugger;
            if (!$val) {
                flag=tips("msg-content",'请输入正确手机号码', "",null);
                return
            }else if(option.regxphone.test($val) == false){
                flag=tips("msg-content",'格式不正确,手机号码为11位数字',"",null);
                return
            }

            if (!$.trim($("#rcode").val())){
                flag=tips("msg-content",'短信验证码不能为空', "",null);
                return
            } else if ($.trim($("#rcode").val()).length!=6){
                flag=tips("msg-content",'请输入正确验证码', "",null);
                return
            }

            if(!l&&!$pwd) {
                flag=tips("msg-content",'密码不能为空', "",null);
                return
            }else if(($pwd&&l<6)||($pwd&&l>20)){
                flag=tips("passwordmtips",'密码长度为6-20位，区分大小写', "",null);
                return
            }else{
                if($pwd){
                    ped= _uniq($pwd);
                }
            }
            if(!flag){
                return false;
            }else if(!ped)
            {
                return false;
            }else{
                $("#phonesbmit").prop("disabled", true).val("注册中...");
            }
            if(flag&&ped){
                $.post("http://m.csc86.com/register",{
                    "password":$.trim($("#password").val()),
                    "phoneNumber":$.trim($("#phone").val()),
                    "verificationCode":$.trim($("#rcode").val()),
                    "codeId":codeId}, function(data) {
                    console.log(data);
                    if(data.status===false){
                        $("#msg-content").html(data.msg).show();
                        $("#phonesbmit").prop("disabled", false).val("完成");
                        return ;
                    }else if(data.status){
                        $("#phonesbmit").prop("disabled", false).val("完成");
                        $("#msg-content").html("注册成功！").show();
                        setTimeout(function(){
                            window.location.href="http://res.csc86.com/v2/shopping_center/market/html/login.html"
                        },4000)

                    }
                },"jsonp");
            }
        };
        if(!win["sign"]){
            win["sign"]=new sign();
        }
    })(window);


    $(function(){
        //手机格式验证（失去焦点触发验证）
        $("#phone").on({"blur":sign.phonevaliate,"keyup":sign.phonevaliate_keyup});
        //发送post请求获取手机验证码
        $("#getPhoneCode").on("click",sign.getpluginPhoneCode);
        //注册验证码
        $("#rcode").on({"blur":sign.rcodevaliate,"keyup":sign.rcodevaliate_keyup});
        //密码验证（失去焦点触发验证）
        $("#password").on({"blur":sign.pwdvaliate,"keyup":sign.pwdvaliate_keyup});
        //发送post请求submit
        $("#phonesbmit").on("click",sign.submitreg);
    });
});