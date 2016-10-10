/**
 * Created by Administrator on 2016/8/24.
 */
define(function(require, exports, module) {
    var hostmap=seajs.hostmap;//域名配置
    var loading= require('./loading');
    var dropload= require('./dropload');
    var _c= require('./config');
    //require('dropload');//dropload
    //var fastclick = require("http://res.csc86.com/f=v2/shopping_center/market/js/src/fastclick");
    //$(function() {
    //    FastClick.attach(document.body);
    //});
    var name,value='', i;
    var str=location.href.toString().toLowerCase(); //获得浏览器地址栏URL串
    var num=str.indexOf("?")
    str=str.substr(num+1); //截取“?”后面的参数串
    var arrtmp=str.split("&"); //将各参数分离形成参数数组
    var showStr="";
    for(i=0;i < arrtmp.length;i++)
    {
        num=arrtmp[i].indexOf("=");
        if(num>0)
        {
            name=arrtmp[i].substring(0,num);//取得参数名称
            value=arrtmp[i].substr(num+1); //取得参数值
            this[name]=value; //定义对象属性并初始化
            showStr+="name="+name+" value="+value+"<br />";//测试是否获取到url地址里面参数
        }
    }
    //以上是获取浏览器url地址里面所带参数
    var ajaxCount = 0, isIniting = true;
    var urlParams = {
        keyWord: value,
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
            console.log("loadUpFn")
            urlParams.page = 1;
            refreshProdList();
        },
        loadDownFn : function(me){
            console.log("loadDownFn")
            if (isIniting) {
                isIniting = false;
            } else {
                urlParams.page++;
            }
            refreshProdList();
        }
    });
    function refreshProdList() {
        // debugger;
        loading.m_change();
        var ajaxId = ++ajaxCount;
        $.ajax({
            url: url,
            type: "get",
            contentType: _c.contentType,
            data: urlParams,
            dataType: _c.dataType,
            success:function(data){
                if (ajaxId < ajaxCount) return; // 如果有新的ajax在执行, 放弃这次结果
                var productList = data.data.productList;
                var totalPage = data.data.totalPage;

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
                if(urlParams.page >= totalPage){
                    // 锁定
                    dropload.lock();
                    dropload.noData();
                }
                if (!result) {
                    prodList.html("<img src='http://res.csc86.com/v2/shopping_center/market/demo/index_serch_zero.png' alt='' class='sh_img_max'/>");
                    droploadDown.css("display","none");
                }else if (urlParams.page > 1){
                    prodList.append(result);
                }else {
                    prodList.html(result);
                }
                // 每次数据加载完，必须重置
                dropload.resetload();
            },
            error: function(xhr, type){
                alert('Ajax error!');
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
            get: function () { return this._sort;}
        }
    });
    tabZongHe.click(function () {
        if (urlParams.sort === null) return;
        urlParams.sort = null;
        urlParams.page = 1;

        refreshProdList();
    });
    tabPrice.click(function () {
        if (urlParams.sort === 'price-asc') {
            urlParams.sort = 'price-desc';
        }else {
            urlParams.sort = 'price-asc';
        }
        urlParams.page = 1;
        refreshProdList();
    });


    var order_by={
        in_data:function(){           //标题栏加载数据
            $("header").find(".tittle").html(value)
        }
    };
    order_by.in_data();
});