/*TMODJS:{"version":1,"md5":"873ea2b72ea1eba4a5c645cc32b80de8"}*/
define(function(require){return require("../template")("public/index-mdh",function(a){"use strict";var b=this,c=(b.$helpers,b.$each),d=a.data,e=(a.value,a.index,b.$escape),f="";return f+='<div class="jstj mdh"> <h2 class="tjtit g-cf"><a href="#" class="g-cf"><span class="g-fl tjtitxt">\u540d\u5e97\u6c47</span><span class="g-fr"><i class="moreLink"></i></span></a></h2> <div class="flr-bd"> <div id="scrollmdh" class="swiper-container swiper-container-horizontal"> <ul class="g-cf pro-mdh swiper-wrapper"> ',c(d,function(a){f+=' <li class="swiper-slide"> <div class="mdhitem"> <a data-href="index=',f+=e(a.cateId),f+='" class="item bfl"><img src="/v2/app/market/images/mdh/',f+=e(a.cateId),f+='-1.png" alt=""></a> <div class="bfr"> <a data-href="index=',f+=e(a.cateId),f+='" class="item rt"><img src="/v2/app/market/images/mdh/',f+=e(a.cateId),f+='-2.png" alt=""></a> <a data-href="index=',f+=e(a.cateId),f+='" class="item rb"><img src="/v2/app/market/images/mdh/',f+=e(a.cateId),f+='-3.png" alt=""></a> </div> </div> <p class="mdhtitle">',f+=e(a.cateLabel),f+="</p> </li> "}),f+=" </ul> </div> </div> </div> ",new String(f)})});