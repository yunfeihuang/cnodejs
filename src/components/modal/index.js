(function(x){
	var template='<x-overlay></x-overlay><div class="modal-table"><div class="modal-table-cell modal-<%=data.type%>"><%if(data.type=="scroll"){%><div class="modal-scroll-inner"><div class="flex-box modal-scroll-header line-bottom"><div class="flex-item modal-scroll-title"><%=data.title?data.title:"请选择"%></div><a class="modal-define"><%=data.definetext?data.definetext:"确定"%></a></div><x-scrollbox class="modal-scroll-area"><x-scroll><%=data.content%></x-scroll><div class="modal-scroll-opacity"></div><div class="modal-scroll-marking"></div></x-scrollbox></div><%}else if(data.type!="custom"){%><div class="modal-inner"><%if(data.type=="alert"){%><div class="modal-alert-title modal-content"><%=data.content%></div><div class="modal-footer"><a class="modal-define btn-touch"><%=data.definetext?data.definetext:"确定"%></a></div><%}%><%if(data.type=="confirm"){%><div class="modal-alert-title modal-content"><%=data.content%></div><div class="modal-footer table-box"><a class="modal-cancel table-item btn-touch"><%=data.canceltext?data.canceltext:"取消"%></a><a class="modal-define table-item btn-touch"><%=data.definetext?data.definetext:"确定"%></a></div><%}%><%if(data.type=="form"){%><x-form class="modal-content modal-xform"><%=data.content%></x-form><div class="modal-footer table-box"><a class="modal-cancel table-item btn-touch"><%=data.canceltext?data.canceltext:"取消"%></a><a class="modal-submit table-item btn-touch"><%=data.definetext?data.definetext:"确定"%></a></div><%}%><%if(data.type=="menu"||data.type=="sheet"){%><%=data.content%><%}%></div><%if(data.type=="sheet"){%><div class="modal-sheet-cancel"><a class="btn-touch modal-cancel"><%=data.canceltext?data.canceltext:"取消"%></a></div><%}%><%}else{%><%=data.content%><%}%></div></div>';
	x.xhtml.modal={
		lifecycle:{
			inserted: function(){
				var data={};
				data.type=this.getAttribute('type');
				x.addClass(x.query(this,'x-modal-item'),'line-bottom');
				data.content=this.innerHTML;
				data.definetext=this.getAttribute('definetext');
				data.canceltext=this.getAttribute('canceltext');
				data.title=this.getAttribute('title');
				data.type=="sheet"&&!this.getAttribute('align')&&this.setAttribute('align','bottom');
				data.type && this.render(data);
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
				if(attrName=='canceltext'){
					var node=this.querySelector('.modal-cancel');
					node&&(node.innerHTML=newValue);
				}
				if(attrName=='definetext'){
					var node=this.querySelector('.modal-define');
					node&&(node.innerHTML=newValue);
				}
				if(attrName=='title'){
					var node=this.querySelector('.modal-scroll-title');
					node&&(node.innerHTML=newValue);
				}
			}
		},
		accessors:{
			overlay:{
				attribute: {
					selector:'img'
				},
				get: function(){
					
				},
				set: function(){
					
				}
			},
			visible:{
				attribute: {},
				set:function(){
					this.show();
				}
			}
		},
		methods:{
			animate:function(name,cb){
				var node=this.querySelector('.modal-table');
				if(node){
					this.style.display="block";
					var overlay=this.querySelector('x-overlay');
					if(name=='fadeIn'){
						x.fadeIn(overlay);
						x.fadeIn(this.querySelector('modal-table'),cb);
					}else if(name=='fadeOut'){
						x.fadeOut(overlay,300);
						x.fadeOut(node,300,function(){
							this.parentNode.style.display="none";
							this.style.cssText="";
							cb&&cb.apply(this.parentNode);
						});
					}else if(name=='scaleIn'){
						x.css(node,{transform:'scale(1.5)'});
						x.fadeIn(overlay,300,cb);
						x.animate(node,{transform:'none'},300,'ease-out');
					}else if(name=='scaleOut'){
						x.fadeOut(overlay,300);
						x.fadeOut(node,300,function(){
							this.parentNode.style.display="none";
							this.style.cssText="";
							cb&&cb.apply(this.parentNode);
						});
					}else if(name=="bottomIn"){
						x.css(node,{transform:'translateY(100%)'});
						x.fadeIn(overlay,300,cb);
						x.animate(node,{transform:'none'},300,'ease-out');
					}else if(name=="bottomOut"){
						x.fadeOut(overlay,300);
						x.animate(node,{transform:'translateY(100%)'},300,'ease-out',function(){
							this.parentNode.style.display="none";
							cb&&cb.apply(this.parentNode);
						});
					}
				}
			},
			getAnimateName:function(){
				var type=this.getAttribute('type');
				var animation=this.getAttribute('animation');
				var ret=animation?animation:"scale";
				if(type=='menu'||type=='form'){
					ret='fade';
				}else if(type=='sheet'||type=='scroll'){
					ret="bottom";
				}
				return ret;
			},
			hide:function(cb){
				location.href.indexOf('#ui::modal')>-1&&history.back();
				this.animate(this.getAnimateName()+'Out',function(){x.trigger(this,'xhide');cb&&cb();this.getAttribute('destroy')!==null&&this.parentNode&&this.parentNode.removeChild(this)});
			},
			show:function(){
				var state={fromUrl:location.href,toUrl:location.href.split("#")[0]+"#ui::modal"};
				history._state=state;
				history.pushState(state,'',state.toUrl);
				var event=x.addEvent(window,'popstate',function(){
					x.removeEvent(window,event);
					this.hide();
				}.bind(this))
				this.animate(this.getAnimateName()+'In',function(){
					x.trigger(this,'xshow');
					var node=this.querySelector('x-scroll');
					if(node){
						var top=parseFloat(window.getComputedStyle(node)['padding-top']);
						x.query(this,'x-scrollbox').forEach(function(node){
							if(node.iscroll){
								node.iscroll.refresh();
								var selected=node.querySelector('x-scroll-item[selected]');
								if(!selected){
									selected=node.querySelector('x-scroll-item');
									selected&&node.querySelector('x-scroll-item').setAttribute('selected','selected');
								}
								node.iscroll._translate(0,-(selected.offsetTop-top));
							}
						});
					}
				});
				this.xtag.timeStamp=new Date().getTime();
			},
			render:function(data){
				this.innerHTML=x.tools.template.render({text:template},{data:data});
			},
			html:function(str){
				var type=this.getAttribute('type');
				if(type=="alert"||type=='confirm'){
					this.querySelector('.modal-content').innerHTML=str;
				}else if(type=='custom'){
					this.querySelector('.modal-table-cell').innerHTML=str;
				}else{
					this.querySelector('.modal-inner').innerHTML=str;
				}
			}
		},
		events:{
			'click:delegate(.modal-define)':function(e){
				var modal=x.closest(this,'x-modal');
				modal.hide();
				x.trigger(modal,'xdefine');
			},
			'click:delegate(.modal-cancel)':function(){
				var modal=x.closest(this,'x-modal');
				modal.hide();
				x.trigger(modal,'xcancel');
			},
			'click:delegate(x-modal-item)':function(e){
				var modal=x.closest(this,'x-modal');
				modal.hide();
				x.trigger(e.target,'xselect');
			},
			'click:delegate(x-overlay)':function(e){
				var modal=x.closest(this,'x-modal');
				var timeStamp=new Date().getTime();
				if(timeStamp-modal.xtag.timeStamp>500){//兼容处理
					if(modal.getAttribute('required')=='false'){
						modal.hide();
					}
				}
			},
			'click:delegate(.modal-submit)':function(){
				var modal=x.closest(this,'x-modal');
				x.trigger(x.query(modal,'form'),'submit');
			},
			'xscrollend:delegate(x-scrollbox.modal-scroll-area)':function(e){
				var height=this.querySelector('x-scroll-item').offsetHeight;
				var iscroll=this.xtag.iscroll;
				var y=-(Math.round(Math.abs(iscroll.y)/height)*height);
				if(y!=iscroll.y){
					iscroll._transitionTime(200);
					iscroll._translate(0, y);
				}
				var itemIndex=Math.abs(iscroll.y/height);
				if(iscroll.itemIndex!=itemIndex){
					iscroll.itemIndex=itemIndex;
					x.query(this,'x-scroll-item').forEach(function(item,i){
						if(i==itemIndex){
							item.setAttribute('selected','selected')
						}else{
							item.removeAttribute('selected');	
						}
					});
				}
				x.trigger(this,'xselect');
			},
			'touchmove:delegate(x-overlay)':function(e){
				e.preventDefault();
			}
		}
	}
	x.xhtml.register('x-modal',x.xhtml.modal);
	window.modal=function(options){
		var _options={destroy:'destroy'};
		options=x.merge({},_options,options);
		var node=document.createElement('x-modal');
		node.innerHTML=options.content;
		for(var name in options){
			node.setAttribute(name,options[name]);
		}
		return node;
	}
})(xtag);