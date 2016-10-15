/**
 * Created by Administrator on 2016/10/13.
 */
/**
 * Created by Administrator on 2016/10/12.
 */
define(function(require, exports, module) {
    $.debug = true;
    var currCityModel = {value: null, displayValue: null};
    var store = {
        consignee: null,
        mobile: null,
        address: null,
        cityModel: {value: null, displayValue: null}
    };
    require("./sm-city-picker");
    require("./CityPicker")(Zepto, currCityModel);
    //以上是加载省份联动用数据

    //var fastclick = require("fastclick");//fastclick
    //$(function() {
    //    FastClick.attach(document.body);
    //});
    function isStoreChanged(
        consignee,
        mobile,
        address) {
        return consignee != store.consignee || mobile != store.mobile || address != store.address || currCityModel.value .join() != store.cityModel.value.join();
    }
    function updateStore(
        consignee,
        mobile,
        address) {
        store.consignee = consignee;
        store.mobile = mobile;
        store.address = address;
        store.cityModel = JSON.parse(JSON.stringify(currCityModel));
    }
    var isLogin = require('//api.csc86.com/notify/count/all/?callback=define');
    var loading = require("./loading");
    var _url_value=require('./url_express');
    var addrList_show_del=require('./addrList_show_del');
    var con_order_addrList={
        addrList_init:function(){
            Zepto(function($){
            var $els = {};
            var tips = function(adress,msg,id) {//提示信息
                $("#"+adress).html(msg).show();
                $(id).is(":disabled") || $(id).focus().select();
                setTimeout(function(){
                    $("#"+adress).hide()
                },1000)
                return false;
            };

            //function _bindEvents() {
            $els.edi_addr_saveBtn=$(".edi_addr_saveBtn");//编辑详细地址地址列表
            $els.edit_addr_dust=$(".edit_addr_dust");//删除地址
            //}
//console.log(defaults)

            function _add_list_newBtn (){  //保存并使用按钮
                var $_get_go=($("#_add_list_getPers").length&&$.trim($("#_add_list_getPers").val())),$phe=($("#_add_list_phone").length&&$.trim($("#_add_list_phone").val()));
                var $_add_list_pla=($("#_add_list_pla").length&&$.trim($("#_add_list_pla").val())),$_add_list_plaDetail=($("#_add_list_plaDetail").length&&$.trim($("#_add_list_plaDetail").val()));
                var flag=true;
                if (!$_get_go) {
                    flag=tips("msg-content",'收货人不能为空', "",null);
                    return;
                }
                if(!$phe) {
                    flag=tips("msg-content",'收货人手机号不能为空', "",null);
                    return;
                }
                if(!$_add_list_pla){
                    flag=tips("msg-content",'所在地区不能为空', "",null);
                    return;
                }
                if(!$_add_list_plaDetail){
                    flag=tips("msg-content",'详细地址不能为空', "",null);
                    return;
                }
                if (!isStoreChanged($_get_go, $phe, $_add_list_plaDetail)) {
                    flag=tips("msg-content",'信息没有做任何更改', "",null);
                    return;
                }
                if(flag){
                    if ($.debug || isLogin.status){
                        var _add_list_getPers_s=$_get_go,
                        _add_list_phone_s=$phe,
                        _add_list_plaDetail_s=$_add_list_plaDetail;
                        var params=[
                            {"consignee":_add_list_getPers_s},//收货人
                            {"mobile":_add_list_phone_s},//收货人手机号码
                            {"provinceId":currCityModel.value[0]},
                            {"provinceName":currCityModel.displayValue[0]},
                            {"cityId":currCityModel.value[1]},
                            {"cityName":currCityModel.displayValue[1]},
                            {"districtId":currCityModel.value[2]},
                            {"districtName":currCityModel.displayValue[2]},
                            {"address":_add_list_plaDetail_s}//详细地址
                        ];
                        if(!_url_value){
                            $(this).removeClass("disabled").html("保存中...");
                            addrList_show_del.call(this, $.debug ? "../../market/json/addr_list.json" : "http://m.csc86.com/order/addOrderAddress","edi_addr_saveBtn",null,{"MemAddressDTO":params},"get");
                        }else{
                            $(this).removeClass("disabled").html("修改地址中...");
                            params.push({'addressId': _url_value});
                            addrList_show_del.call(this, $.debug ? "../../market/json/addr_list.json" : "http://m.csc86.com/order/updateAddress","edit_addr_correct",null,{"MemAddressDTO":params},"get", function () {
                                updateStore($_get_go, $phe, $_add_list_plaDetail);
                            });
                        }
                    }else{
                        window.location.href="http://res.csc86.com/v2/shopping_center/market/html/login.html"
                    }
                }else{
                    return false;
                }
            }
            $els.edi_addr_saveBtn.on('click',_add_list_newBtn);


            if(_url_value){
                $els.edit_addr_dust.click(function () {//删除地址功能
                    addrList_show_del.call(this, $.debug ? "../../market/json/addr_list.json" : "http://m.csc86.com/order/deleteAddress","edit_addr_dust",null,{"addressId":_url_value},"get");
                });
                //以下是获取详细地址信息函数
                addrList_show_del.call(
                    this, 
                    $.debug ? "../../market/json/area.json" : "http://m.csc86.com/order/loadAddressDetail","edit_addr_getDetail",
                    null,
                    {"addressId":_url_value},
                    "get",
                    function (_res_data) {
                        store.consignee = _res_data.consignee;
                        store.mobile = _res_data.mobile;
                        store.address = _res_data.address;                        
                        store.cityModel.value = [_res_data.provinceId, _res_data.cityId, _res_data.districtId]; 
                        store.cityModel.displayValue = [_res_data.provinceName, _res_data.cityName, _res_data.districtName];
                        currCityModel.value = [_res_data.provinceId, _res_data.cityId, _res_data.districtId]; 
                        currCityModel.displayValue = [_res_data.provinceName, _res_data.cityName, _res_data.districtName];
                        $("#_add_list_pla").cityPicker(currCityModel);                        
                    }
                );
            }else{
                $("#_waiting_load").css("display","none");
                //以上是调用省市区选择三级联动代码
                $("#_add_list_pla").cityPicker(currCityModel);
            }
        })



        },
        loading: function () {//加载等待函数
            loading.m_change()
        }
    };
    con_order_addrList.addrList_init();
    con_order_addrList.loading();
});