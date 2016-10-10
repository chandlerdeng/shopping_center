/**
 * Created by Administrator on 2016/9/1.
 */
define(function (require, exports, module) {
    require('swiper');//滑动插件
    var formatNum=require('http://res.csc86.com/f=v2/shopping_center/market/js/src/formatNum');
    var isLogin = require('//api.csc86.com/notify/count/all/?callback=define');
    //var fastclick = require("http://res.csc86.com/f=v2/shopping_center/market/js/src/fastclick");
    //$(function() {
    //    FastClick.attach(document.body);
    //});
    var pro_de_intr = {  //此对象是商品详情页对应js
        tab: function () {//商品详情页面tab切换
            $(".sh_tab_box li").on('click', function () {//tab函数
                //debugger;
                $(".sh_tab_box li").eq($(this).index()).addClass("sh_active").siblings().removeClass('sh_active');
                $(".sh_tab").hide().eq($(this).index()).show();
            })
        },
        goTopEx: function () {//商品详情页面置顶按钮函数
            var h = $(window).height();
            window.onscroll = function () {
                $(window).scrollTop() > 1 * h ? $("#backToTop").css("display", "block") : $("#backToTop").css("display", "none");
            };
            $("#backToTop").on("click", function () {
                var goTop = setInterval(scrollMove, 10);
                function scrollMove() {
                    $(window).scrollTop(($(window).scrollTop() / 1.1));
                    if ($(window).scrollTop() < 1) clearInterval(goTop);
                }
            })
        },
        show_img: function () {//商品详情页面轮播以及热选精销轮播
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
            var index_choose_container = new Swiper('.index_choose_container', {
                slidesPerView: 3,
                paginationClickable: true,
                spaceBetween: 5
            });
        },
        size_choose: function (shangPin) {//商品详情页面
            var $num = $("#sys_spec_number");//数量区域
            var $ok = $("#sys_spec_ok");//确定键
            var $num_input = $num.find("input").eq(0).on("change", _onNumChange);
            var $totalPrice = $("#sys_spec_totalprice");
            var shCart_buyRi=false;//判断是由购物车发起弹窗还是立刻购买发起弹窗
            function _show(e) {//弹窗显示函数
                    if($(e.target).hasClass("pro_de_intrSc")){
                        shCart_buyRi=true;
                    }else{
                        shCart_buyRi=false;
                    }
                    if (shangPin.specNames.length == 0) {//如果是传入的属性名字为空，既是颜色及规格都没有时，则执行下面的函数此处必须是规格报价时
                        _enableSubmit(true);
                    }
                    shangPin.specNames.forEach(function (name) {
                        $("#sys_spec_" + name).find("ul>li").removeClass("selected");
                        shangPin.specs[name] = 0;
                    });
                    $('.popup_cover').stop().show();
                    $(".pro_de_siP").stop().slideDown();
                    $("body").css("overflow-y", "hidden")
            }
            function _hide() {//弹窗隐藏函数
                _enableSubmit(false);
                $('.popup_cover').stop().hide();
                $('.pro_de_siP').stop().slideUp();
                $("body").css("overflow-y", "visible")
            }
            $(".pro_de_intrSc").add($(".pro_de_intrSi").parent()).add($(".pro_de_intrSc").next()).on('click', _show);//弹出窗展示
            $('.pro_de_wr').on('click', _hide);//弹出窗消失隐藏

            function _onNumChange() {//数量改变函数
                var num = +$(this).val();
                if (isNaN(num) || num < shangPin.minNum || num > shangPin.maxNum) {
                    $(this).val(shangPin.num);
                } else {
                    shangPin.num = num;
                    _calcTotal();
                }
            }
            function _calcTotal() {//数量改变总价改变函数
                var total = shangPin.calcTotal().toFixed(2);
                $totalPrice.text(formatNum(total));
            }
            function _onMinusClick() {//减号函数
                if (shangPin.num > 1) {
                    shangPin.num--;
                    $num_input.val(shangPin.num); _calcTotal();
                    $num.find(".good_size_plus").off("click").removeClass("disabled").click(_onPlusClick);
                }
                if (shangPin.num <= shangPin.minNum) {
                    $(this).addClass("disabled").off("click");
                }
            }
            function _onPlusClick() {//加号函数
                shangPin.num++;
                $num_input.val(shangPin.num); _calcTotal();
                $num.find(".good_size_min").off("click").removeClass("disabled").click(_onMinusClick);
                if (shangPin.num >= shangPin.maxNum) {
                    $(this).addClass("disabled").off("click");
                }
            }
            function _onOKClick() {//点击加入购物车确定键，当已经登录直接加入购物车，否则跳转到登录页面
                if (isLogin.status) {//该处确定按钮判断是加入购物车还是立刻购买；立刻购买直接到订单页面
                    if(shCart_buyRi){
                        if(isLogin.data.id==shangPin.sellerId){
                            $("#msg-content").html("不能对自己店铺的商品下单").show();
                            setTimeout(function(){
                                $("#msg-content").hide();
                                _hide();
                            },1000)
                            return;
                        }
                        $.post("http://m.csc86.com/addShoppingCar",{"buyerId":123,
                            "productId": shangPin.id,
                            "sellerId":shangPin.sellerId,
                            "productDetailList":[{
                            "num":shangPin._num,"colorId":shangPin.specs.color,"sizeId":shangPin.specs.size
                        }]}, function(data) {
                            console.log(data);
                            if(data.status==200){
                                var sh_cart = +$(".pro_de_num_c").html();
                                $(".pro_de_num_c").html(sh_cart+=shangPin.num);
                                if(sh_cart>0){
                                    $(".sh_cart").show()
                                };
                                if(sh_cart>=100){
                                    $(".pro_de_num_c").html("99");
                                    $(".pro_de_add_c").show()
                                }
                                _hide()
                            }else{
                                alert("添加失败");
                                _hide()
                            }

                        },"jsonp");
                    }else{
                      alert("跳转到订单页面");
                    }
                } else {
                    window.location.href = "http://res.csc86.com/v2/shopping_center/market/html/login.html"
                }
            }
            function _enableSubmit(type) {//是否置灰函数
                if (type) {
                    //debugger;
                    if (shangPin.enabled) return;//undefined
                    if (shangPin.maxNum > shangPin.minNum) {
                        $num_input.removeAttr("disabled");
                        $num.find(".good_size_min").off("click").addClass("disabled");
                        $num.find(".good_size_plus").removeClass("disabled").click(_onPlusClick);
                    }
                    if (shangPin.maxNum >= shangPin.minNum) {
                        shangPin.num = shangPin.minNum;
                        $num_input.val(shangPin.num); _calcTotal();
                        $ok.removeClass("disabled").click(_onOKClick);
                        shangPin.enabled = true;
                    }
                } else {
                    if (!shangPin.enabled) return;
                    shangPin.num = 0;
                    $num_input.attr("disabled", true).val(shangPin.num); _calcTotal();
                    $num.find(".good_size_min").off("click").addClass("disabled");
                    $num.find(".good_size_plus").off("click").addClass("disabled");
                    $ok.addClass("disabled").off("click");
                    shangPin.enabled = false;
                }
            }
            function _ajaxGetPrice() {//从后台获取价格函数
                shangPin.getPriceDefer().then(function (rslt) {
                    if (rslt === true) {
                        _enableSubmit(true);
                        if(shangPin.priceList.length>0&&shangPin.priceList.length<=1){
                            var str=""
                            for(var i= 0,len=shangPin.priceList.length;i<len;i++){
                                 str+=
                                     "<div class=' sh_width_4 sh_float_l sh_pd_bottom30'>"+
                                        "<div class='sh_bor_left_1 sh_pd_left14 pro-de-prsh'>"+
                                            "<a href='' class='sh_di_block sh_pd_bottom10 sh_font_color13 sh_font_sz24 sh_ellipsis'>"+
                                                 "<span><em class='pro_de_num'>"+">="+ shangPin.priceList[i].min+"</em></span><span>件</span>"+
                                            "</a>"+
                                            "<a href='' class='sh_di_block  sh_font_color2 sh_font_sz28  sh_ellipsis'>"+
                                                "<span>￥</span>"+
                                                "<span><em class=''>"+formatNum(shangPin.priceList[i].price)+"</em></span>"+
                                                "<span>起</span>"+
                                            "</a>"+
                                        "</div>"+
                                     "</div>"
                            }
                            $(".pro_de_intr_spa").html(str)
                        }else{
                            var res="";
                            for(var j= 0,len=shangPin.priceList.length;j<len;j++){
                                res+=
                                "<div class=' sh_width_4 sh_float_l sh_pd_bottom30'>"+
                                    "<div class='sh_bor_left_1 sh_pd_left14'>"+
                                        "<a href='' class='sh_di_block sh_pd_bottom10 sh_font_color3 sh_font_sz24 sh_ellipsis'>"+
                                          "<span><em class='pro_de_num'>";
                                            if ((j+1)==len) {
                                                res += ">=" + shangPin.priceList[j].min
                                            } else {
                                                res += shangPin.priceList[j].min + "</em> - <em class='pro_de_num'> " + (shangPin.priceList[j+1].min - 1);
                                            }
                                 res +="</em></span><span>件</span>"+
                                        "</a>"+
                                        "<a href='' class='sh_di_block sh_font_color2 sh_font_sz28  sh_ellipsis '>"+
                                            "<span>￥</span>"+
                                            "<span><em class=''>"+formatNum(shangPin.priceList[j].price)+"</em></span>"+
                                            "<span>起</span>"+
                                        "</a>"+
                                    "</div>"+
                               "</div>"
                            }
                            $(".pro_de_intr_spa").html(res)
                        }

                    } else {
                        _enableSubmit(false);
                    }
                });
            }
            function _callBack(type) {//有颜色规格选中之后再执行的函数
                return function () {
                    if (shangPin.isAjaxing) return false;
                    _enableSubmit(false);
                    if (!!$(this).hasClass("selected")) {
                        $(this).removeClass("selected");
                        shangPin.setSpec(type, 0);
                    } else {
                        $(this).addClass("selected").siblings("li").removeClass("selected");
                        shangPin.setSpec(type, $(this).data("aid"));//存放sku值的数组
                    }
                    if (shangPin.isAllSpecSetted()){
                        _ajaxGetPrice();
                    }

                };
            }

            shangPin.specNames.forEach(function (name) {//给属性下面对应的每个属性绑定事件,颜色置灰的除外，specNames是初始化时页面上判断是颜色属性还是规格属性，数组存放
                $("#sys_spec_" + name).delegate("ul>li:not(.pro_de_sizeNn)", "click", _callBack(name));
            });
            var _is_store_not=null;
              function _store(){//判断是否收藏
                  $.ajax({
                      url:"http://m.csc86.com/judgeIsFavorites",
                      type: "post",
                      data:{"collectId":shangPin.id},
                      dataType:"jsonp",
                      success: function (data) {
                          console.log(data);
                          if(data.status==200){
                              $(".pro_intrStore_ch").eq(0).attr("src", "http://res.csc86.com/v2/shopping_center/market/demo/pro_intrStore_l.png");
                              _is_store_not=true;//已经收藏
                          }else{
                              _is_store_not=false;//没有被收藏
                          }
                          $(".pro_intrStore_ch").eq(0).on('click',_change_store);
                          return;
                      },
                      error: function (xhr, type) {
                          console.log('添加到收藏夹失败');
                      }
                  });
              }
            _store();
            function _change_store() {//添加到收藏夹功能
                if (isLogin.status){
                    if(_is_store_not){//已经收藏过则是取消收藏
                        $.ajax({
                            url:"http://m.csc86.com/cancelFavorites",
                            type: "post",
                            data:{"collectId":shangPin.id},
                            dataType:"jsonp",
                            success: function (data) {
                                console.log(data);
                                if(data.status==200){
                                    $(".pro_intrStore_ch").eq(0).attr("src", "http://res.csc86.com/v2/shopping_center/market/demo/pro_intrStore_f.png");
                                    $("#msg-content").html(data.msg).show();
                                    setTimeout(function(){
                                        $("#msg-content").hide()
                                    },1000)
                                     _is_store_not=false;
                                    return;
                                }
                            },
                            error: function (xhr, type) {
                                console.log('添加到收藏夹失败');
                            }
                        });
                    }else{
                        $.ajax({
                            url:"http://m.csc86.com/addFavorites",
                            type: "post",
                            data:{"productId":shangPin.id,"shopId":shangPin.sellerId},
                            dataType:"jsonp",
                            success: function (data) {
                                console.log(data);
                                if(data.status==200){
                                    $(".pro_intrStore_ch").eq(0).attr("src", "http://res.csc86.com/v2/shopping_center/market/demo/pro_intrStore_l.png");
                                    $("#msg-content").html(data.msg).show()
                                    setTimeout(function(){
                                        $("#msg-content").hide()
                                    },2000)
                                    _is_store_not=true;
                                    return;
                                }
                            },
                            error: function (xhr, type) {
                                console.log('添加到收藏夹失败');
                            }
                        });
                    }

                } else {
                    window.location.href = "http://res.csc86.com/v2/shopping_center/market/html/login.html";
                    $(this).attr("src", "http://res.csc86.com/v2/shopping_center/market/demo/pro_intrStore_f.png");
                }
            }

        },
        sh_cart: function () {//产品详情页面初始化时判断是否登录调用后台展示购物车数量
            var isLogin_not=require('http://res.csc86.com/f=v2/shopping_center/market/js/src/isLogin_not');
            isLogin_not("http://m.csc86.com/carCount",".sh_cart",".pro_de_add_c")
        }
    };//此对象是商品详情页对应js;
    pro_de_intr.tab();
    pro_de_intr.goTopEx();
    pro_de_intr.show_img();
    pro_de_intr.sh_cart();
    module.exports = pro_de_intr;
});