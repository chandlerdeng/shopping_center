/**
 * Created by Administrator on 2016/10/13.
 */
/**
 * Created by Administrator on 2016/10/12.
 */
define(function(require, exports, module) {
    $.debug = false;
    require("./sm-city-picker");
    //以上是加载省份联动用数据

    //var fastclick = require("fastclick");//fastclick
    //$(function() {
    //    FastClick.attach(document.body);
    //});
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
            //以下是省市区三级联动选择代码
                "use strict";
                var format = function (data, key) {//区域范围
                    var result = [];
                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        if (d.name === "请选择") continue;
                        result.push(d[key || 'name']);
                    }
                    //console.log(result);
                    if (result.length) return result;
                    return [""];
                };

                var sub = function (data, key) {
                    if (!data.sub) return [""];
                    return format(data.sub, key);
                };

                var getCities = function (d, key) {
                    for (var i = 0; i < raw.length; i++) {
                        if (raw[i][key || 'name'] === d) return sub(raw[i], key);
                    }
                    return [""];
                };

                var getDistricts = function (p, c, key) {
                    for (var i = 0; i < raw.length; i++) {
                        if (raw[i][key || 'name'] === p) {
                            for (var j = 0; j < raw[i].sub.length; j++) {
                                if (raw[i].sub[j][key || 'name'] === c) {
                                    return sub(raw[i].sub[j], key);
                                }
                            }
                        }
                    }
                    return [""];
                };

                var raw = $.smConfig.rawCitiesData;
                var provinceNames = raw.map(function (d) {
                    return d.name;
                });
                var provinces = raw.map(function (d) {
                    return d.id;
                });
                var initCitieNames = sub(raw[0], 'name');
                var initCities = sub(raw[0], 'id');
                var initDistrictNames = sub(raw[0].sub[0], 'name');
                var initDistricts = sub(raw[0].sub[0], 'id');

                var currentProvince = provinces[0];
                var currentCity = initCities[0];
                var currentDistrict = initDistricts[0];

                var t;
                var defaults = {

                    cssClass: "city-picker",
                    rotateEffect: false,  //为了性能

                    onChange: function (picker, values, displayValues) {
                        var newProvince = picker.cols[0].value;
                        var newProvinceName = picker.cols[0].displayValue;
                        var newCity, newCityName;
                        if (newProvince !== currentProvince) {
                            // 如果Province变化，节流以提高reRender性能
                            clearTimeout(t);

                            t = setTimeout(function () {
                                var newCities = getCities(newProvince, 'id');
                                var newCitieNames = getCities(newProvinceName, 'name');
                                newCity = newCities[0];
                                newCityName = newCitieNames[0];
                                var newDistricts = getDistricts(newProvince, newCity, 'id');
                                var newDistrictNames = getDistricts(newProvinceName, newCityName, 'name');
                                //debugger

                                picker.cols[1].replaceValues(newCities, newCitieNames);
                                picker.cols[2].replaceValues(newDistricts, newDistrictNames);
                                currentProvince = newProvince;
                                currentCity = newCity;
                                picker.updateValue();
                            }, 200);
                            return;
                        }
                        newCity = picker.cols[1].value;
                        newCityName = picker.cols[1].displayValue;
                        if (newCity !== currentCity) {
                            picker.cols[2].replaceValues(getDistricts(newProvince, newCity, 'id'), getDistricts(newProvinceName, newCityName, 'name'));
                            currentCity = newCity;
                            picker.updateValue();
                        }

                    },

                    cols: [
                        {
                            textAlign: 'center',
                            displayValues: provinceNames,
                            values: provinces,
                            cssClass: "col-province"
                        },
                        {
                            textAlign: 'center',
                            displayValues: initCitieNames,
                            values: initCities,
                            cssClass: "col-city"
                        },
                        {
                            textAlign: 'center',
                            displayValues: initDistrictNames,
                            values: initDistricts,
                            cssClass: "col-district"
                        }
                    ]
                };

                $.fn.cityPicker = function (params) {
                    return this.each(function () {
                        if (!this) return;
                        var p = $.extend(defaults, params);
                        //计算value
                        if (p.value) {
                            $(this).val(p.value.join(' '));
                        } else {
                            var val = $(this).val();
                            val && (p.value = val.split(' '));
                        }

                        if (p.value) {
                            //p.value = val.split(" ");
                            if (p.value[0]) {
                                currentProvince = p.value[0];
                                p.cols[1].values = getCities(p.value[0], 'id');
                            }
                            if (p.value[1]) {
                                currentCity = p.value[1];
                                p.cols[2].values = getDistricts(p.value[0], p.value[1], 'id');
                            } else {
                                p.cols[2].values = getDistricts(p.value[0], p.cols[1].values[0], 'id');
                            }
                            !p.value[2] && (p.value[2] = '');
                            currentDistrict = p.value[2];
                        }
                        $(this).picker(p);
                    });
                };


            $("#_add_list_pla").cityPicker({
                toolbarTemplate:
                    '<header class="bar bar-nav ">\
                        <div class="sh_margin_a sh_width_92">\
                            <button class="button button-link pull-left close-picker-cancel">取消</button>\
                             <button class="button button-link pull-right close-picker">确定</button>\
                             <h1 class="title">请选择省市区</h1>\
                        </div>\
                        </header>',
                formatValue:function (picker, value, displayValue){
                    return displayValue;
                }
            });
//console.log(defaults)

        //以上是调用省市区选择三级联动代码





            function _add_list_newBtn (){  //保存并使用按钮
                var $_get_go=($("#_add_list_getPers").length&&$.trim($("#_add_list_getPers").val())),$phe=($("#_add_list_phone").length&&$.trim($("#_add_list_phone").val()));
                var $_add_list_pla=($("#_add_list_pla").length&&$.trim($("#_add_list_pla").val())),$_add_list_plaDetail=($("#_add_list_plaDetail").length&&$.trim($("#_add_list_plaDetail").val()));
                var flag=true;
                //debugger;
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
                if(flag){
                    if ($.debug || isLogin.status){
                        var _add_list_getPers_s=$.trim($("#_add_list_getPers").val()),_add_list_phone_s=$.trim($("#_add_list_phone").val()),_add_list_plaDetail_s=$.trim($("#_add_list_plaDetail").val());
                        var params=[
                            {"consignee":_add_list_getPers_s},//收货人
                            {"mobile":_add_list_phone_s},//收货人手机号码
                            {"provinceId":defaults.cols[0].value},
                            {"provinceName":defaults.cols[0].displayValue},
                            {"cityId":defaults.cols[1].value},
                            {"cityName":defaults.cols[1].displayValue},
                            {"districtId":defaults.cols[2].value},
                            {"districtName":defaults.cols[2].displayValue},
                            {"address":_add_list_plaDetail_s}//详细地址
                        ];
                        if(!_url_value){
                            $(this).removeClass("disabled").html("保存中...");
                            addrList_show_del.call(this, $.debug ? "../../market/json/addr_list.json" : "http://m.csc86.com/order/addOrderAddress","edi_addr_saveBtn",null,{"MemAddressDTO":params},"get");
                        }else{
                            $(this).removeClass("disabled").html("修改地址中...");
                            addrList_show_del.call(this, $.debug ? "../../market/json/addr_list.json" : "http://m.csc86.com/order/updateAddress","edit_addr_correct",null,{"MemAddressDTO":params},"get");
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
                    addrList_show_del.call(this, $.debug ? "../../market/json/area.json" : "http://m.csc86.com/order/loadAddressDetail","edit_addr_getDetail",null,{"addressId":_url_value},"get");
                }else{
                    $("#_waiting_load").css("display","none");
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