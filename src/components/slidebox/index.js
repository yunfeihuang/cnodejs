(function(x){
	document.createElement('x-slide');
	document.createElement('x-slide-item');
	document.createElement('x-slide-content');
	x.xhtml.slidebox={
		lifecycle:{
			inserted: function(){
				this.init();
				x.tools.loadCSS(['/app//libs/swiper/swiper.min.css']);
				x.tools.loadJS(['/app//libs/swiper/swiper.min.js'],function(){
					x.requestFrame(function(){
						this.instance();
						x.trigger(this,'xready');
					}.bind(this))
				}.bind(this));
			},
			attributeChanged: function(attrName, oldValue, newValue){
				attrName=='active'&&this.slideTo(newValue);
			},
			removed:function(){
				this.xtag.swiper&&this.xtag.swiper.destroy&&this.xtag.swiper.destroy();
			}
		},
		methods:{
			options:{},
			init:function(){
				var pagination=this.querySelector('.slidebox-pagination');
				x.requestFrame(function(){
					x.addClass(this,'swiper-container');
					x.addClass(x.query(this,'x-slide-item'),'swiper-slide');
					x.addClass(this.querySelector('x-slide'),'swiper-wrapper');
					this.updatePagination(1);
				}.bind(this));
			},
			instance:function(){
				var options={
					onSlideChangeStart:function(swiper){
						x.trigger(this,'xchange',swiper.activeIndex);
						if(this.xtag.trigger!="tabbox"){
							var node=this.getTabbox();
							node&&node.setAttribute('active',swiper.activeIndex);
						}
						this.updatePagination(swiper.activeIndex+1);
					}.bind(this),
					onSlideChangeEnd:function(swiper){
						x.trigger(this,'xchangeend');
						this.autoHeight(swiper.activeIndex);
					}.bind(this),
					onTouchStart:function(){
						x.trigger(this,'xtouchstart');
					}.bind(this),
					onTouchEnd:function(){
						x.trigger(this,'xtouchend');
					}.bind(this)
				}
				options=x.merge(options,x.getParameter(this));
				options.initialSlide=this.getAttribute('active')||0;
				this.xtag.swiper = new Swiper(this,options);
			},
			updatePagination:function(index){
				var pagination=this.querySelector('.slidebox-pagination');
				var items=x.query(this,'x-slide-item');
				pagination&&(pagination.innerHTML=index+'/'+items.length);
			},
			slideTo:function(index){
				if(this.xtag.swiper&&index!=this.xtag.swiper.activeIndex){
					this.xtag.swiper.slideTo.apply(this.xtag.swiper,arguments);
					x.trigger(this,'xchange',index);
				}
			},
			autoHeight:function(index){
				if(this.getAttribute('autoheight')!==null){
					this.style.height=this.querySelectorAll('x-slide-content')[index].offsetHeight+"px";
				}
			},
			getTabbox:function(index){
				return document.getElementById(this.getAttribute('tabbox'));
			}
		},
		events:{
			'touchmove':function(e){
				//e.preventDefault();
			}
		},
		accessors:{
			active:{
				attribute: {},
				set:function(value){
					this.slideTo(value)
				}
			}
		}
	}
	x.xhtml.register('x-slidebox',x.xhtml.slidebox); 
})(xtag);