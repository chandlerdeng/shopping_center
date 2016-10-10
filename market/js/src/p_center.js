/**
 * Created by Administrator on 2016/10/10.
 */
define(function(require, exports, module) {
    //var fastclick = require("http://res.csc86.com/f=v2/shopping_center/market/js/src/fastclick");
    //$(function() {
    //    FastClick.attach(document.body);
    //});
    var p_center={
            p_center_jump:function(){//个人中心页面跳转
             function p_c_jump(c_ele,jump_pag){
                 $(c_ele).on('click',function(){
                     window.location.href =jump_pag
                 });
             }
                p_c_jump(".p_center_str","");//我的收藏页面调整
                p_c_jump(".p_center_ord","http://res.csc86.com/v2/shopping_center/market/html/p_order.html");//我的订单页面跳转
                p_c_jump(".p_center_addr","");//地址管理页面跳转
                p_c_jump(".p_center_acc","");//个人账户设置跳转
            }
    };
    p_center.p_center_jump();

});