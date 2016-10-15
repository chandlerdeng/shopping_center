/**
 * Created by Administrator on 2016/9/13.
 */
/**
 * Created by Administrator on 2016/8/24.
 */
define(function(require, exports, module) {
    $.debug=true;
    //var isLogin = require('//api.csc86.com/notify/count/all/?callback=define');
    var _notice=function(ele,$ele,content,time){
        setTimeout(function(){
            $(ele).hide();
            $($ele).addClass(" disabled").html(content);
        },time)
    };
    function addrList_show_del(url, type,container,param,meth, updateStoreFn) {//地址列表删除、新增功能、展示地址列表数据函数
        var params,method;
        switch (type) {
            case "_addr_list"://获取收货地址列表
                params=param;
                method=meth;
                break;
            case "edi_addr_saveBtn"://新建新地址
                params=param;
                method=meth;
                break;
            case "edit_addr_dust"://根据地址id删除详细地址
                params=param;
                method=meth;
                break;
            case "edit_addr_correct"://根据地址id编辑详细地址
                params=param;
                method=meth;
                break;
            case "edit_addr_getDetail"://根据地址id获取详细地址
                params=param;
                method=meth;
                break;
            default:
                params={"favoritesList":favarr};
                break;
        }
        if ($.debug || isLogin.status) {
            $.ajax({
                url: url,
                type:$.debug ? "get" : method,
                contentType: "application/json; charset=utf-8",
                dataType: $.debug ? "json" : "jsonp",
                data:params,
                success: function (data) {
                    if(type=="_addr_list"){  //获取收获地址列表
                        if($.debug? true: data.status==100){
                            console.log(data);
                            var str="";
                            if(data.data.loadMemAddressList.length>0&& $.isArray(data.data.loadMemAddressList)){
                                for(var i= 0,len=data.data.loadMemAddressList.length;i<len;i++){
                                    str+=
                                        "<div class='sh_clear  sh_bor_bottom_1'>"+
                                            "<div class='sh_clear sh_width_92 sh_margin_a sh_pd_top40 sh_pd_bottom40 sh_box-sizing_C'>"+
                                            "<a href='http://res.csc86.com/v2/shopping_center/market/html/con_order.html?addressId="+data.data.loadMemAddressList[i].addressId+"'>"+
                                                "<dl class='sh_clear sh_width_11 sh_float_l sh_bor_right_1 sh_box-sizing_C addr_list_det'>"+
                                                    "<dt class='sh_clear sh_font_sz30 sh_font_color5'>"+
                                                        "<span class='sh_width_5 sh_float_l sh_lingheight_100'>"+data.data.loadMemAddressList[i].consignee+"</span>"+
                                                        "<span class=' sh_width_7 sh_float_l sh_te_align_c sh_lingheight_100'>"+data.data.loadMemAddressList[i].mobile+"</span>"+
                                                    "</dt>"+
                                                    "<dt class=' sh_font_sz28 sh_font_color13 sh_pd_top20 sh_lingheight_1_5'>"+data.data.loadMemAddressList[i].provinceName+data.data.loadMemAddressList[i].cityName+data.data.loadMemAddressList[i].districtName+data.data.loadMemAddressList[i].address+"</dt>"+
                                                "</dl>"+
                                            "<a/>"+
                                            //"<a href='http://res.csc86.com/v2/shopping_center/market/html/con_order_ediAddr.html?addressId="+data.data.loadMemAddressList[i].addressId+"'>"+
                                            "<a href='../../market/html/con_order_ediAddr.html?addressId="+data.data.loadMemAddressList[i].addressId+"'>"+
                                                "<dl class='sh_clear sh_width_1 sh_float_l sh_box-sizing_C sh_te_align_r addr_list_wri sh_font_sz0 sh_lingheight_100 sh_dispfix'>"+
                                                        "<dt>"+
                                                        //"<img src='http://res.csc86.com/v2/shopping_center/market/demo/addr_list.png' alt=''  class='addr_list'/>"+
                                                        "<img src='../demo/addr_list.png' alt=''  class='addr_list'/>"+
                                                        "</dt>"+
                                                "</dl>"+
                                            "<a/>"+
                                            "</div>"+
                                        "</div>"
                                }
                                $(container).html(str);

                            }
                        }else{
                            $("body","html").css("background-color","#eeeeee");
                            $(container).html("<img src='http://res.csc86.com/v2/shopping_center/market/demo/addr_noList.png' alt='' class='sh_img_max'/>");
                        }
                    }
                    if(type=="edi_addr_saveBtn"){ //新建地址按钮
                        if(data.status==100){
                            $("#msg-content").html(data.msg).show();
                            _notice("#msg-content",".edi_addr_saveBtn","保存",1500);
                            window.location.href=document.referrer;//新建地址成功后返回到历史页面

                        }else{
                            $("#msg-content").html(data.msg).show();
                            _notice("#msg-content",".edi_addr_saveBtn","保存",1500)
                        }

                    }
                    if(type=="edit_addr_correct"){ //修改地址按钮
                        console.log(data)
                        if(data.status==100){
                            $("#msg-content").html(data.msg).show();
                            _notice("#msg-content",".edi_addr_saveBtn","保存",1500)
                            updateStoreFn();
                        }else{
                            $("#msg-content").html(data.msg).show();
                            _notice("#msg-content",".edi_addr_saveBtn","保存",1500);

                        }

                    }
                    if(type=="edit_addr_dust"){//删除地址
                        console.log(data)
                        if(data.status==100){
                            if(data.data.deleteAddress){
                                $("#msg-content").html(data.msg).show();
                                _notice("#msg-content",null,null,0);
                                window.location.href=document.referrer;//删除地址成功后返回到历史页面

                            }
                        }
                    }
                    if(type=="edit_addr_getDetail"){//获取地址详细
                        console.log(data);
                        $("#_waiting_load").css("display","none");
                        if(data.status==100){
                            if(data.hasOwnProperty('data')){
                                if(data.data.hasOwnProperty('loadAddressDetail')){
                                    var _res_data=data.data.loadAddressDetail;
                                    $("#_add_list_getPers").val(_res_data.consignee);
                                    $("#_add_list_phone").val(_res_data.mobile);
                                    updateStoreFn(_res_data);
                                    $("#_add_list_pla").val(_res_data.provinceName+","+_res_data.cityName+","+_res_data.districtName);
                                    $("#_add_list_plaDetail").val(_res_data.address);
                                }
                            }
                        }
                    }
                },
                error: function (xhr, type){
                    console.log('Ajax error!');
                }
            });
        }else{
            window.location.href="http://res.csc86.com/v2/shopping_center/market/html/login.html"
        }

    }
    module.exports =addrList_show_del;
});