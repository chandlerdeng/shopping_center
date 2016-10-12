/**
 * Created by Administrator on 2016/10/12.
 */
define(function(require, exports, module) {
    $.debug = false;
    var fastclick = require("fastclick");//fastclick
    //$(function() {
    //    FastClick.attach(document.body);
    //});
    var isLogin = require('//api.csc86.com/notify/count/all/?callback=define');
    var loading = require("./loading");
    var con_order_addrList={//地址列表
       addrList_init:function(){
           var $els = {};
            //function _bindEvents() {
           $els.edi_addr_save=$(".edi_addr_save");
           $els.edit_addr_dust=$(".edit_addr_dust");
           //}
           $(".addr_list_plusPar").on('click',function(){//新建地址跳转
               window.location.href="http://res.csc86.com/v2/shopping_center/market/html/con_order_ediAddr.html"
           });

           function addrList_show_del(url, type) {//地址列表删除、新增功能、展示地址列表数据函数
               var params=null;
               switch (type) {
                   case "edi_addr_save":
                       params=null;
                       break;
                   case "_addr_list":
                       params=null;
                       break;
                   case "edit_addr_dust":
                       params=null;
                       break;
                   default:
                       params={"favoritesList":favarr};
                       break;
               }
               console.log(params);
               if ($.debug || isLogin.status) {
                   $.ajax({
                       url: url,
                       type: "post",
                       contentType: "application/json; charset=utf-8",
                       dataType: $.debug ? "json" : "jsonp",
                       data:params,
                       success: function (data) {
                           if(type=="_addr_list"){
                               if($.debug? true: data.status==100){
                               }else{
                                   console.log(data.msg)
                               }
                           }
                           if(type=="edi_addr_save"){
                               console.log(data)
                           }
                           if(type=="edit_addr_dust"){
                               console.log(3)
                           }
                       },
                       error: function (xhr, type){
                           console.log('Ajax error!');
                       }
                   });
               }

           }

           if(location.href==="http://res.csc86.com/v2/shopping_center/market/html/con_order_addrList.html"){
               addrList_show_del.call(this, $.debug ? "../../market/json/addr_list.json" : "http://m.csc86.com/order/loadMemAddressList","_addr_list");//测试用加载地址列表
           }
           $els.edi_addr_save.click(function () {//添加新地址功能
               if($(".edi_addr_saveBtn").hasClass("disabled")){
                console.log("buneng ")
                   return;
               }
               addrList_show_del.call(this, $.debug ? "../../market/json/addr_list.json" : "http://m.csc86.com/order/addOrderAddress","edi_addr_save");
           });
           $els.edit_addr_dust.click(function () {//删除地址功能
               addrList_show_del.call(this, $.debug ? "../../market/json/addr_list.json" : "http://m.csc86.com/order/loadMemAddressList","edit_addr_dust");
           });







       },
        loading: function () {//加载等待函数
            loading.m_change()
        }
    };
    con_order_addrList.addrList_init();
    con_order_addrList.loading();
});