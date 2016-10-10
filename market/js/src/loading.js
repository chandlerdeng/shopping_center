/**
 * Created by Administrator on 2016/9/13.
 */
/**
 * Created by Administrator on 2016/8/24.
 */
define(function(require, exports, module) {
    var loading={
        m_change:function(){  //加载中点不停动
            var  point = 1;
            setInterval(function(){
                var tmp = '';
                for(j=0;j<point;j++)
                {
                    tmp += '.';
                }
                $(".loading_p").html(tmp);
                point++;
                if(point>5) point=1;
            },200);
        }
    }
    module.exports = loading;
});