/**
 * Created by 111 on 2016/9/4.
 */
define(function(require, exports, module) {
    var uuid = Date.now();//当前的时间，唯一值，用做id
    var ShangPin = require("./shangpin");//引入商品详情页的数据model，初始化方法
    var ShopCartModel = function (json) {//购物车数据model
        if (json.length == 0) {//如果返回数据的长度为0，则不执行下面代码
            //this.id = 0;//
            this.compIds = [];//公司id==seller_id
            return;
        }
        // this.id = json[0].card_id;
        this.buyerId = json[0].buyer_id;//买家id，两家公司都是一样的
        this._chkNum = 0;//有几个公司被选中个数
        this.isEditing = false;//是否正在编辑
        this.SpSelcNum = 0;//有几个商品被选中个数
         
        Object.defineProperties(this, {    //给对象this定义一个属性，  this指向ShopCartModel
            "chkNum": {//有几个公司被选中
                set: function (val) {//es5固定方法设置公司被选中个数值
                    if (+val <= 0) {//如果被选中公司为0个时，
                        this._chkNum = 0;
                        this.compIds.forEach(function (compId) {//
                            this.comps[compId].chkNum = 0;
                        }.bind(this)); 
                    } else if (+val >= this.compIds.length) {//如果被选中公司为全选时
                        this._chkNum = this.compIds.length; 
                        this.compIds.forEach(function (compId) {
                            this.comps[compId].chkNum = this.comps[compId].shangpinIds.length;
                        }.bind(this)); 
                    } else {//如果被选中公司即没有全选也没有全不选
                        this._chkNum = +val; 
                    }
                },
                get: function () { return this._chkNum;}//获取公司被选中个数值
            }
        });
        this.comps = {};//公司的信息，公司实例化
        this.compIds = json.map(function (compJson) {//map对数组遍历==foEach返回一个新数组
            // 公司信息
            var compId = (compJson.seller_id || uuid--) + "";//卖家id没有的话就自动时间生成id
            var comp = this.comps[compId] = {//该对象作为属性值，把卖家id作为属性
                name: compJson.seller_name,//卖家名字
                _chkNum: 0,//同种商品，只是规格不一样，执行阶梯价格的同一组数组
                shangpinIds: [],//执行阶梯价格的同一组数组产品id数组
                shangpins: {} //执行阶梯价格的同一组数组实例化
            };
            Object.defineProperties(comp, {//公司底下的产品，为公司设置选中数量
                "chkNum": {
                    set: function (val) {
                        if (+val <= 0) {//当公司的input框没有选中时，该公司下方全不选中
                            this._chkNum = 0;
                            this.shangpinIds.forEach(function (spGrpId) {
                                this.shangpins[spGrpId].chkNum = 0;
                            }.bind(this)); 
                        } else if (+val >= this.shangpinIds.length) {//当公司的input的全选时，下方全部选中
                            this._chkNum = this.shangpinIds.length; 
                            this.shangpinIds.forEach(function (spGrpId) {
                                this.shangpins[spGrpId].chkNum = this.shangpins[spGrpId].ids.length;
                            }.bind(this)); 
                        } else {//当公司下方有的选中有的不被选中
                            this._chkNum = +val; 
                        }
                    },
                    get: function () { return this._chkNum;}
                }
            });
            compJson.detail_list.forEach(function (spJson) {//循环公司下方的产品
                //商品信息
                var spId = (spJson.productId || uuid--) + "";//商品id
                var subId = (spJson.detail_id || uuid--) + "";//详情id
                var spGrpId, add2Grp = false, quoteType = 0;
                switch (spJson.priceMethod) {//如果报价方式是sku报价方式
                    case "SKU":
                        spGrpId = (uuid--) + "";//商品组的id等于一个随机数，该种类型报价的一个商品就是一个商品组
                        add2Grp = true;//是否创建商品组
                        quoteType = 1;//报价方式1即是sku
                        break;
                    default:
                        spGrpId = spId;//如果是阶梯报价方式，商品组id则等于产品id
                        if (comp.shangpinIds.indexOf(spGrpId) < 0) {//如果商品组不存在则需要创建商品组
                            add2Grp = true;
                        }
                }                
                if (add2Grp) {//创建商品组
                    comp.shangpinIds.push(spGrpId);//朝商品数组里面推进一个商品组id
                    var sp = new ShangPin(//调用商品详情页的正则表达式解析返回来的区间价格
                        spId, //id, 
                        compId,
                        quoteType // quoteType, 
                    ).setPriceList(spJson.price_interval);
                    sp._chkNum = 0;//该sp是代表的商品组
                    Object.defineProperties(sp, {
                        "chkNum": {
                            set: function (val) {
                                if (+val <= 0) {
                                    this._chkNum = 0;
                                    this.ids.forEach(function (spId) {
                                        this.sameSPs[spId].isChked = false;
                                    }.bind(this)); 
                                } else if (+val >= this.ids.length) {//如果商品组被选全部选中了，商品组下面的产品被选中
                                    this._chkNum = this.ids.length; 
                                    this.ids.forEach(function (spId) {
                                        this.sameSPs[spId].isChked = true;
                                    }.bind(this)); 
                                } else {
                                    this._chkNum = +val; 
                                }
                            },
                            get: function () { return this._chkNum;}
                        }
                    })
                    sp.ids = [subId];//商品组下方商品id
                    sp.num = 0,//商品组下方每个产品的加减购物数量，没有勾选的不计入
                    sp.price = 0;//商品组下面商品根据被勾选时，商品组需用到的价格
                    sp.sameSPs = {};//商品组底下按照 num报价的，只是规格，颜色不一样的商品实例
                    comp.shangpins[spGrpId] = sp;//商品组实例写入商品组对应的id下方
                } else {
                    comp.shangpins[spGrpId].ids.push(subId);//直接推送到商品组，只做新建，不做推送
                }
                var sameSP = new ShangPin(//商品组底下商品
                    spId, //id, 
                    compId,
                    quoteType // quoteType, 
                ).setPriceList(spJson.price_interval);
                sameSP._isChked = false;//商品组底下商品是否被选中
                var _this = this;////绑定给ShopCartModel
                Object.defineProperties(sameSP, {
                    "isChked": {
                        set: function (val) {//如果商品组下方商品被选中，数量会加，而且商品组下方数量也会相应增加
                            if (this._isChked == val) return;
                            this._isChked = val; 
                            if (val) {
                                _this.SpSelcNum++;
                                comp.shangpins[spGrpId].num += this.num;
                            } else {
                                _this.SpSelcNum--;
                                comp.shangpins[spGrpId].num -= this.num;
                            }
                        },
                        get: function () { return this._isChked;}
                    }
                })
                sameSP.image = spJson.image;//商品组下方产品图片url地址
                sameSP.name = spJson.productName;//商品组下方产品产品名字
                sameSP.property = spJson.property; //商品组下方产品产品属性
                sameSP.detailId = subId;//详细id
                sameSP.num = spJson.quantity || 0;//当前的产品的数量
                //sameSP.price = spJson.price || 0;//当前产品的价格
                comp.shangpins[spGrpId].sameSPs[subId] = sameSP;//把该实例写入商品
            }.bind(this));//绑定给ShopCartModel
            return compId;
        }.bind(this));//绑定给ShopCartModel
    };
    ShopCartModel.prototype = {
        clickSelectAll: function (checked) {//全选按钮
            if (checked) {
                this.chkNum = this.compIds.length;
            } else {
                this.chkNum = 0;
            }
        },        
        clickACompChk: function (compId, checked) {//选中一个公司时
            // this.chkACompDown(compId, checked);
            var comp = this.comps[compId];
            if (checked) {
                comp.chkNum = comp.shangpinIds.length;
                this._chkNum++;
            } else {
                comp.chkNum = 0;
                this._chkNum--;
            }
        },
        clickAShangpinChk: function(detailId, spGrpId, compId, checked) {//选中一个商品时
            var comp = this.comps[compId];
            var spGrp = comp.shangpins[spGrpId];
            var sp = spGrp.sameSPs[detailId];
            
            sp.isChked = checked;
            if (checked) {
                spGrp._chkNum++;
                spGrp._chkNum == spGrp.ids.length && comp._chkNum++;
                comp.chkNum == comp.shangpinIds.length && this._chkNum++;
            } else {
                comp.chkNum == comp.shangpinIds.length && this._chkNum--;
                spGrp.chkNum == spGrp.ids.length && comp._chkNum--;
                spGrp._chkNum--;
            }
        },
        chgNumFromUI: function(detailId, spGrpId, compId, type, val) {//改变商品数量时
            var err = null;
            var comp = this.comps[compId];
            var spGrp = comp.shangpins[spGrpId];
            var sp = spGrp.sameSPs[detailId];
            switch (type) {
            case "+1":
                if(sp.num >= sp.maxNum) {
                    err = "数量不能超过库存量"
                } else {
                    sp.num++;
                    spGrp.num++;
                }
                break;
            case "-1":
                if(sp.num <= sp.minNum) {
                    err = "数量不能少于最小起订量"
                } else {
                    sp.num--;
                    spGrp.num--;
                }
                break;
            case "input-change":
                if(+val > sp.maxNum) {
                    err = "数量不能超过库存量"
                } else if(+val < sp.minNum) {
                    err = "数量不能少于最小起订量"
                } else {
                    spGrp.num += +val - sp.num; 
                    sp.num = +val;
                }
                break;
            default:
            }
            return {
                num: sp.num, 
                price: spGrp.price, 
                total: sp.num * spGrp.price,
                err: err
            };
        },
        getShangpin: function(detailId, spGrpId, compId) {//获取商品信息
            var comp = this.comps[compId];
            var spGrp = comp.shangpins[spGrpId];
            var sp = spGrp.sameSPs[detailId];
            return sp;
        },
        calcTotal: function () {//计算总价
            if (this.SpSelcNum <= 0) return 0;
            var rslt = 0;
            this.compIds.forEach(function(compId) {
                var comp = this.comps[compId];
                comp.shangpinIds.forEach(function (spGrpId) {
                    var spGrp = this.shangpins[spGrpId];
                    rslt += spGrp.price * spGrp.num;
                }.bind(comp));
            }.bind(this));
            return rslt;
        },
        removeAShangpin: function (detailId, spGrpId, compId) {//移除商品
            var comp = this.comps[compId];
            var spGrp = comp.shangpins[spGrpId];
            var sp = spGrp.sameSPs[detailId];

            this.clickAShangpinChk(detailId, spGrpId, compId, false);
            delete spGrp.sameSPs[detailId];
            var i = spGrp.ids.indexOf(detailId + "");
            if (i==0) {
                spGrp.ids.shift();
                if(spGrp.ids.length == 0) {
                    this.removeASpGrp(spGrpId, compId);
                }
            } else if (i == spGrp.ids.length) {
                spGrp.ids.pop();
            } else if (i > 0) {
                spGrp.ids = spGrp.ids.slice(0, i).concat(spGrp.ids.slice(i+1));
            }
            return this;
        },
        removeASpGrp: function (spGrpId, compId) {//移除一个商品组
            var comp = this.comps[compId];
            var spGrp = comp.shangpins[spGrpId];

            delete comp.shangpins[spGrpId];
            var i = comp.shangpinIds.indexOf(spGrpId + "");
            if (i==0) {
                comp.shangpinIds.shift();
                if(comp.shangpinIds.length == 0) {
                    this.removeAComp(compId);
                }
            } else if (i == comp.shangpinIds.length) {
                comp.shangpinIds.pop();
            } else if (i > 0) {
                comp.shangpinIds = comp.shangpinIds.slice(0, i).concat(comp.shangpinIds.slice(i+1));
            }
            return this;
        },
        removeAComp: function (compId) {//移除一个公司
            var comp = this.comps[compId];

            delete this.comps[compId];
            var i = this.compIds.indexOf(compId + "");
            if (i==0) {
                this.compIds.shift();
            } else if (i == this.compIds.length) {
                this.compIds.pop();
            } else if (i > 0) {
                this.compIds = this.compIds.slice(0, i).concat(this.compIds.slice(i+1));
            }
            return this;
        }          
    }
    module.exports = ShopCartModel; 
})