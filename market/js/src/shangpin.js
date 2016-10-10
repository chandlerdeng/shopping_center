define(function(require, exports, module) {
    // var SPECNAMES = [
    //     {id: "color", value: "颜色"},
    //     {id: "size", value: "尺码"}
    // ];
    var ShangPinModel = function (id, sellerId, quoteType, specNames, maxNum) {//初始化产品id，报价方式，参数名称，最大数量
        if (this === window) return;
        this.id = id || 0;
        this.sellerId = sellerId;
        this.quoteType = quoteType ? 1 : 0;//存在则为1，规格型号报价，否则为0即是区间报价
        this.specNames = specNames || [];//参数名称或者数组
        this.specs = {};
        this.specNames.forEach(function (name) {
            this.specs[name] = 0;
        }.bind(this));//每个参数绑定
        this.minNum = 1;  //起批量
        this._num = 0;  //购物数量  
        Object.defineProperties(this, {      
            "num": {
                set: function (val) {
                    this._num = +val;
                    val && this.updatePrice();
                },
                get: function () {
                    return this._num;
                }
            }
        });
        this.maxNum = isNaN(maxNum) ? Infinity : maxNum || 0//库存量如果是非数字则是无穷大，否则则是传进去的最大值或者0
    }
    ShangPinModel.prototype = {
        setPriceList: function (listStr) {//价格区间函数
            var reg = /\[\s*(\d+)\s*,\s*([\d\.]+)\s*\]/g, pair;
            this.priceList = [];
            while(pair = reg.exec(listStr)) {
                this.priceList.push({
                    min: pair[1],
                    price: pair[2]
                });
            }
            this.minNum = this.priceList[0].min || 1;//最小起批量根据后台返给前台
            return this;
        },
        setPriceUrl: function (urlObj) {//获取价格
            this.priceUrl = $.extend({
                url: "empty price url",
                dataType:"jsonp",
                type:"get"
            }, urlObj);//合并对象
            return this;
        },
        updatePrice: function () {
            if (this._num === 0 && this.priceList.length) {
                this._num = +this.priceList[0].min;
                this.price = +this.priceList[0].price;
            } else {
                for(var i, len=i=this.priceList.length; i>0; ) {
                    if (this._num >= this.priceList[--i].min) {
                        this.price = +this.priceList[i].price;
                        return;
                    }
                }
                this.price = 0; // 价格面议
            }
            return this;
        },
        getPriceDefer: function (specsObj) {//价格
            var defer = $.Deferred();
            this.price = 0;
            if (!this.isAllSpecSetted()) return defer.resolve(false);
            // priceList
            if (this.quoteType === 0) {
                this.updatePrice();
                return defer.resolve(!!this.price);
            }
            this.isAjaxing = true;
            var success = function (data) {
                if(data.status==0){
                    //console.log(data)
                    this.isAjaxing = false;
                    this.setPriceList(data.data.price);
                    this.maxNum = Infinity; //data.data.amount;
                    return true;
                }else{
                    //console.log(data)
                    $(".pro_de_intr_spa").children().html(data.data.errorMsg)
                    this.isAjaxing = false;
                    this.price = 0;
                    this.maxNum = 0;
                    return false;
                }
            }.bind(this);
            var fail = function (err) {
                this.isAjaxing = false;
                this.price = 0;
                this.maxNum = 0;
                return false;
            }.bind(this);
            return $.ajax($.extend({
                data:{"color": specsObj || this.specs.color,"size":specsObj || this.specs.size}
            }, this.priceUrl)).then(success, fail);
        },
        calcTotal: function (price) {
            this.price = price || this.price || 0;
            return (this.price * this.num);
        },
        setSpec: function (specName, val) {
            if (this.specNames.indexOf(specName) < 0) throw new Error("invalid spec name:" + specName);
            this.specs[specName] = val || 0;
            return this;
        },
        isAllSpecSetted: function () {
            return this.specNames.filter(function (name) {
                return !this.specs[name];
            }.bind(this)).length === 0;
        }
    }
	module.exports = ShangPinModel;
});