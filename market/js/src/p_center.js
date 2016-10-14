/**
 * Created by Administrator on 2016/10/10.
 */
define(function(require, exports, module) {
    var fastclick = require("fastclick");//fastclick
    //$(function() {
    //    FastClick.attach(document.body);
    //});
    var isLogin = require('//api.csc86.com/notify/count/all/?callback=define');
    console.log(isLogin);
    var p_center={
            p_center_jump:function(){
            //个人中心页面跳转
             function p_c_jump(c_ele,jump_pag){
                     $(c_ele).on('click',function(){
                         if(isLogin.status){
                            window.location.href =jump_pag;
                         }else{
                             window.location.href="http://res.csc86.com/v2/shopping_center/market/html/login.html"
                         }
                     });
             }
                p_c_jump(".p_center_str","");//我的收藏页面调整
                p_c_jump(".p_center_ord","http://res.csc86.com/v2/shopping_center/market/html/p_order.html");//我的订单页面跳转
                p_c_jump(".p_center_addr","http://res.csc86.com/v2/shopping_center/market/html/con_order_addrList.html");//地址管理页面跳转
                p_c_jump(".p_center_acc","");//个人账户设置跳转
           function _isLogin_center(conele){

               var res=
               "<div class='sh_pr_hg37_84'></div>"+
               "<div class='sh_clear  sh_margin_a sh_pr_hg18_92 sh_width_64'>"+
                   "<div class='sh_width_5 sh_float_l sh_te_align_r sh_lingheight_100 sh_font_sz0'>"+
                        "<input type='button' value='登录' class='sh_width_8 sh_lingheight_100 sh_font_sz30 sh_font_color8 sh_bg_color_6 sh_pd_bottom20 sh_pd_top20  sh_border_radius_5 p_center_login'/>"+
                   "</div>"+
                   "<div class='sh_width_5 sh_float_r sh_lingheight_100 sh_font_sz0'>"+
                        "<input type='button' value='注册' class='sh_width_8 sh_lingheight_100 sh_font_sz30 sh_font_color8 sh_bg_color_6 sh_pd_bottom20 sh_pd_top20  sh_border_radius_5 p_center_resg'/>"+
                   "</div>"+
               "</div>"+
               "<div class='sh_pr_hg43_24'></div>";
               if (isLogin.status){
                   $.post("http://m.csc86.com/member/getUserInfo",{
                       }, function(data) {
                       console.log(data);
                       var str="";
                       if(data.status==200){
                           if(data.hasOwnProperty('data')){
                               if(data.data.hasOwnProperty('userInfo')){
                                   str+=
                                       "<div class='sh_pr_hg18_92'></div>"
                                   if(data.data.userInfo.hasOwnProperty('imgUrl')&&!!data.data.userInfo.imgUrl){
                                       str+=
                                           "<div class='sh_te_align_c sh_pr_hg52_46'>"+
                                               "<div class='sh_te_align_c sh_margin_a sh_ellipsis sh_border_radius_50 sh_pr_hg162 sh_width_162 sh_bor_a_10'>"+
                                                    "<img src='http://img.csc86.com"+data.data.userInfo.imgUrl+"' alt='' class='pers_ctr_input sh_img_max'/>"+
                                               "</div>"+
                                           "</div>"
                                   }else{
                                       str+=
                                           "<div class='sh_te_align_c sh_pr_hg52_46'>"+
                                               "<div class='sh_te_align_c sh_margin_a sh_ellipsis sh_border_radius_50 sh_pr_hg162 sh_width_162 sh_bor_a_10'>"+
                                                    "<img src='http://res.csc86.com/v2/shopping_center/market/demo/p_center_noImg.png' alt='' class='pers_ctr_input sh_img_max'/>"+
                                               "</div>"+
                                           "</div>"
                                   }
                                   if(isNaN(data.data.userInfo.userName)){
                                       str+="<div class='sh_te_align_c sh_font_color8 sh_wor_space sh_ellipsis sh_lingheight_100 sh_pr_hg28_62 sh_font_sz30'>"+data.data.userInfo.userName+"</div>";
                                   }else{
                                       str+="<div class='sh_te_align_c sh_font_color8 sh_wor_space sh_ellipsis sh_lingheight_100 sh_pr_hg28_62 sh_font_sz30'>"+isLogin.data.username.substring(0,3)+'***'+data.data.userInfo.userName.substring(8,11)+"</div>";
                                   }
                                   $(conele).html(str);
                               }
                           }else{
                               str+=
                                   "<div class='sh_pr_hg18_92'></div>"+
                                   "<div class='sh_te_align_c sh_pr_hg52_46'>"+
                                       "<div class='sh_te_align_c sh_margin_a sh_ellipsis sh_border_radius_50 sh_pr_hg162 sh_width_162 sh_bor_a_10'>"+
                                             "<img src='http://res.csc86.com/v2/shopping_center/market/demo/p_center_noImg.png' alt='' class='pers_ctr_input sh_img_max'/>"+
                                       "</div>"+
                                   "</div>";
                               if(isNaN(isLogin.data.username)){
                                   str+="<div class='sh_te_align_c sh_font_color8 sh_wor_space sh_ellipsis sh_lingheight_100 sh_pr_hg28_62 sh_font_sz30'>"+isLogin.data.username+"</div>";
                               }else{
                                   str+="<div class='sh_te_align_c sh_font_color8 sh_wor_space sh_ellipsis sh_lingheight_100 sh_pr_hg28_62 sh_font_sz30'>"+isLogin.data.username.substring(0,3)+'***'+isLogin.data.username.substring(8,11)+"</div>";
                               }
                               $(conele).html(str);
                           }
                       }

                   },"jsonp");
               }else{
                   $(conele).html(res);
                   $(".p_center_login").on('click',function(){
                       window.location.href="http://res.csc86.com/v2/shopping_center/market/html/login.html"
                   })
                   $(".p_center_resg").on('click',function(){
                       window.location.href="http://res.csc86.com/v2/shopping_center/market/html/login_reg_acc.html"
                   })
               }
           }
            _isLogin_center(".pers_ctr_banner") ;







            }
    };
    p_center.p_center_jump();

});