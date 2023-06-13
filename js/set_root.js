;(function(){
	var calc = function(){
		var docElement = document.documentElement;
		var clientWidthValue = docElement.clientWidth > 750 ? 750 : docElement.clientWidth;
		docElement.style.fontSize = 20*(clientWidthValue/375) + 'px';
		// 可使窗口的宽度大于等于750 html的font-size就是40 小于750大于等于375 大小是[20,40)之间 小于375那就font-size是小于20了
	}
	calc();
	window.addEventListener('resize',calc);
})();