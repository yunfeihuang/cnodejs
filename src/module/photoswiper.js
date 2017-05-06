(function(xhtml){
	var $xhtml=$(xhtml);
	var openPhotoSwipe = function(items,index) {
		// build items array
		/*
		var items1 = [
			{
				src: 'https://farm2.staticflickr.com/1043/5186867718_06b2e9e551_b.jpg',
				w: 964,
				h: 1024
			},
			{
				src: 'https://farm7.staticflickr.com/6175/6176698785_7dee72237e_b.jpg',
				w: 1024,
				h: 683
			}
		];*/
		// define options (if needed)
		var options = {
			// history & focus options are disabled on CodePen        
			history: false,
			focus: false,
			showAnimationDuration: 0,
			hideAnimationDuration: 0,
			index:index
		};
		xhtml.querySelector('.pswp').removeAttribute('style');
		var gallery = new PhotoSwipe(xhtml.querySelector('.pswp'), PhotoSwipeUI_Default, items, options);
		gallery.listen('destroy', function() {setTimeout(function(){history.back()},50)});
		gallery.init();
	};
	var data=storage.getJSON('photoswiper');
	$xhtml.on('xhtmlready',function(){
		xtag.tools.loadJS(['/libs/photoswipe/photoswipe.min.js'],function(){
			setTimeout(function(){
				openPhotoSwipe(data.data,data.index||0);
			},300)
		});
	});
})(document.xhtml);