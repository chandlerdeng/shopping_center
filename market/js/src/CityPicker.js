
define(function(require, exports, module) {

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
    module.exports = function ($, cityModel) {
        var defaults = {

            cssClass: "city-picker",
            rotateEffect: false,  //为了性能

            toolbarTemplate:
                '<header class="bar bar-nav ">\
                    <div class="sh_margin_a sh_width_92">\
                        <button class="button button-link pull-right close-picker">确定</button>\
                        <h1 class="title">请选择省市区</h1>\
                    </div>\
                </header>',
            formatValue:function (picker, value, displayValue){
                cityModel.value = value;
                cityModel.displayValue = displayValue;
                return displayValue;
            },
            onOpen: function (picker) {
                $(picker.container[0]).find(".cancel-picker").off("click").click(function () {
                    picker.close();
                })
            },
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
            var currentProvinceName;
            var currentCityName;
            var currentDistrictName;
            return this.each(function () {
                if (!this) return;
                var p = $.extend(defaults, params);
                //计算value
                if (p.value) {
                    $(this).data('oldIds', p.value);
                    $(this).data('newIds', p.value);
                } else {
                    var val = $(this).data('newIds');
                    val && (p.value = val);
                }
                if (p.value) {
                    //p.value = val.split(" ");
                    if (p.value[0]) {
                        currentProvince = p.value[0];
                        currentProvinceName = p.displayValue[0];
                        p.cols[1].values = getCities(currentProvince, 'id');
                        p.cols[1].displayValues = getCities(currentProvinceName, 'name');
                    }
                    currentCity = p.value[1] || p.cols[1].values[0];
                    currentCityName = p.displayValue[1] || p.cols[1].displayValues[0];
                    p.cols[2].values = getDistricts(currentProvince, currentCity, 'id');
                    p.cols[2].displayValues = getDistricts(currentProvinceName, currentCityName, 'name');
                    !p.value[2] && (p.value[2] = '');
                    currentDistrict = p.value[2];
                }
                $(this).picker(p);
            });
        };
    }


});