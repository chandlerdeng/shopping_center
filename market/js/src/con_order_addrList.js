/**
 * Created by Administrator on 2016/10/12.
 */
define(function(require, exports, module) {
    $.debug = false;
    var fastclick = require("fastclick");//fastclick
    //$(function() {
    //    FastClick.attach(document.body);
    //});

    var loading = require("./loading");
    var addrList_show_del=require('./addrList_show_del');
    var con_order_addrList={//地址列表
       addrList_init:function(){
               $(".addr_list_plusPar").on('click',function(){//新建地址跳转
                   window.location.href="http://res.csc86.com/v2/shopping_center/market/html/con_order_ediAddr.html"
               });

               if(location.href==="http://res.csc86.com/v2/shopping_center/market/html/con_order_addrList.html"){
                   addrList_show_del.call(this, $.debug ? "../../market/json/addr_list.json" : "http://m.csc86.com/order/loadMemAddressList","_addr_list",".addr_list_cont",null,"post");//测试用加载地址列表
               }
           //以上是地址列表删除、新增功能、展示地址列表数据函数
       },
        loading: function () {//加载等待函数
            loading.m_change()
        }
    };
    con_order_addrList.addrList_init();
    con_order_addrList.loading();
});