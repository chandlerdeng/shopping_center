/**
 * Created by Administrator on 2016/8/24.
 */
define(function(require, exports, module) {
    var hostmap=seajs.hostmap;//域名配置
    var loading= require('./loading');
    require('dropload');//dropload
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
    var itemIndex= 0,tab1LoadEnd = false,tab2LoadEnd=false,tab3LoadEnd=false;
    var counter = 1,counter1= 1,counter2= 1, pageStart = 0,pageEnd = 0,pageStart1 = 0,pageEnd1 = 0,pageStart2 = 0,pageEnd2 = 0,num = 1,num1 = 1, num2 = 1;
    $('.item').on('click',function(){
        var $this = $(this);
        itemIndex = $this.data("aid");
        //var i=0;
        //$(".data_click").eq(1).on('click',function(){
        //    i++;
        //    if(i%2==0){
        //
        //    }else{
        //
        //    }
        //});
        $('.pro_list').eq(itemIndex).show().siblings('.pro_list').hide();
        // 如果选中菜单一
        if(itemIndex == '0'){
            // 如果数据没有加载完
            //$(this).css("color","#4da1fc");
            $(".triangle_up").css("border-bottom-color","#c5c5c5");
            $(".triangle_down").css("border-top-color","#c5c5c5");
            if(!tab1LoadEnd){
                // 解锁
                dropload.unlock();
                dropload.noData(false);
            }else{
                // 锁定
                dropload.lock('down');
                dropload.noData();
            }
            // 如果选中菜单二
        }else if(itemIndex == '1'){
            $(this).css("border-bottom-color","#4da1fc").next().css("border-top-color","#c5c5c5");
            if(!tab2LoadEnd){
                // 解锁
                dropload.unlock();
                dropload.noData(false);
            }else{
                // 锁定
                dropload.lock('down');
                dropload.noData();
            }
        }
        else if(itemIndex == '2'){
            $(this).css("border-top-color","#4da1fc").prev().css("border-bottom-color","#c5c5c5")
            if(!tab3LoadEnd){
                // 解锁
                dropload.unlock();
                dropload.noData(false);
            }else{
                // 锁定
                dropload.lock('down');
                dropload.noData();
            }
        }
        // 重置
        dropload.resetload();
    });
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
            loading.m_change();
            // 加载菜单一的数据
            if(itemIndex == '0'){
                $.ajax({
                    url:"//"+hostmap.pro_list+"/search/product.do?keyWord="+value+"&page=1",
                    type:"get",
                    dataType:"jsonp",
                    success:function(data){
                        console.log(data)
                        var result='';
                        for(var j=0,len=data.data.productList.length;j<len; j++){
                            result +=
                                "<div class='sh_clear  sh_pd_top30  sh_pd_bottom30 sh_bor_top_1 sh_bg_color_1'>"+
                                "<div class='sh_width_92 sh_margin_a  sh_clear '>"+
                                "<div class='sh_width_4 sh_float_l sh_lingheight_100  sh_font_sz0 '>"+
                                "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+data.data.productList[j].productId+"'  data-href='"+data.data.productList[j].productId+"'>"+"<img src='"+data.data.productList[j].picUrl+"' class='index_ser_list' alt=''/>"+"</a>"+
                                "</div>"+
                                "<div class='sh_width_8 sh_float_l sh_wor_space  sh_positon_r sh_font_sz0'>"+
                                "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+data.data.productList[j].productId+"'  data-href='"+data.data.productList[j].productId+"'>"+"<span class='sh_di_block sh_font_sz32 sh_lingheight_1_5 sh_pd_bottom10 sh_font_color5'>"+data.data.productList[j].title+"</span>"+"</a>"+
                                "<span class='sh_di_block sh_font_sz28 sh_lingheight_100 sh_pd_bottom10 sh_pd_top10'>"+
                                "<em class='sh_font_color2 '>￥</em>"+"<em class='sh_font_color2'>"+data.data.productList[j].price+"</em>"+"<em class='sh_font_color2'>起</em>"+
                                "</span>"+
                                "<div class='sh_font_sz24 sh_font_color7 sh_lingheight_100'>"+data.data.productList[j].province+data.data.productList[j].city+"</div>"+
                                "</div>"+
                                "</div>"+
                                "</div>";
                        }
                        $('.pro_list').eq(0).html(result);
                        // 每次数据加载完，必须重置
                        me.resetload();
                        // 重置索引值，重新拼接more.json数据
                        counter =1;
                        // 解锁
                        me.unlock();
                        me.noData(false);
                    },
                    error: function(xhr, type){
                        alert('Ajax error!');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
                // 加载菜单二的数据
            } else if(itemIndex == '1'){
                $.ajax({
                    url:"//"+hostmap.pro_list+"/search/product.do?keyWord="+value+"&sort=price-asc&page=1",
                    type:"get",
                    dataType:"jsonp",
                    success:function(data){
                        console.log(data)
                        var result='';
                        for(var j=0,len=data.data.productList.length;j<len; j++){
                            result +=
                                "<div class='sh_clear  sh_pd_top30  sh_pd_bottom30 sh_bor_top_1 sh_bg_color_1'>"+
                                "<div class='sh_width_92 sh_margin_a  sh_clear '>"+
                                "<div class='sh_width_4 sh_float_l sh_lingheight_100  sh_font_sz0 '>"+
                                "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+data.data.productList[j].productId+"'  data-href='"+data.data.productList[j].productId+"'>"+"<img src='"+data.data.productList[j].picUrl+"' class='index_ser_list' alt=''/>"+"</a>"+
                                "</div>"+
                                "<div class='sh_width_8 sh_float_l sh_wor_space  sh_positon_r sh_font_sz0'>"+
                                "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+data.data.productList[j].productId+"'  data-href='"+data.data.productList[j].productId+"'>"+"<span class='sh_di_block sh_font_sz32 sh_lingheight_1_5 sh_pd_bottom10 sh_font_color5'>"+data.data.productList[j].title+"</span>"+"</a>"+
                                "<span class='sh_di_block sh_font_sz28 sh_lingheight_100 sh_pd_bottom10 sh_pd_top10'>"+
                                "<em class='sh_font_color2 '>￥</em>"+"<em class='sh_font_color2'>"+data.data.productList[j].price+"</em>"+"<em class='sh_font_color2'>起</em>"+
                                "</span>"+
                                "<div class='sh_font_sz24 sh_font_color7 sh_lingheight_100'>"+data.data.productList[j].province+data.data.productList[j].city+"</div>"+
                                "</div>"+
                                "</div>"+
                                "</div>";
                        }
                        $('.pro_list').eq(1).html(result);
                        // 每次数据加载完，必须重置
                        me.resetload();
                        // 重置索引值，重新拼接more.json数据
                        counter1 =1;
                        // 解锁
                        me.unlock();
                        me.noData(false);
                    },
                    error: function(xhr, type){
                        alert('Ajax error!');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
                // 加载菜单二的数据
            } else if(itemIndex == '2'){
                $.ajax({
                    url:"//"+hostmap.pro_list+"/search/product.do?keyWord="+value+"&sort=price-desc&page=1",
                    type:"get",
                    dataType:"jsonp",
                    success:function(data){
                        console.log(data)
                        var result='';
                        for(var j=0,len=data.data.productList.length;j<len; j++){
                            result +=
                                "<div class='sh_clear  sh_pd_top30  sh_pd_bottom30 sh_bor_top_1 sh_bg_color_1'>"+
                                "<div class='sh_width_92 sh_margin_a  sh_clear '>"+
                                "<div class='sh_width_4 sh_float_l sh_lingheight_100  sh_font_sz0 '>"+
                                "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+data.data.productList[j].productId+"'  data-href='"+data.data.productList[j].productId+"'>"+"<img src='"+data.data.productList[j].picUrl+"' class='index_ser_list' alt=''/>"+"</a>"+
                                "</div>"+
                                "<div class='sh_width_8 sh_float_l sh_wor_space  sh_positon_r sh_font_sz0'>"+
                                "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+data.data.productList[j].productId+"'  data-href='"+data.data.productList[j].productId+"'>"+"<span class='sh_di_block sh_font_sz32 sh_lingheight_1_5 sh_pd_bottom10 sh_font_color5'>"+data.data.productList[j].title+"</span>"+"</a>"+
                                "<span class='sh_di_block sh_font_sz28 sh_lingheight_100 sh_pd_bottom10 sh_pd_top10'>"+
                                "<em class='sh_font_color2 '>￥</em>"+"<em class='sh_font_color2'>"+data.data.productList[j].price+"</em>"+"<em class='sh_font_color2'>起</em>"+
                                "</span>"+
                                "<div class='sh_font_sz24 sh_font_color7 sh_lingheight_100'>"+data.data.productList[j].province+data.data.productList[j].city+"</div>"+
                                "</div>"+
                                "</div>"+
                                "</div>";
                        }
                        $('.pro_list').eq(2).html(result);
                        // 每次数据加载完，必须重置
                        me.resetload();
                        // 重置索引值，重新拼接more.json数据
                        counter2 = 2;
                        // 解锁
                        me.unlock();
                        me.noData(false);
                    },
                    error: function(xhr, type){
                        alert('Ajax error!');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
                // 加载菜单二的数据
            }
        },
        loadDownFn : function(me){
            // 加载菜单一的数据
            //console.log(itemIndex)
            if(itemIndex == '0'){
                $.ajax({
                    url:"//"+hostmap.pro_list+"/search/product.do?keyWord="+value+"&page="+counter,
                    type:"get",
                    dataType:"jsonp",
                    success:function(data){
                        //console.log(data);
                        var result='';
                        counter++;//默认counter为1
                        pageEnd = num * counter;//pageENd默认为1*1=1
                        pageStart = pageEnd - num;//pagestart默认为1-1=0
                        if(data.data.productList.length>0&&$.isArray(data.data.productList)){
                            for(var i=pageStart;i<=pageEnd; i++){
                                for(var j=0,len=data.data.productList.length;j<len; j++){

                                    result +=
                                        "<div class='sh_clear  sh_pd_top30  sh_pd_bottom30 sh_bor_top_1 sh_bg_color_1'>"+
                                        "<div class='sh_width_92 sh_margin_a  sh_clear '>"+
                                        "<div class='sh_width_4 sh_float_l sh_lingheight_100  sh_font_sz0 '>"+
                                        "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+data.data.productList[j].productId+"'  data-href='"+data.data.productList[j].productId+"'>"+"<img src='"+data.data.productList[j].picUrl+"' class='index_ser_list' alt=''/>"+"</a>"+
                                        "</div>"+
                                        "<div class='sh_width_8 sh_float_l sh_wor_space  sh_positon_r sh_font_sz0'>"+
                                        "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+data.data.productList[j].productId+"'  data-href='"+data.data.productList[j].productId+"'>"+"<span class='sh_di_block sh_font_sz32 sh_lingheight_1_5 sh_pd_bottom10 sh_font_color5'>"+data.data.productList[j].title+"</span>"+"</a>"+
                                        "<span class='sh_di_block sh_font_sz28 sh_lingheight_100 sh_pd_bottom10 sh_pd_top10'>"+
                                        "<em class='sh_font_color2 '>￥</em>"+"<em class='sh_font_color2'>"+data.data.productList[j].price+"</em>"+"<em class='sh_font_color2'>起</em>"+
                                        "</span>"+
                                        "<div class='sh_font_sz24 sh_font_color7 sh_lingheight_100'>"+data.data.productList[j].province+data.data.productList[j].city+"</div>"+
                                        "</div>"+
                                        "</div>"+
                                        "</div>";

                                }
                                if(counter>data.data.totalPage){
                                    // 数据加载完
                                    tab1LoadEnd = true;
                                    // 锁定
                                    me.lock();
                                    // 无数据
                                    me.noData();
                                    break;
                                }
                            }
                            $('.pro_list').eq(0).append(result);
                            // 每次数据加载完，必须重置
                            me.resetload();
                        }else{
                            $('.pro_list').eq(0).html("<img src='http://res.csc86.com/v2/shopping_center/market/demo/index_serch_zero.png' alt='' class='sh_img_max'/>");
                            $(".dropload-down").css("display","none")
                        }
                    },
                    error: function(xhr, type){
                        alert('Ajax error!');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
                // 加载菜单二的数据
            }else if(itemIndex == '1'){
                $.ajax({
                    url:"//"+hostmap.pro_list+"/search/product.do?keyWord="+value+"&sort=price-asc&page="+counter2,
                    type:"get",
                    dataType:"jsonp",
                    success:function(data){
                        console.log(data)
                        var result='';
                        counter1++;//默认counter1为1
                        pageEnd1 = num1 * counter1;//pageENd1默认为1*1=1
                        pageStart1 = pageEnd1 - num1;//pagestart1默认为1-1=0
                        if(data.data.productList.length>0&&$.isArray(data.data.productList)){
                            for(var i= pageStart1;i< pageEnd1; i++){
                                for(var j=0,len=data.data.productList.length;j<len; j++){
                                    result +=
                                        "<div class='sh_clear  sh_pd_top30  sh_pd_bottom30 sh_bor_top_1 sh_bg_color_1'>"+
                                        "<div class='sh_width_92 sh_margin_a  sh_clear '>"+
                                        "<div class='sh_width_4 sh_float_l sh_lingheight_100  sh_font_sz0 '>"+
                                        "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+data.data.productList[j].productId+"'  data-href='"+data.data.productList[j].productId+"'>"+"<img src='"+data.data.productList[j].picUrl+"' class='index_ser_list' alt=''/>"+"</a>"+
                                        "</div>"+
                                        "<div class='sh_width_8 sh_float_l sh_wor_space  sh_positon_r sh_font_sz0'>"+
                                        "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+data.data.productList[j].productId+"'  data-href='"+data.data.productList[j].productId+"'>"+"<span class='sh_di_block sh_font_sz32 sh_lingheight_1_5 sh_pd_bottom10 sh_font_color5'>"+data.data.productList[j].title+"</span>"+"</a>"+
                                        "<span class='sh_di_block sh_font_sz28 sh_lingheight_100 sh_pd_bottom10 sh_pd_top10'>"+
                                        "<em class='sh_font_color2 '>￥</em>"+"<em class='sh_font_color2'>"+data.data.productList[j].price+"</em>"+"<em class='sh_font_color2'>起</em>"+
                                        "</span>"+
                                        "<div class='sh_font_sz24 sh_font_color7 sh_lingheight_100'>"+data.data.productList[j].province+data.data.productList[j].city+"</div>"+
                                        "</div>"+
                                        "</div>"+
                                        "</div>";
                                }
                                if(counter1>data.data.totalPage){
                                    // 数据加载完
                                    tab2LoadEnd = true;
                                    // 锁定
                                    me.lock();
                                    // 无数据
                                    me.noData();
                                    break;
                                }
                            }
                            // 为了测试，延迟1秒加载
                            $('.pro_list').eq(1).append(result);
                            // 每次数据加载完，必须重置
                            me.resetload();
                        }else{
                            $('.pro_list').eq(1).html("<img src='http://res.csc86.com/v2/shopping_center/market/demo/index_serch_zero.png' alt='' class='sh_img_max'/>");
                            $(".dropload-down").css("display","none")
                        }
                    },
                    error: function(xhr, type){
                        alert('Ajax error!');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
            }else if(itemIndex == '2'){
                $.ajax({
                    url: "//"+hostmap.pro_list+"/search/product.do?keyWord="+value+"&sort=price-desc&page="+counter1,
                    type:"get",
                    dataType:"jsonp",
                    success:function(data){
                        console.log(data)
                        var result='';
                        counter2++;//默认counter2为1
                        pageEnd2 = num2 * counter2;//pageENd2默认为1*1=1
                        pageStart2 = pageEnd2 - num2;//pagestart2默认为1-1=0
                        if(data.data.productList.length>0&&$.isArray(data.data.productList)){
                            for(var i= pageStart2;i< pageEnd2; i++){
                                for(var j=0,len=data.data.productList.length;j<len; j++){
                                    result +=
                                        "<div class='sh_clear  sh_pd_top30  sh_pd_bottom30 sh_bor_top_1 sh_bg_color_1'>"+
                                        "<div class='sh_width_92 sh_margin_a  sh_clear '>"+
                                        "<div class='sh_width_4 sh_float_l sh_lingheight_100  sh_font_sz0 '>"+
                                        "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+data.data.productList[j].productId+"'  data-href='"+data.data.productList[j].productId+"'>"+"<img src='"+data.data.productList[j].picUrl+"' class='index_ser_list' alt=''/>"+"</a>"+
                                        "</div>"+
                                        "<div class='sh_width_8 sh_float_l sh_wor_space  sh_positon_r sh_font_sz0'>"+
                                        "<a href='http://m.csc86.com/search/product_detail.ftl?productId="+data.data.productList[j].productId+"'  data-href='"+data.data.productList[j].productId+"'>"+"<span class='sh_di_block sh_font_sz32 sh_lingheight_1_5 sh_pd_bottom10 sh_font_color5'>"+data.data.productList[j].title+"</span>"+"</a>"+
                                        "<span class='sh_di_block sh_font_sz28 sh_lingheight_100 sh_pd_bottom10 sh_pd_top10'>"+
                                        "<em class='sh_font_color2 '>￥</em>"+"<em class='sh_font_color2'>"+data.data.productList[j].price+"</em>"+"<em class='sh_font_color2'>起</em>"+
                                        "</span>"+
                                        "<div class='sh_font_sz24 sh_font_color7 sh_lingheight_100'>"+data.data.productList[j].province+data.data.productList[j].city+"</div>"+
                                        "</div>"+
                                        "</div>"+
                                        "</div>";
                                }
                                if(counter2>data.data.totalPage){
                                    // 数据加载完
                                    tab2LoadEnd = true;
                                    // 锁定
                                    me.lock();
                                    // 无数据
                                    me.noData();
                                    break;
                                }
                            }
                            $('.pro_list').eq(2).append(result);
                            // 每次数据加载完，必须重置
                            me.resetload();
                        }else{
                            $('.pro_list').eq(2).html("<img src='http://res.csc86.com/v2/shopping_center/market/demo/index_serch_zero.png' alt='' class='sh_img_max'/>");
                            $(".dropload-down").css("display","none")
                        }
                    },
                    error: function(xhr, type){
                        alert('Ajax error!');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
            }
        }
    });
    var order_by={
        in_data:function(){           //标题栏加载数据
            $("header").find(".tittle").html(value)
        }
    };
    order_by.in_data();
});