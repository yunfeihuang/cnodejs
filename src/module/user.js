(function(xhtml){
  var $xhtml=$(xhtml);
  var header=xhtml.querySelector('header');
  xhtml.querySelector('.scrollbox').onscroll=function(){
    xtag.requestFrame(function(){
      header.className=this.scrollTop>0?"":"noshadow";
    }.bind(this))
  }
})(document.xhtml);