/**
 * Created by Administrator on 2016/9/23.
 */
/**
 * Created by Administrator on 2016/9/13.
 */
/**
 * Created by Administrator on 2016/8/24.
 */
define(function(require, exports, module) {
    var isLogin = require('//api.csc86.com/notify/count/all/?callback=define');
    var fastclick = require("fastclick");//fastclick
    $(function() {
        FastClick.attach(document.body);
    });
    function jump_shopCart() {
        //alert("111")
        window.location.href = "http://res.csc86.com/v2/shopping_center/market/html/pro_de_cart.html"
    }
    function login_page() {
        window.location.href = "http://res.csc86.com/v2/shopping_center/market/html/login.html"
    }
    function isLogin_not(url,ele,shele) {
        if (isLogin.status){//购物车图标数量统计
            $.ajax({
                url: url,
                type: "get",
                dataType:"jsonp",
                success: function (data) {
                    if(data.status==200){
                        if(+data.data.count>0){
                            $(ele).show().find("span").html(data.data.count);
                            if(data.data.count>=100){
                                $(ele).find("span").html("99");
                                //$(".pro_de_add_s").show()
                                $(shele).show()
                            }
                        }
                        $(".pro_sh_de_scr").on("click",jump_shopCart);
                    }
                },
                error: function (xhr, type) {
                    alert('获取购物车列表数量失败!');
                }
            });
        }else{
            console.log("没有登录无法查看购物车数量");
            $(".pro_sh_de_scr").on("click",login_page);
        }
    }
    module.exports=isLogin_not;
})