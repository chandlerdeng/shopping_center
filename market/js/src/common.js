/*result +=  '<div class="box" >'+
            	'<a href="javascript:;">'+
        		'<div class="box-l">'+
        				'<img src="images/pactcount_img1.png" >'+
        				'<div class="jl_name">名称</div>'+
        			'</div>'+
        			'<div class="box-r">'+
        				'<div class="jl_name">地址</div>'+
        				'<div class="jl_centent">本月目标本月目标本月目标本月目标本月目标本月目标本月目标本月目标本月目标本月目标本月目标本月目标本月目标本月目标本月目标</div>'+
        				'<div class="jl">距离为：<span>111</span></div>'+
        				//'<li><span>333</span>万</li>'+
        			'</div>'+
        			'<div class="box-d">删除</div>'
        		'</a>'+
        	'</div>';*/
//初始化DropLoad
function initDropLoad(c,upFC,downFC){
	// dropload
    var dropload = $(c).dropload({
                
        loadUpFn : function(me){
        	upFC(me);
        },
        loadDownFn : function(me){
        	downFC(me);
                 
        }
    });
    
    //deleteFC();
    
	return dropload;
}

//下拉方法
function  upFunction(o){
    pageNum.mapPageNum = 1;
    var _dc = {"pageIndex":pageNum.mapPageNum,"pageSize":2};
    acap.rpc.doRequest("approve/getPage", _dc, function(result){
        $("#lists").html("");
        if(result.data.data.length == 0){ //如果没有记录显示暂无记录
            o.noData();
        }else{
            //alert(JSON.stringify(result));
            var html = template("mapList", { "list" :result.data.data});
            // 为了测试，延迟1秒加载
            setTimeout(function(){
                $('#lists').html(html);
                o.resetload(); //刷新
                deletebox(); //绑定左滑动删除事件
                o.fnAutoLoad(); //自动加载
            },1000);

        }
    },{"dropload":o}); //如果有拖拽控件，请传递控件
}

function erroFunction(o){
    setTimeout(function(){
       // alert("请求服务器失败！");
        o.resetload(); //刷新
    },1000);
}

//上拉方法
function downFunction(o){
    var _dc = {"pageIndex":pageNum.mapPageNum,"pageSize":2};
    acap.rpc.doRequest("approve/getPage", _dc, function(result){
        if(result.data.data.length == 0){ //如果没有记录显示暂无记录
            o.noData();
            pageNum.mapPageNum --;
        }else{
            //alert(JSON.stringify(result));
            var html = template("mapList", { "list" :result.data.data});
            // 为了测试，延迟1秒加载
            setTimeout(function(){
                $('#lists').append(html);
                o.resetload(); //刷新
                deletebox(); //绑定左滑动删除事件
                pageNum.mapPageNum ++;
                o.fnAutoLoad(); //自动加载
            },1000);

        }
    },{"dropload":o}); //如果有拖拽控件，请传递控件
}


function deletebox(){
	initSlide('.sl-content','.sl-opts');
    
}

function deleteRow(o){
    if(confirm("确定要删除数据吗?")){
        $(o).parent().parent().remove();
    }
    
}


