/**
 * Created by Administrator on 2016/10/12.
 */

define(function (require, exports, module) {
    $.debug = false;
    var ShopCart = require("./shopcart"); //购物车的数据模型
    var shopCart;
    var loading = require("./loading"); //加载
    var formatNum = require("./formatNum"); //价格的格式
    var isLogin_stu = require('//api.csc86.com/notify/count/all/?callback=define'); //判断是否登录
    //var fastclick = require("fastclick");//fastclick
    var porder = {

        init:function(){
            var num=1;
            this.list(num);
            this.slideoperaction(num);
        },
        list:function(num){
            if(isLogin_stu.data.id!=""){}
            $.ajax({
                url:'http://m.csc86.com/order/myOrderList',
                data:{page:num,pageSize:5},
                type: "post",
                dataType: 'jsonp',
                success: function (data) {
                    console.log(data);
                    if(data.status==101)
                    {
                    }else {
                        var len = data.data.myOrderList.resultList.length;
                        var imgurl = 'http://img.csc86.com/';
                        var str = "";
                        for (var i = 0; i < len; i++) {
                            var status;
                            var btnhtml;
                            if (data.data.myOrderList.resultList[i].status == 1) {
                                status = "待付款";
                                btnhtml = "<a href='con_order.html?id="+data.data.myOrderList.resultList[i].orderNo+"'><div class='sh_positon_a sh_right_22  sh_pd_bottom10 sh_pd_top10 sh_pd_left14 sh_pd_right14 sh_bottom_2 sh_font_color9 sh_bor_a_3 sh_border_radius_5  sh_font_sz24 sh_lingheight_100 sh_te_align_c sh_ellipsis'>" + "去付款" + "</div></a>" +
                                "<div class='sh_positon_a sh_right_3  sh_pd_bottom10 sh_pd_top10 sh_pd_left14 sh_pd_right14 sh_bottom_2 sh_font_color9 sh_bor_a_3 sh_border_radius_5  sh_font_sz24 sh_lingheight_100 sh_te_align_c sh_ellipsis cancel-order' data-memberId='"+data.data.myOrderList.resultList[i].memberId+"' data-orderNo='"+data.data.myOrderList.resultList[i].orderNo+"' data-seller='"+data.data.myOrderList.resultList[i].seller+"'>" + "取消订单" + "</div>"
                            } else if (data.data.myOrderList.resultList[i].status == 2) {
                                status = "待发货";
                                btnhtml = "<div class='sh_positon_a sh_right_22  sh_pd_bottom10 sh_pd_top10 sh_pd_left14 sh_pd_right14 sh_bottom_2 sh_font_color9 sh_bor_a_3 sh_border_radius_5  sh_font_sz24 sh_lingheight_100 sh_te_align_c sh_ellipsis remind-order' data-memberId='"+data.data.myOrderList.resultList[i].memberId+"' data-orderNo='"+data.data.myOrderList.resultList[i].orderNo+"' data-seller='"+data.data.myOrderList.resultList[i].seller+"'>" + "提醒发货" + "</div>" +
                                "<div class='sh_positon_a sh_right_3  sh_pd_bottom10 sh_pd_top10 sh_pd_left14 sh_pd_right14 sh_bottom_2 sh_font_color9 sh_bor_a_3 sh_border_radius_5  sh_font_sz24 sh_lingheight_100 sh_te_align_c sh_ellipsis cancel-order' data-memberId='"+data.data.myOrderList.resultList[i].memberId+"' data-orderNo='"+data.data.myOrderList.resultList[i].orderNo+"' data-seller='"+data.data.myOrderList.resultList[i].seller+"'>" + "取消订单" + "</div>"
                            } else if (data.data.myOrderList.resultList[i].status == 5) {
                                status = "已取消";

                                btnhtml = "<a href='p_order_de.html?id="+data.data.myOrderList.resultList[i].orderNo+"'><div class='sh_positon_a sh_right_3  sh_pd_bottom10 sh_pd_top10 sh_pd_left14 sh_pd_right14 sh_bottom_2 sh_font_color9 sh_bor_a_3 sh_border_radius_5  sh_font_sz24 sh_lingheight_100 sh_te_align_c sh_ellipsis'>" + "查看详情" + "</div></a>"

                            } else if (data.data.myOrderList.resultList[i].status == 3) {
                                status = "交易完成";
                                btnhtml = "<a href='p_order_de.html?id="+data.data.myOrderList.resultList[i].orderNo+"'><div class='sh_positon_a sh_right_3  sh_pd_bottom10 sh_pd_top10 sh_pd_left14 sh_pd_right14 sh_bottom_2 sh_font_color9 sh_bor_a_3 sh_border_radius_5  sh_font_sz24 sh_lingheight_100 sh_te_align_c sh_ellipsis'>" + "查看详情" + "</div></a>"

                            } else if (data.data.myOrderList.resultList[i].status == 15) {
                                status = "待收货";
                                btnhtml = "<div class='sh_positon_a sh_right_3  sh_pd_bottom10 sh_pd_top10 sh_pd_left14 sh_pd_right14 sh_bottom_2 sh_font_color9 sh_bor_a_3 sh_border_radius_5  sh_font_sz24 sh_lingheight_100 sh_te_align_c sh_ellipsis confirm-order'  data-orderNo='"+data.data.myOrderList.resultList[i].orderNo+"' data-seller='"+data.data.myOrderList.resultList[i].seller+"'>" + "确认收货" + "</div>"

                            }

                            str += "<div class='order-module'><div class='sh_width_92 sh_margin_a sh_clear  sh_font_sz26 sh_pd_top30 sh_font_color6'>订单编号:<em>" + data.data.myOrderList.resultList[i].orderNo + "</em></em></div>" +
                            "<div class='sh_clear   line_hg1_5 sh_box-sizing_C sh_bor_bottom_1 sh_pd_top10 sh_pd_bottom20  sh_font_color5'>" +
                            "<div class='sh_width_92 sh_margin_a sh_font_sz24'>" +
                            "<div  class='sh_width_9 sh_float_l sh_lingheight_100  sh_ellipsis sh_font_color4'>" + data.data.myOrderList.resultList[i].createTime + "</div>" +
                            "<div  class='sh_width_3 sh_float_l sh_te_align_r sh_lingheight_100 sh_ellipsis sh_status_txt'>" + status + "</div>" +
                            "</div>" +
                            "</div>" +
                            "<div class='sh_clear sh_pd_top13 sh_pd_bottom13 sh_bor_bottom_1 save_store_imgh '>" +
                            "<div class='sh_width_92 sh_margin_a sh_height_100 order_nourl'  data-orderNo='"+data.data.myOrderList.resultList[i].orderNo+"'>" +
                            "<div class='sh_float_l sh_lingheight_100  sh_font_sz0 sh_margin_l_1'>";
                            if (data.data.myOrderList.resultList[i].imageUrl1 != '') {
                                str += "<img src='" + imgurl + data.data.myOrderList.resultList[i].imageUrl1 + " 'class='order_store_img' alt=''/>";
                            } else {
                                str += "";
                            }
                            str += "</div>" +
                            "<div class=' sh_float_l sh_lingheight_100  sh_font_sz0 sh_margin_l_1'>";
                            if (data.data.myOrderList.resultList[i].imageUrl2 != '') {
                                str += "<img src='" + imgurl + data.data.myOrderList.resultList[i].imageUrl2 + " 'class='order_store_img' alt=''/>";
                            } else {
                                str += "";
                            }
                            str += "</div>" +
                            "<div class='sh_float_l sh_lingheight_100  sh_font_sz0 sh_margin_l_1'>";
                            if (data.data.myOrderList.resultList[i].imageUrl3 != '') {
                                str += "<img src='" + imgurl + data.data.myOrderList.resultList[i].imageUrl3 + " 'class='order_store_img' alt=''/>";
                            } else {
                                str += "";
                            }
                            str += "</div>" +
                            "<div class='sh_width_8_8 sh_float_r   sh_font_sz0  sh_te_align_c  sh_ellipsis sh_margin_l_1 sh_dispfix' >" +
                            "<img src='../demo/pers_order_1.png' class='pers_order_ar sh_v_middle' alt=''/>" +
                            "</div>" +
                            "</div>" +
                            "</div>" +
                            "<div class='sh_clear line_hg1_5 sh_box-sizing_C sh_bor_bottom_1 sh_pd_top30 sh_pd_bottom30  sh_font_color5 sh_positon_r'>" +
                            "<div class='sh_width_92 sh_margin_a sh_font_sz24 sh_lingheight_100  sh_ellipsis'>" +
                            "共&nbsp;<em class='sh_font_color2'>" + data.data.myOrderList.resultList[i].totalAmount + "</em>&nbsp;件,订单金额&nbsp;<em class='sh_font_color2'>" + data.data.myOrderList.resultList[i].totalMoney + "</em><em class='sh_font_color2'>元</em>" +
                            "</div>";
                            str += "<div class='btnswhid'>"+btnhtml+"</div>";
                            str += "</div>" +
                            "<div class='sh_separate20 sh_bg_color_3'></div></div>";
                            status = null;
                            btnhtml = null;

                        }
                        var htm = $('#order-list').html();
                        $('#order-list').html(htm + str);
                        $('.order_nourl').on('click',function(){
                            var $orderNo=$(this).attr('data-orderNo');
                            window.location.href="p_order_de.html?id="+$orderNo;
                        })

                        //待发货 取消按钮
                        $('.cancel-order').on('click',function(){
                            var This=$(this);
                            var seller=This.attr('data-seller');
                            var orderNo=This.attr('data-orderNo');
                            $.ajax({
                                url:'http://m.csc86.com/order/canceOrder',
                                data:{orderNo:orderNo,sellerId:seller},
                                type: "post",
                                dataType: 'jsonp',
                                success: function (data) {
                                    console.log(data);

                                    if(data.status==100){
                                        This.parents('.order-module').find('.sh_status_txt').html('已取消');
                                        var  btnhtml = "<a href='p_order_de.html?id="+orderNo+"'><div class='sh_positon_a sh_right_3  sh_pd_bottom10 sh_pd_top10 sh_pd_left14 sh_pd_right14 sh_bottom_2 sh_font_color9 sh_bor_a_3 sh_border_radius_5  sh_font_sz24 sh_lingheight_100 sh_te_align_c sh_ellipsis'>" + "查看详情" + "</div></a>"
                                        $("#msg-content").html("取消成功").show();
                                        This.parent('.btnswhid').html(btnhtml);
                                        setTimeout(function(){
                                            $("#msg-content").hide()
                                        },2000)
                                    }else if (data.status==101)
                                    {
                                        $("#msg-content").html("用户未登录或取消失败").show();
                                        setTimeout(function(){
                                            $("#msg-content").hide()
                                        },2000)
                                    }
                                }
                        });

                        });

                        //待发货 提醒发货按钮
                        $('.remind-order').on('click',function(){
                            var This=$(this);
                            var seller=This.attr('data-seller');
                            var orderNo=This.attr('data-orderNo');
                            $.ajax({
                                url: 'http://m.csc86.com/order/urgingSellerShipped',
                                data: {orderNo: orderNo, sellerId: seller},
                                type: "post",
                                dataType: 'jsonp',
                                success: function (data) {
                                    console.log(data);
                                    if(data.status==100){
                                        $("#msg-content").html("已成功提醒卖家发货").show();
                                        setTimeout(function(){
                                            $("#msg-content").hide()
                                        },2000)
                                    }else if(data.status==101){
                                        $("#msg-content").html("提醒卖家发货失败").show();
                                        setTimeout(function(){
                                            $("#msg-content").hide()
                                        },2000)
                                    }
                                }
                            });
                        });

                        $('.confirm-order').on('click',function(){
                            var This=$(this);
                            var seller=This.attr('data-seller');
                            var orderNo=This.attr('data-orderNo');
                            $.ajax({
                                url: 'http://m.csc86.com/order/confirmReceive',
                                data: {orderNo: orderNo, sellerId: seller},
                                type: "post",
                                dataType: 'jsonp',
                                success: function (data) {
                                    console.log(data);
                                    if(data.status==100){
                                        This.parents('.order-module').find('.sh_status_txt').html('交易完成');
                                        var  btnhtml = "<a href='p_order_de.html?id="+orderNo+"'><div class='sh_positon_a sh_right_3  sh_pd_bottom10 sh_pd_top10 sh_pd_left14 sh_pd_right14 sh_bottom_2 sh_font_color9 sh_bor_a_3 sh_border_radius_5  sh_font_sz24 sh_lingheight_100 sh_te_align_c sh_ellipsis'>" + "查看详情" + "</div></a>"
                                        $("#msg-content").html("交易完成").show();
                                        This.parent('.btnswhid').html(btnhtml);
                                        setTimeout(function(){
                                            $("#msg-content").hide()
                                        },2000)
                                    }else if(data.status==101){
                                        $("#msg-content").html("确认异常").show();
                                        setTimeout(function(){
                                            $("#msg-content").hide()
                                        },2000)
                                    }
                                }
                            });
                        });
                    }
                }
            });
        },
        slideoperaction:function(num){
            $(window).scroll(function(){

                if($(document).scrollTop()>=$(document).height()-$(window).height())
                {
                    num++;
                    porder.list(num);
                }
            });


        }
    }
    porder.init();
});