(function(x){
	x.xhtml.tabbox={
		lifecycle:{
			created:function(){
				this.createBaseLine();
			},
			inserted: function(){
				this.init();
				x.trigger(this,'xready');
				x.addEvent(window,'resize',function(){
					var active=this.querySelector('x-tab-item.active');
					active&&this.setBaseLineStyle(active);
				}.bind(this));
				x.addEvent(window,'orientationchange',function(){
					var active=this.querySelector('x-tab-item.active');
					active&&this.setBaseLineStyle(active);
				}.bind(this));
			},
			attributeChanged: function(attrName, oldValue, newValue){
				attrName=='active'&&this.slideTo(newValue,true);
			}
		},
		methods:{
			slideTo:function(index,slide){
				if(this.xtag.index!=index){
					var item=x.queryChildren(this,'x-tab-item')[index];
					if(x.hasClass(item,'active')) return;
					var slidebox=this.getSlideBox();
					if(slide&&slidebox.xtag){
						slidebox.xtag.trigger='tabbox';
						slidebox && slidebox.xtag&&slidebox.xtag.swiper&&slidebox.xtag.swiper._slideTo && slidebox.xtag.swiper._slideTo(index);
						slidebox.xtag.trigger='none';
					}
					this.setBaseLineStyle(item);
					x.trigger(this,'xchange',index);
				}
			},
			init:function(){
				if(document.readyState!='loading'){
					setTimeout(function(){
						!this.getAttribute('active')&&this.slideTo(this.getAttribute('active')||0,true);
					}.bind(this),200)
				}else{
					!this.getAttribute('active')&&this.slideTo(this.getAttribute('active')||0,true);
				}
			},
			createBaseLine:function(){
				this.baseline=document.createElement('div');
				this.baseline.className="x-tab-baseline";
				this.appendChild(this.baseline);
			},
			setBaseLineStyle:function(item){
				var properties={width:item.offsetWidth+'px',left:item.offsetLeft+'px'};
				if(this.getAttribute('vertical')!==null){
					properties={top:item.offsetTop+'px',height:item.offsetHeight+'px'}
				}
				var active=this.querySelector('x-tab-item.active');
				active&&x.removeClass(active,'active');
				x.addClass(item,'active')
				x.animate(this.baseline,properties,200,'ease');
			},
			getSlideBox:function(){
				var slidebox=this.getAttribute('slidebox');
				return slidebox?document.getElementById(slidebox):"";
			}
		},
		events:{
			'click:delegate(x-tab-item)':function(){
				this.parentNode.setAttribute('active',x.index(this));
			},
			'xchange':function(e){
				//console.log(e);
			}
		},
		accessors:{
			active:{
				attribute: {},
				set:function(value){
					this.slideTo(value,true)
				}
			}
		}
	}
	x.xhtml.register('x-tabbox',x.xhtml.tabbox);
})(xtag);
