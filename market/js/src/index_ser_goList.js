/**
 * Created by Administrator on 2016/8/24.
 */
define(function(require, exports, module) {
    var _c= require('./index_ser_goListTest');
    var hostmap=seajs.hostmap;//域名配置
    var dropload= require('dropload');
    var fastclick = require("fastclick");//fastclick
    $(function(){
        FastClick.attach(document.body);
    });
   var value=require('./url_express');
    $("header").find(".tittle").html(decodeURI(value));  //标题栏加载数据
    //以上是获取浏览器url地址里面所带参数
    var isAjaxGoing = false, isIniting = true;
    var urlParams = {
        keyWord:decodeURI(value),
        _sort: null,
        page: 1
    }
    var url = _c.debug ? "/market/json/good_list.json" : "//" + hostmap.pro_list + "/search/product.do";
    var tabZongHe = $("#tab-zonghe");
    var tabPrice = $("#tab-price");
    var priceSort = $(".price_sort");
    var prodList = $("#pro_list");
    var droploadDown = $(".dropload-down");

    var dropload = $('.pro_list_container').dropload({
        scrollArea : window,
        domUp : {
            domClass   : 'dropload-up',
            domRefresh : '<div class="dropload-refresh sh_font_sz24 sh_te_align_c ">↓下拉刷新</div>',
            domUpdate  : '<div class="dropload-update sh_font_sz24 sh_te_align_c">↑释放更新</div>',
            domLoad    : '<div class="dropload-load sh_font_sz24 sh_te_align_c"><span class="loading"></span>加载中<em class="loading_p">.</em></div>'
        },
        domDown : {
            domClass   : 'dropload-down',
            domRefresh : '<div class="dropload-refresh sh_font_sz24 sh_te_align_c">↑上拉加载更多</div>',
            domLoad    : '<div class="dropload-load sh_font_sz24 sh_te_align_c"><span class="loading"></span>加载中<em class="loading_p">.</em></div>',
            domNoData  : '<div class="dropload-noData sh_font_sz24 sh_te_align_c">暂无数据</div>'
        },
        loadUpFn : function(me){
            if (isAjaxGoing) return;
            console.log("loadUpFn")
            urlParams.page = 1;
            refreshProdList();
        },
        loadDownFn : function(me){
            if (isAjaxGoing) return;

            if (isIniting) {
                isIniting = false;
            } else {
                urlParams.page++;
            }
            refreshProdList();
        }
    });
    function refreshProdList() {
        if (isAjaxGoing) return;
        // debugger;
        isAjaxGoing = true;
        var params = {
            keyWord: urlParams.keyWord,
            sort: urlParams.sort,
            page: urlParams.page
        };
        $.ajax({
            url: url + (_c.debug ? "?" + _c.hash-- : ""),
            type: "get",
            contentType: _c.contentType,
            data: params,
            dataType: _c.dataType,
            success:function(data){
                isAjaxGoing = false;
                var productList = data.data.productList;
                var totalPage = data.data.totalPage;
                   console.log(data);
                var result='';
                if (productList.length > 0) {

                    for(var j=0,len=productList.length;j<len; j++){
                        result +=
                            "<div class='sh_clear  sh_pd_top30  sh_pd_bottom30 sh_bor_top_1 sh_bg_color_1'>"+
                                "<div class='sh_width_92 sh_margin_a  sh_clear '>"+
                                    "<div class='sh_width_4 sh_float_l sh_lingheight_100  sh_font_sz0 '>"+
                                         "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+productList[j].productId+"'  data-href='"+productList[j].productId+"'>"+"<img src='"+productList[j].picUrl+"' class='index_ser_list' alt=''/>"+"</a>"+
                                    "</div>"+
                                    "<div class='sh_width_8 sh_float_l sh_wor_space  sh_positon_r sh_font_sz0'>"+
                                         "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+productList[j].productId+"'  data-href='"+productList[j].productId+"'>"+"<span class='sh_di_block sh_font_sz32 sh_lingheight_1_5 sh_pd_bottom10 sh_font_color5'>"+productList[j].title+"</span>"+"</a>"+
                                        "<span class='sh_di_block sh_font_sz28 sh_lingheight_100 sh_pd_bottom10 sh_pd_top10'>"+
                                             "<em class='sh_font_color2 '>￥</em>"+"<em class='sh_font_color2'>"+productList[j].price+"</em>"+"<em class='sh_font_color2'>起</em>"+
                                        "</span>"+
                                         "<div class='sh_font_sz24 sh_font_color7 sh_lingheight_100'>"+productList[j].province+productList[j].city+"</div>"+
                                    "</div>"+
                                "</div>"+
                            "</div>";
                    }
                }
                if (totalPage <= 0) {
                    prodList.html("<img src='http://res.csc86.com/v2/shopping_center/market/demo/index_serch_zero.png' alt='' class='sh_img_max'/>");
                    $(".pro_list_container").html("<img src='http://res.csc86.com/v2/shopping_center/market/demo/index_serch_zero.png' alt='' class='sh_img_max'/>");
                    //droploadDown.css("display","none");
                }else if (urlParams.page > 1){
                    prodList.append(result);
                }else {
                    prodList.html(result);
                }
                // 每次数据加载完，必须重置
                dropload.resetload();
                if(totalPage <= 0 || urlParams.page >= totalPage){
                    // 锁定
                    dropload.lock();
                    dropload.noData();
                }else {
                    dropload.unlock();
                    dropload.noData(false);
                }
                dropload.resetload();
            },
            error: function(xhr, type){
                alert('请求数据错误');
                // 即使加载出错，也得重置
                dropload.resetload();
            }
        });
    }
    // bind events
    Object.defineProperties(urlParams, {
        "sort": {
            set: function (val) {
                priceSort.removeClass('active');
                switch(val) {
                    case "price-asc":
                        priceSort.filter(".triangle_up").addClass('active');
                        tabZongHe.removeClass('active');
                        tabPrice.addClass('active');
                        break;
                    case "price-desc":
                        tabZongHe.removeClass('active');
                        tabPrice.addClass('active');
                        priceSort.filter(".triangle_down").addClass('active');
                        break;
                    default:
                        tabZongHe.addClass('active');
                        tabPrice.removeClass('active');
                        break;
                }
                this._sort = val;
            },
            get: function () { return (this._sort) ? this._sort : undefined;}
        }
    });
    tabZongHe.click(function () {
        if (isAjaxGoing) return;
        if (urlParams.sort === null) return;
        urlParams.sort = null;
        urlParams.page = 1;

        refreshProdList();
    });
    tabPrice.click(function () {
        if (isAjaxGoing) return;
        if (urlParams.sort === 'price-asc') {
            urlParams.sort = 'price-desc';
        }else {
            urlParams.sort = 'price-asc';
        }
        urlParams.page = 1;
        refreshProdList();
    });
});