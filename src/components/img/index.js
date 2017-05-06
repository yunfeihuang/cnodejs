(function(x){
	x.xhtml.img={
		lifecycle:{
			created: function(){
				if(!this.querySelector('img')){
					this.innerHTML='<img/>'
				}
				if(!x.xhtml.lazyLoadImage){
					x.xhtml.lazyLoadImage=[];
					x.addEvent(window,'scroll',function(){
						var spliceArray=[];
						x.xhtml.lazyLoadImage.forEach(function(node,i){
							if(!node.loaded&&node.inViewPort()){
								node.loadImage();
								node.loaded=true;
							}
						});
						x.xhtml.lazyLoadTimer&&clearTimeout(x.xhtml.lazyLoadTimer);
						x.xhtml.lazyLoadTimer=setTimeout(function(){
							x.xhtml.lazyLoadImage.forEach(function(node,i){
								node.loaded&&x.xhtml.lazyLoadImage.splice(i,1);
							});
						},100);
					});
				}
			},
			inserted:function(){
				if(this.getAttribute('srcset')){
					//x.xhtml.picturefill();
				}
			}
		},
		accessors:{
			lazyload:{
				attribute:{
					boolean:true
				},
				set:function(){
					if(this.getAttribute('src')||this.getAttribute('srcset')){
						if(this.inViewPort()){
							this.loadImage();
						}else{
							x.xhtml.lazyLoadImage.push(this);
						}
					}else{
						x.fadeIn(this.querySelector('img'));
					}
				}
			},
			alt:{
				attribute:{
					selector:'img'
				}
			},
			srcset:{
				attribute:{},
				set:function(value){
					this.getAttribute('lazyload')===null&&this.querySelector('img').setAttribute('srcset',value);
				}
			}
		},
		methods:{
			inViewPort:function(){
				if(this.offsetWidth==0&&this.offsetHeight==0){return false;}
				var rect = this.getBoundingClientRect();
				return (rect.top>= 0&& rect.left>= 0&& rect.top <= (window.innerHeight || document.documentElement.clientHeight))
			},
			loadImage:function(){
				var srcset=this.getAttribute('srcset');
				var img=this.querySelector('img');
				var src = this.getAttribute('src');
				img.onload=function(){
					x.removeClass(this.parentNode,'placeholder');
					x.fadeIn(this);
				}
				srcset&&img.setAttribute('srcset',srcset)&&window.picturefill&&window.picturefill({elements:[img]});
				src&&(img.src = src);
			}
		}
	}
	x.xhtml.register('x-img',x.xhtml.img);
})(xtag);