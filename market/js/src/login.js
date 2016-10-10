/**
 * Created by Administrator on 2016/9/7.
 */
define(function (require, exports, module) {
	var isLogin_stu = require('//api.csc86.com/notify/count/all/?callback=define');
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
			};
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
			if($val== ""){
				return tips("msg-content","用户名不能为空");
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
				flag=tips("msg-content",'用户名不能为空', "",null);
				return;
			}
			if(!l&&!$pwd) {
				flag=tips("msg-content",'密码不能为空', "",null);
				return;
			}else if(($val&&l<6)||($val&&l>20)){
				flag=tips("passwordmtips",'密码长度为6-20位，区分大小写', "",null);
				return;
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
				$("#phonesbmit").prop("disabled", true).val("登录中...");
			}
			if(flag&&ped){
				if (!isLogin_stu.status){
					$.post("http://m.csc86.com/member/toLogin",{
						"userName":$.trim($("#phone").val()),
						"password":$.trim($("#password").val())
					}, function(data) {
						console.log(data);
						if(data.status===false){
							$("#msg-content").html("登录失败！").show();
							$("#phonesbmit").prop("disabled", false).val("登录");
							return;
						}else if(data.status){
							var msg=data.msg
							console.log(msg)
							$("#phonesbmit").prop("disabled", false).val("登录");
							$("#msg-content").html("登录成功！").show();
							if(document.referrer!="http://res.csc86.com/v2/shopping_center/market/html/login_reg_acc.html"){
								window.location.href=document.referrer;//登录成功后返回到历史页面
							}else{
								window.location.href="http://m.csc86.com";//登录成功后返回到历史页面
							}
						}
					},"jsonp");
				}else{
					$("#msg-content").html("您已经登录！不能重复登录").show();
					setTimeout(function(){
						window.location.href="http://m.csc86.com";//重复登录，2秒后回到首页
					},2000)
				}
			}
		};
		if(!win["sign"]){
			win["sign"]=new sign();
		}
	})(window);
	$(function(){
		//手机格式验证（失去焦点触发验证）
		$("#phone").on({"blur":sign.phonevaliate});
		//密码验证（失去焦点触发验证）
		$("#password").on({"blur":sign.pwdvaliate,"keyup":sign.pwdvaliate_keyup});
		//发送post请求submit
		$("#phonesbmit").on("click",sign.submitreg);
	});
});