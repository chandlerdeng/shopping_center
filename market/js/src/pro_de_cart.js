/**
 * Created by Administrator on 2016/8/31.
 */

define(function (require, exports, module) {
    $.debug = false;
    var ShopCart = require("./shopcart");
    var shopCart;
    var loading = require("./loading");
    var formatNum = require("./formatNum");
    var isLogin_stu = require('//api.csc86.com/notify/count/all/?callback=define');
    var fastclick = require('fastclick');//fastclick
    //$(function() {
    //    FastClick.attach(document.body);
    //});
    var pro_cart = {
        shopping_cart: function () {//购物车
            var $els = {};
            function isLogin(url) {//展示购物车列表数据函数
                if ($.debug || isLogin_stu.status) {
                    $.ajax({
                        url: url,
                        type: "get",
                        dataType: $.debug ? "json" : "jsonp",
                        success: function (data) {
                            console.log(data)
                            if($.debug? true: data.status==200){
                                var str = "";
                                if (!data.data.shoppingCar || data.data.shoppingCar.length == 0) {
                                    str =
                                        "<div class='pro_de_cartContent' class='sh_te_align_c sh_font_sz0'>" +//当购物车内容为空时
                                             "<img src='http://res.csc86.com/v2/shopping_center/market/demo/pro_de_cart_bl.png' alt='' class='loading sh_img_max sh_margin_a'/>" +
                                        "</div>";//如果没有数据或者长度为0时
                                    $("#pro_de_cartContainer").html(str);
                                    return;
                                }
                                shopCart = new ShopCart(data.data.shoppingCar);
                                var str = "";
                                shopCart.compIds.forEach(function (compId) {
                                    var comp = shopCart.comps[compId];
                                    str +=
                                    "<div class='pro_de_cartContent sh_bg_color_1'>" +//动态获取内容开始开始
                                        "<div class='sh_clear sh_pd_bottom30 sh_pd_top30 pro_de_cart_title'>" +//公司标题开始区域
                                        "<div class='sh_width_1 sh_float_l sh_lingheight_100 sh_te_align_r sh_font_sz26 sh_positon_r'>" +
                                        "<input type='checkbox' name='tittle_list' class='chkbox-in-list chkbox-comp' data-comp-id='" + compId + "'/>" +//标题复选框
                                        "</div>" +
                                        "<div class='sh_width_11 sh_float_l  sh_font_sz26 '>" +
                                        "<div class='sh_margin_a sh_width_11'>" + comp.name + "</div>" +
                                        "</div>" +
                                        "</div>";//公司标题结束区域

                                    comp.shangpinIds.forEach(function (spGrpId) {
                                        var spGrp = comp.shangpins[spGrpId];
                                        str += "<div class='pro_de_cart_group'>";//产品详细区域开始
                                        spGrp.ids.forEach(function (spId) {
                                            var sp = spGrp.sameSPs[spId];
                                            var cs = sp.property;
                                            cs = cs ? cs.split(";") : ["", ""];
                                            cs.push("");
                                            var dataStr = "data-detail-id='" + spId + "'data-sp-grp-id='" + spGrpId + "' data-comp-id='" + compId + "'";
                                            str +=
                                                "<div class='sh_clear sh_pd_top30  sh_pd_bottom30 sh_bor_top_1 pro_de_cart_list'>" +
                                                "<div class='sh_width_1 sh_float_l sh_lingheight_100 sh_font_sz28 sh_te_align_r'>" +
                                                "<input  type='checkbox' name='pro_list' class='chkbox-in-list chkbox-shangpin' " + dataStr + "/>" +//产品详细内容复选框
                                                "</div><!--复选框结束-->" +
                                                "<div class='sh_width_11 sh_float_l line'><!--产品详细图片开始-->" +
                                                "<div class='sh_margin_a sh_width_11'>" +
                                                "<div class='sh_clear sh_width_4 sh_float_l sh_lingheight_100  sh_font_sz0 sh_pd_bottom30'>" +
                                                "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+sp.id+"'>"+"<img src='http://img.csc86.com" + sp.image + "' class='pro_de_cart' alt=''/>" +"</a>"+//详细内容图片
                                                "</div>" +//产品详细图片栏结束
                                                "<div class='sh_clear sh_width_8 sh_float_l sh_wor_space  sh_pd_bottom30'>" +
                                                "<div class=' sh_lingheight_1_5 sh_font_sz28'>" +"<a href='http://m.csc86.com/search/product_detail.ftl?productId="+sp.id+"' class='sh_font_color5'>"+ sp.name + "</a>"+"</div>" +
                                                "<div class='sh_font_color13 sh_font_sz26 sh_lingheight_100 sh_pd_top10 sh_pd_bottom10 sh_font_color18'><em >￥</em><em class='label-unit-price'>" +formatNum( sp.price.toFixed(2)) + "</em><em></em></div>" +
                                                "<div  class='sh_clear  sh_font_color13 sh_font_sz24 sh_ellipsis pro_de_cart_fi'>" +
                                                "<div class='sh_float_l sh_ellipsis sh_width_4 sh_font_sz24 sh_lingheight_100 sh_pd_top15 sh_pd_bottom15'>购买数量:</div>" +
                                                "<div class=' sh_float_r sh_width_260 sh_pr_hg50 sh_bor_a_2 sh_border_radius_5 '>" +
                                                "<div " + dataStr + " class='sh_width_18 sh_float_l sh_pr_hg50  sh_lingheight_48 good_size_min  sh_bor_right_2 disabled' ></div>" +
                                                "<input disabled type='text' " + dataStr + " value='" + sp.num + "' class='input-shangpin-num text_box sh_width_61 sh_font_sz24 sh_te_align_c sh_float_l  sh_pr_hg50 sh_v_middle'/>" +
                                                "<div " + dataStr + " class='sh_width_18 sh_float_l sh_pr_hg50 sh_lingheight_48 good_size_plus  sh_bor_left_2 disabled'></div>" +
                                                "</div>" +
                                                "</div>" +
                                                "</div>" +//数量栏结束
                                                "<div class='sh_clear_sp sh_font_color13 sh_font_sz24 sh_lingheight_100 '>" +
                                                    "<div class='sh_ellipsis sh_pd_bottom20'><em>" + cs[0] + "</em>" + "</div>" +
                                                    "<div class='sh_float_l sh_width_6 sh_ellipsis'><em>" + cs[1] + "</em></div>" +
                                                    "<div class='sh_float_r  sh_width_6 sh_ellipsis sh_te_align_r'><span>总价：</span>" +
                                                         "<em class='sh_font_color2'>￥</em>" + "<em class='sh_font_color2 pro_de_cartPl'>" + formatNum(sp.calcTotal().toFixed(2)) + "</em>" +
                                                    "</div>" +
                                                "</div>" +//总价栏结束
                                                "</div>" +
                                                "</div>" +//产品详细图片结束
                                                "</div>"
                                        });
                                        str += "</div>";//产品详细区域结束
                                    });
                                    str += "<div class='sh_pr_hg30 sh_bg_color_9'></div>" +//分割区域
                                    "</div>";//动态获取内容开始结束
                                });
                                $("#pro_de_cartContainer").html(str);
                                _bindEvents();
                                return;
                            }
                        },
                        error: function (xhr, type) {
                            var res =
                                "<div class='pro_de_cartContent' class=' sh_font_sz0 sh_lingheight_100'>" +//动态获取内容开始开始"
                                    "<img src='http://res.csc86.com/v2/shopping_center/market/demo/loading.gif' alt='' class='loading sh_img_max sh_pd_top182 sh_margin_a'/>" +
                                    "<span class='loading_p sh_font_sz34 sh_lingheight_100 sh_di_block sh_te_align_c'>.</span>" +
                                "</div>";
                            $("#pro_de_cartContainer").html(res);
                        }
                    });
                } else {//没有登录状态
                    var blank =
                        "<div class='pro_de_cartContent' class=' sh_font_sz0 sh_lingheight_100'>" +//动态获取内容开始开始"
                            "<img src='http://res.csc86.com/v2/shopping_center/market/demo/pro_de_cart_nLogin.png' alt=''class='sh_margin_a  sh_img_max'/>" +
                            "<a href='http://res.csc86.com/v2/shopping_center/market/html/login.html'>" +
                                "<img src='http://res.csc86.com/v2/shopping_center/market/demo/pro_de_cart_noLoginB.png' alt=''class='sh_margin_a  sh_img_max' style='height: 0.88rem'/>" +
                            "</a>" +
                        "</div>";
                    $("#pro_de_cartContainer").html(blank);
                }
            }
            isLogin($.debug ? "../../market/json/pro_de_cart.json" : "http://m.csc86.com/carDetail");//测试用
            function enableEditASp($el, flag) {
                var pars = $el.parentsUntil(".pro_de_cart_group");
                var classMtd = (flag) ? "removeClass" : "addClass";
                var attrMtd = (flag) ? "removeAttr" : "attr";
                pars.eq(pars.length - 1).find(".good_size_min")[classMtd]("disabled");
                pars.eq(pars.length - 1).find(".good_size_plus")[classMtd]("disabled");
                pars.eq(pars.length - 1).find(".input-shangpin-num")[attrMtd]("disabled", true);
                //if(flag){
                //    pars.eq(pars.length - 1).find(".pro_de_cart_fi").addClass("sh_bg_color_14");
                //    pars.eq(pars.length - 1).find(".input-shangpin-num").addClass("sh_bg_color_14");
                //}else{
                //    pars.eq(pars.length - 1).find(".pro_de_cart_fi").removeClass("sh_bg_color_14");
                //    pars.eq(pars.length - 1).find(".input-shangpin-num").removeClass("sh_bg_color_14");
                //}

            }
            function enableEdit(flag) {
                $els.edit.html(flag ? "完成" : "编辑");
                $els.btnGrp1.css("display", flag ? "none" : "block");
                $els.btnGrp2.css("display", flag ? "block" : "none");
                $els.list.find(".chkbox-shangpin").each(function () {
                    enableEditASp($(this), flag);
                });
                if (flag && $els.list.find(".chkbox-shangpin:checked").length)
                    toggleFavDel(true);
                else
                    toggleFavDel(false);
            }
            function toggleFavDel(isEnabled) {
                var toggle = isEnabled ? "removeClass" : "addClass";
                $els.btnGrp2[toggle]("disabled");
            }
            function toggleEdit(isEnabled) {
                var toggle = isEnabled ? "removeClass" : "addClass";
                $els.edit[toggle]("disabled");
            }
            function getSpChkBoxsOfAComp($compChkBox) {
                var pars = $compChkBox.parentsUntil('#pro_de_cartContainer');
                return pars.eq(pars.length - 1).find(".chkbox-shangpin");
            }
            function getElmOfASp($base, searchClass) {
                var pars = $base.parentsUntil('.pro_de_cart_group');
                return pars.eq(pars.length - 1).find(searchClass);
            }
            function getElmOfASpGrp($base, searchClass) {
                var pars = $base.parentsUntil('.pro_de_cartContent');
                return pars.eq(pars.length - 1).find(searchClass);
            }
            function refreshSpPrice($el, type) {
                var rslt = shopCart.chgNumFromUI(
                    $el.data("detailId"),
                    $el.data("spGrpId"),
                    $el.data("compId"),
                    type,
                    $el.val && $el.val()
                );
                rslt.err && console.log(rslt.err);
                getElmOfASp($el, ".input-shangpin-num").val(rslt.num);
                var pars = $el.parentsUntil('.pro_de_cartContent');
                var $grp = pars.eq(pars.length - 1);
                $grp.children().each(function () {
                    if ($(this).find(".chkbox-shangpin:checked").length) {
                        $(this).find(".label-unit-price").text(formatNum(rslt.price.toFixed(2)));
                        $(this).find(".pro_de_cartPl").text(function () {
                            var num = +getElmOfASp($(this), ".input-shangpin-num").val();
                            return formatNum((rslt.price * num).toFixed(2));
                        });
                    } else {
                        var $spCB = $(this).find(".chkbox-shangpin");
                        var sp = shopCart.getShangpin(
                            $spCB.data("detailId"),
                            $spCB.data("spGrpId"),
                            $spCB.data("compId")
                        );
                        $(this).find(".label-unit-price").text(formatNum(sp.price.toFixed(2)));
                        $(this).find(".pro_de_cartPl").text(formatNum((sp.price * sp.num).toFixed(2)));
                    }
                });

                $els.totalPrice.text(formatNum(shopCart.calcTotal().toFixed(2)));
            }
            // 数组格式
            function addFavOrDel1(url, type) {//购物车删除功能，移入收藏夹功能，完成功能
                if ($(this).hasClass("disabled")) return;
                var shangpinCBs = $els.list.find(".chkbox-shangpin:checked");
                var params;
                var delarr = [], favarr = [];
                shangpinCBs.each(function (){
                    var sp = shopCart.comps[$(this).data("compId")].shangpins[$(this).data("spGrpId")].sameSPs[$(this).data("detailId")];
                    favarr.push({
                       lineId: sp.detailId,
                       productId:sp.id,
                       shopId: sp.sellerId
                    });
                    delarr.push(sp.detailId);
                });
                switch (type) {
                   case "delete":
                       params={"lineIds":delarr.join(",")};
                       break;
                   default:
                       params={"favoritesList":favarr};
                       break;
                }
                //debugger;
                console.log("favorite / remove these shangpins:");
                console.log(params);
                $.ajax({
                    url: url,
                    type: "post",
                    contentType: "application/json; charset=utf-8",
                    dataType: "jsonp",
                    data:params,
                    success: function (data) {
                        console.log(data)
                        if (data.status==200) {
                            shopCart.isEditing = false;
                            toggleFavDel(false);
                            shangpinCBs.each(function () {
                                shopCart.removeAShangpin(
                                    $(this).data("detailId"),
                                    $(this).data("spGrpId"),
                                    $(this).data("compId")
                                );
                                $(this).parentsUntil('.pro_de_cart_group').remove();
                            });
                            var compCBs = $els.list.find(".chkbox-comp:checked");
                            compCBs.each(function () {
                                $(this).parentsUntil('#pro_de_cartContainer').remove();
                            });
                            updateTotalPrice();
                            if(shopCart.compIds.length==0){
                                var str=""
                                str =
                                    "<div class='pro_de_cartContent' class='sh_te_align_c sh_font_sz0'>" +//当购物车内容为空时
                                        "<img src='http://res.csc86.com/v2/shopping_center/market/demo/pro_de_cart_bl.png' alt='' class='loading sh_img_max sh_margin_a'/>" +
                                    "</div>";//如果没有数据或者长度为0时
                                $("#pro_de_cartContainer").html(str);
                                return;
                            }
                            console.log(shopCart.compIds)
                        }
                    },
                    error: function (xhr, type) {
                        console.log('Ajax error!');
                    }
                });

            }
            function updateTotalPrice() {
                $els.totalPrice.text(formatNum(shopCart.calcTotal().toFixed(2)));
                $els.selectedNum.text(shopCart.SpSelcNum);
                shopCart.SpSelcNum==0 && $els.chkAll.prop("checked", false);
            }
            function _bindEvents() {
                $els.totalPrice = $("#pro_de_totalprice");
                $els.selectedNum = $("#pro_de_cartNum");
                $els.list = $("#pro_de_cartContainer");
                $els.addFavr = $("#pro_de_cartSto");
                $els.delete = $("#pro_de_cartDe");
                $els.btnGrp1 = $(".pro_de_cartShow");
                $els.btnGrp2 = $(".pro_de_cartOp");
                $els.edit = $("#edit-btn");
                $els.chkAll = $(".check-all").click(function () {//全选
                    $els.list.find(".chkbox-shangpin" + (this.checked ? ":not(:checked)" : ":checked")).trigger("click");
                });
                $els.list.delegate(".chkbox-comp", "click", function () {
                    var el = $(this), compId = el.data("compId");

                    getSpChkBoxsOfAComp(el).filter(this.checked ? ":not(:checked)" : ":checked").trigger("click");

                });
                $els.list.delegate(".chkbox-shangpin", "click", function () {
                    var el = $(this), compId = el.data("compId");
                    var spGrpId = el.data("spGrpId");
                    var spId = el.data("detailId");
                    shopCart.clickAShangpinChk(spId, spGrpId, compId, this.checked);
                    var pars = el.parentsUntil('#pro_de_cartContainer');
                    pars.eq(pars.length - 1).find(".chkbox-comp").prop("checked", shopCart.comps[compId].chkNum == shopCart.comps[compId].shangpinIds.length);
                    $els.chkAll.prop("checked", (shopCart.chkNum == shopCart.compIds.length));
                    refreshSpPrice(getElmOfASp($(this), ".input-shangpin-num"), "click-spchkbox");
                    toggleFavDel(!!shopCart.SpSelcNum);
                });
                $els.list.delegate(".chkbox-in-list", "click", function () {
                    updateTotalPrice();
                });
                $els.list.delegate(".input-shangpin-num", "change", function () {
                    refreshSpPrice($(this), "input-change");
                });
                $els.list.delegate(".good_size_min", "click", function () {
                    //alert(1);
                    if ($(this).hasClass("disabled")) return;
                    refreshSpPrice($(this), $(this).hasClass("good_size_plus") ? "+1" : "-1");
                });
                $els.list.delegate(".good_size_plus", "click", function () {
                    //alert(1);
                    if ($(this).hasClass("disabled")) return;
                    refreshSpPrice($(this), $(this).hasClass("good_size_plus") ? "+1" : "-1");
                });
                $els.edit.click(function () {//修改数量功能
                    if (shopCart.isEditing) {
                        //debugger;
                        var shangpinCBs = $els.list.find(".chkbox-shangpin");
                        var params = [];
                        shangpinCBs.each(function () {
                            var sp = shopCart.comps[$(this).data("compId")].shangpins[$(this).data("spGrpId")].sameSPs[$(this).data("detailId")];
                            params.push({lineId: sp.detailId, quantity: sp.num});
                        });
                        $.post("http://m.csc86.com/batchUpdateCarQuantity",{"productDetailList":params}, function(data) {
                            console.log(data);
                            if(data.status==200){
                                shopCart.isEditing = false;
                                enableEdit(false);
                            }
                        },"jsonp");
                    } else {
                        shopCart.isEditing = true;
                        enableEdit(true);
                    }
                });
                $els.addFavr.click(function () {//移入收藏夹功能
                    addFavOrDel1.call(this, $.debug ? "../../market/json/pro_de_cart.json" : "http://m.csc86.com/batchMoveToFavorites");
                });
                $els.delete.click(function () {//购物车删除功能
                    addFavOrDel1.call(this, $.debug ? "../../market/json/pro_de_cart.json" : "http://m.csc86.com/deleteCarLine", "delete");
                });
            }
        },
        loading: function () {//购物车加载等待函数
            loading.m_change()
        }
    };
    pro_cart.shopping_cart();
    pro_cart.loading()
});