(function(x){
	x.xhtml.toast={
		lifecycle:{
			inserted:function(){
				x.trigger(this,'xready');
			},
			attributeChanged: function(attrName, oldValue, newValue){
				if(attrName=='visible'){
					if(newValue===null||newValue===false){
						this.hide();
					}else{
						this.show();
					}
				}
			}
		},
		accessors:{
			visible:{
				attribute: {},
				set:function(){
					this.show();
				}
			}
		},
		methods:{
			hide:function(){
				x.fadeOut(this,function(){
					this.style.cssText="";
					x.trigger(this,'xhide');
					this.removeOverlay();
					this.getAttribute('destroy')!==null&&this.parentNode&&this.parentNode.removeChild(this);
				});
			},
			show:function(){
				this.style.display='block';
				x.css(this,{
					left:'50%',
					'margin-left':-this.offsetWidth/2+'px',
					'margin-top':-this.offsetHeight/2+'px',
					'margin-bottom':-this.offsetHeight/2+'px'
				});
				x.fadeIn(this);
				var duration=this.getAttribute('duration')||2000;
				if(duration&&duration!='none'){
					this.timer&&clearTimeout(this.timer);
					this.timer=setTimeout(function(){
						this.hide();
					}.bind(this),duration);
				}
				this.getAttribute('overlay')!==null&&this.createOverlay();
			},
			createOverlay:function(){
				this.removeOverlay();
				var overlay=document.createElement('div');
				overlay.className="overlay";
				overlay.style.display="block";
				document.body.appendChild(overlay);
			},
			removeOverlay:function(){
				var overlay=document.body.querySelector('.overlay');
				overlay&&document.body.removeChild(overlay);
			}
		}
	}
	x.xhtml.register('x-toast',x.xhtml.toast);
	window.toast=function(options){
		var _options={destroy:'destroy',align:'bottom'};
		options=x.merge({},_options,options);
		var node=document.createElement('x-toast');
		node.innerHTML=options.content;
		for(var name in options){
			node.setAttribute(name,options[name]);
		}
		document.body.appendChild(node);
		node.show();
		return node;
	}
})(xtag);