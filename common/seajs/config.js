seajs.config({
	// Sea.js 的基础路径
	base: '//res.csc86.com/v2/shopping_center',
	// 别名配置
	alias: {
		'zepto': 'common/js/l/zepto/zepto.min.js',
		'jq': 'common/js/l/jq/jquery-3.0.0.min.js',
		'swiper': 'common/js/l/swiper/js/swiper.min.js',
		'picLazyLoad':'common/js/l/picLazyLoad/zepto.picLazyLoad.min.js',
		'dropload':'common/js/l/dropload/js/dropload.min.js',
		'debug':'common/js/l/debug/debug.min.js',
		'fastclick':'common/js/l/fastclick/fastclick.js'
	},
	// 路径配置
	paths: {
	},
	// 映射
	map: [
		['f=','../f='],
		[ /^(.*(\/js\/tpl|\/js\/src|\/market\/css)\/.*\.(?:css|js))(?:.*)$/i, '$1?2016082504' ]
	],
	// 调试模式
	debug: false
});

//域名配置
seajs.hostmap={
	'pro_list':'m.csc86.com'//产品列表页面接口地址
};