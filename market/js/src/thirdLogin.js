/*只有登录页面中才调用些JS，弹窗登录 按旧版的JS封闭第三方登录代码*/

$(function(){

	var TrdLogin = function(option){
		var option = {
			obj : option.obj,
			arg : option.arg
		}
		$(option.obj).bind("click",function(){
			$.post("thirdLogin",{"source":option.arg},function(response){
				if(response.status){
					//window.open(response.msg,'oauth2Login_10060' ,'height=600,width=600, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes');
					window.location.href = response.msg;
				}else{
					alert(response.msg);
				}
			},"jsonp");
		});
	};

	TrdLogin({obj:"#qqLoginBtn",arg:"QQ"});
	TrdLogin({obj:"#wb_connect_btn",arg:"sina"});
	TrdLogin({obj:"#weixinlogin",arg:"WX"});
	
});

