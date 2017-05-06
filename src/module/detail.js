(function(xhtml){
  var $xhtml=$(xhtml);
  $xhtml.on('click','.topic-detail-content',function(e){
    if(/img/i.test(e.target.nodeName)){
      var width=window.innerWidth;
      var imgs=this.querySelectorAll('img');
      var data={data:[]};
      for(var i=0;i<imgs.length;i++){
        var img=imgs[i];
        if(img.src){
          if(img.src==e.target.src){
            data.index=i;
          }
          data.data.push({src:img.src,w:width,h:width*(img.height/img.width)});
        }
      }
      storage.setJSON('photoswiper',data);
      location.open('/src/module/photoswiper.html',true);
    }
  })
})(document.xhtml);