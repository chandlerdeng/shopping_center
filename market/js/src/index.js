define(function(require, exports, module) {
	require('swiper');//滑动插件
	var fastclick = require("http://res.csc86.com/f=v2/shopping_center/market/js/src/fastclick");
	$(function() {
	    FastClick.attach(document.body);
	});
    var init={
		index:{
			show_img:function(){//商品详情页面轮播以及热选精销轮播
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
			shop_goo_ex:function(){//首页以及商品搜索页面店铺与商店切换
				var index = {
					"isFalse": true
				};
				$(".index_triangle").click(function () {
					if (index.isFalse) {
						$(this).find("span").html("商铺");
						index.isFalse = false;
					} else {
						$(this).find("span").html("商品");
						index.isFalse = true;
					}
				})
				$(".index_ser_bg").focus(function () {
					//alert("111")
					var data_index = $(this).prev().find("span").html()
					if (data_index == "商品") {
						window.location.href = "http://m.csc86.com/search/searchProduct.ftl"
					} else {
						window.location.href = "index_ser_shop.html"
					}
				});
				function index_ser_goo(ele,sel){
					var null_r = $(ele).val();
					var data_ser = $(sel).prev().html()
					var reg = /^\s*$/g;//  如果是空，或者""
					if(null_r!=""&&!reg.test(null_r)){
						if (data_ser == "商品"){
							//alert("111")
							window.location.href = "http://m.csc86.com/search/product.ftl?keyWord=" + null_r
						}else{
							window.location.href = "index_ser_shopList.html?keyWord=" + null_r
						}
					}else{
						alert("请输入")
					}
				}
				$(".index_ser_goo").bind("blur",function(){
					index_ser_goo(".index_ser_goo",".triangle-bottomright")
				});
				$(".index_ser_circle").bind("blur",function(){
					index_ser_goo(".index_ser_goo",".triangle-bottomright")
				});
			},
			_shop_cart:function(){
				var isLogin_not=require('http://res.csc86.com/f=v2/shopping_center/market/js/src/isLogin_not');
				isLogin_not("http://m.csc86.com/carCount",".sh_cart_index",".pro_de_add_s")
			}
		}
	};
	init.index.shop_goo_ex();
	init.index.show_img();
	init.index._shop_cart();

});