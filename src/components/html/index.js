(function(x){
	var android=navigator.userAgent.indexOf('Android')>-1;
	var androidVersion=4;
	var ios=false;
	var highVersion=(function(){
		var agent=navigator.userAgent;
		if(agent.indexOf('Android')>-1){
			androidVersion = parseFloat(agent.slice(agent.indexOf('Android')+8));
		    if(androidVersion>=5){  
				return true;
		    }  
		}
		if(agent.indexOf('iPhone')>-1||agent.indexOf('iPad')>-1){
			ios=true;
			return true
		}
		if(window.config&&window.config.platform=="iOS"){
			ios=true;
			return true;
		}
		return false;
	})();
	var getXHTML=function(url){
		var node=null;
		for(var i=0;i<document.body.children.length;i++){
			if(document.body.children[i].getAttribute('url')==url){
				node=document.body.children[i];
			}
		}
		return node;
	}
	history._state=x.merge({},history.state);
	var loadingPage=location.open=function(url,push,index){
		//网络是否在线
		/*
		var supportNet=(typeof(navigator.onLine)=='boolean');
		if(supportNet&&!navigator.onLine){
			x.trigger(document.body,'xneterror');
			return;
		}
		*/
		var a=document.createElement('a');
		
		a.href=url;
		url=a.href;
		var pathname=a.pathname;
		if(!history.pushState){
			location.href=url;
			return;
		}
		var _xhtml=getXHTML(url);
		if(_xhtml){
			_xhtml.parentNode.removeChild(_xhtml);
		}
		if(push){
			if(url==location.href) return;
			var state={fromUrl:location.href,toUrl:url};
			history._state=state;
			history.pushState(state,"",url);
		}
		var success=function(data){
			document.xhtml.hide(index);
			var html=x.createFragment(data).querySelector('x-html');
			html.setAttribute('url',url);
			document.xhtml=html;
			//html.style.opacity=0.8;
			document.body.appendChild(html);
			html.show();
		}
		if(highVersion){
			success=function(data){
				var html=x.createFragment(data).querySelector('x-html');
        //缺省背景图片
        var placeholder=html.querySelector('.default-placeholder');
        if(placeholder){
          x.addClass(placeholder,'body-placeholder');
          var ajats=placeholder.querySelectorAll('x-ajat');
          if(ajats&&ajats.length>0){
            for(var i=0;i<ajats.length;i++){
              ajats[i].style.display='none';
            }
            x.addEvent(html,'xshow',function(){
              setTimeout(function(){
                x.requestFrame(function(){
                  for(var i=0;i<ajats.length;i++){
                    ajats[i].style.display='';
                  }
                  placeholder&&x.removeClass(placeholder,'body-placeholder');
                  x.trigger(placeholder,'scroll');
                })
              },50);
            });
          }
        }
				html.setAttribute('url',url);
				var prev=document.xhtml;
				document.xhtml=html;
				var cssPropertes={
					width:window.innerWidth+'px',
					position:'absolute',
					top:0,
					left:0,
					transform:'translate3d(100%,0,0)',
					'will-change':'transform',
					display:'none'
				};
				x.addEvent(html,'xhtmlready',function(){
					x.requestFrame(function(){
						if(android){
							this.onxshow=function(){
								prev.hide(index);
							}
							this.show();
						}else{
							prev.hide(index);
							this.show();	
						}
					}.bind(this))
				});
        
				if(index==-1){
					cssPropertes.transform='translate3d(-10%,0,0)';
					x.css(html,cssPropertes);
					document.body.insertBefore(html,document.querySelector('x-html'));
				}else{
					x.css(html,cssPropertes);
					document.body.appendChild(html);
				}
			}
		}		
    x.tools.fetch({
      url:pathname,
      dataType:'text',
      success:success,
      error:function(){
        history.back();
        window.toast({content:'页面加载失败,请重试或者检查网络设置'});
      }
    });
	}
	
	if(history.pushState){
		var i=0;
		window.onpopstate=function(){
			if(i!=0){
				var href=location.href;
				if(href.indexOf('#ui::')>-1||(history._state&&history._state.toUrl&&history._state.toUrl.indexOf('#ui::')>-1)){
					history._state=x.merge({},history.state);
					return;
				}
				var path=href;
				if(history._state&&history._state.fromUrl==path){
					var xhtml=getXHTML(path);
					if(xhtml==document.xhtml) return;
					if(xhtml){
						var hideNode=document.xhtml;
						xhtml.show(-1,history._state.toUrl);
						if(android){
							xhtml.onxshow=function(){
								hideNode.hide(-1);
							}
						}else{
							hideNode.hide(-1);
						}
					}else{
						loadingPage(href,false,-1);
					}
				}else{
					var xhtml=getXHTML(path);
					if(xhtml){
						xhtml.parentNode.removeChild(xhtml);
					}
					loadingPage(href);
				}
				history._state=x.merge({},history.state);
				//隐藏对话框
				var modals=x.toArray(document.querySelectorAll('x-modal'));
				modals.forEach(function(item){
					item.style.display="none";
				});
				//隐藏日期对话框
				var node=document.querySelector('.dwo');
				node&&x.trigger(node,'click')
			}
			i++;
		}
		setTimeout(function(){i++},500)
		if('serviceWorker' in navigator&&!sessionStorage.getItem('sw')){
      x.addEvent(document,'click',function(e){
        var node=/a/i.test(e.target.nodeName)?e.target:x.closest(e.target,'a');
        if(node&&node.getAttribute('href')){
        var href=node.href;
        if(href==location.href){
          e.preventDefault();
          return;
        }
        if(href&&href.indexOf(location.origin)>-1){
          e.preventDefault();
          e.stopPropagation();
          location.open(href,true);
        }
        }
      });
    }
	}
	var resize=function(){
		window.setReqonseFontSize&&window.setReqonseFontSize();
		var width=window.innerWidth;
		var height=window.innerHeight;
		document.body.style.width=width+"px";
		document.body.style.minHeight=height+"px";
		x.query(document.body,'x-html').forEach(function(node){
			x.requestFrame(function(){
				this.style.width=width+"px";
				this.style.minHeight=height+"px";
			}.bind(node));
		});
	}
	x.addEvent(window,'resize',resize);
	x.addEvent(window,'orientationchange',resize);
	x.xhtml.html={
		lifecycle:{
			created:function(){
				var self=this;
				this.styles=[];
				this.styles._index=0;
				this.styles._push=function(){
					this.push.apply(this,arguments);
				}
				this.styles.loading=function(cb){
					self.styles[self.styles._index].loading(function(){
						self.styles._index++;
						if(self.styles[self.styles._index]){
							self.styles.loading.call(self.styles,cb);
						}else{
							cb&&cb();
						}
					})
				}
				this.scripts=[];
				this.scripts._index=0;
				this.scripts._push=function(){
					this.push.apply(this,arguments);
				}
				this.scripts.loading=function(cb){
					self.scripts[self.scripts._index].loading(function(){
						self.scripts._index++;
						if(self.scripts[self.scripts._index]){
							self.scripts.loading.call(self.styles,cb);
						}else{
							cb&&cb();
						}
					});
				}
				this.xtag.index=0;
				!document.xhtml&&(document.xhtml=this);
				var url=this.getAttribute('url');
				!url&&this.setAttribute('url',location.href);
				
			},
			inserted:function(){
				var timer=document.readyState=='loading'?100:50;
				setTimeout(function(){
					if(this.querySelector('x-link')){
						this.styles.loading(function(){
							x.fireEvent(this,'styleloaded');
							if(this.querySelector('x-script')){
								this.scripts.loading(function(){
									this.xtag.readyState='complete';
									x.fireEvent(this,'xhtmlready');
								}.bind(this));
							}else{
								this.xtag.readyState='complete';
									x.fireEvent(this,'xhtmlready');
							}
						}.bind(this));
					}else{
						x.fireEvent(this,'styleloaded');
						if(this.querySelector('x-script')){
							this.scripts.loading(function(){
								this.xtag.readyState='complete';
								x.fireEvent(this,'xhtmlready');
							}.bind(this));	
						}else{
							this.xtag.readyState='complete';
							x.fireEvent(this,'xhtmlready');
						}
					}
				}.bind(this),timer);
				if(this.getAttribute('fastclick')!='none'){
					FastClick&&FastClick.attach(this);
				}
			},
      removed:function(){
        x.trigger(this,'xremoved');
      }
		},
		methods:{
			hide:function(index){
				if(index==-1){
					x.trigger(this,'xdestroy');
					document.body.removeChild(this);
				}else{
					x.requestFrame(function(){
						var scroller=this.querySelector('.scrollbox')||this.querySelector('x-scrollbox');
						if(scroller){
							this.xtag.scrollTop=scroller.scrollTop;
						}
						this.style.cssText='display:none;';
						x.trigger(this,'xhide');
					}.bind(this));
				}
			},
			show:function(index,url){
				if(this.xtag.index==0){
					x.fadeIn(this,200,function(){
						document.xhtml=this;
						x.trigger(this,'xshow');
						index==-1&&x.trigger(this,'xback',{formUrl:url});
						this.setTitle();
					}.bind(this));
				}else{
					x.requestFrame(function(){
						this.style.cssText="";
						document.xhtml=this;
						x.trigger(this,'xshow');
						index==-1&&x.trigger(this,'xback',{formUrl:url});
						this.setTitle();
						var scroller=this.querySelector('.scrollbox')||this.querySelector('x-scrollbox');
						if(this.xtag.scrollTop&&scroller){
							scroller.scrollTop=this.xtag.scrollTop;
						}
					}.bind(this));
				}
				this.xtag.index++;
			},
			setTitle:function(title){
				title&&this.setAttribute('title',title)
				var title=title||this.getAttribute('title');
				if(title){
					x.requestFrame(function(){
						var node=this.querySelector('header h2');
						node&&(node.innerHTML=title);
						document.title=title;
						window.hybrid&&window.hybrid.setTitle({title:title});
					}.bind(this))
				}
			}
		},
		events:{
			'xhtmlready':function(){
				//if(this.style.opacity===0){
					//x.fadeIn(this);
				//}
			}
		}
	}
	if(highVersion){
		x.xhtml.html.methods.show=function(index,url){
			x.requestFrame(function(){
				this.style.display="block";
				x.animate(this,{'transform':'translate3d(0,0,0)','will-change':'transform'},304,'ease',function(){
					document.xhtml=this;
          x.trigger(this,'xshow');
					index==-1&&x.trigger(this,'xback',{fromUrl:url});
					this.setTitle();
					this.style.willChange=this.style.webkitWillChange='';
				}.bind(this));
			}.bind(this))
		}
		x.xhtml.html.methods.hide=function(index){
			var time=304;
			var cssProperts={
				'heihgt':'100vh',
				'width':'100vw',
				'-will-change':'transform',
				'transform':'translate3d(-15%,0,0)'
			};
			if(android){
				cssProperts['transform']='translate3d(0,0,0)';
			}
			if(android&&index!=-1){
				time=0;
			}
			if(index==-1){
				cssProperts['transform']='translate3d(100%,0,0)';
			}
			x.animate(this,cssProperts,time,'ease',function(){
				if(index==-1){
					x.trigger(this,'xdestroy');
					document.body.removeChild(this);
				}else{
					this.style.display='none';
					x.trigger(this,'xhide');
				}
			}.bind(this));
		}
		setTimeout(function(){
			document.body.style.cssText="width:100vw;min-height:"+window.innerHeight+"px;overflow: hidden;position:relative";
		},1000);
	}
	
	x.xhtml.link={
		lifecycle:{
			inserted:function(){
				this.getAttribute('href')&&this.parentNode.styles._push(this);
			}
		},
		methods:{
			loading:function(cb){
				var node=document.createElement('link');
				if((ios||(android&&androidVersion>=5))&&node.onload!==undefined){
					node.onload=cb;
					node.rel="stylesheet";
					node.href=this.getAttribute('href')
					this.appendChild(node);
				}else{
					var css=new Image();
					css.onerror=function(){
						cb&&cb();
						node.href=this.getAttribute('href');
						node.rel="stylesheet";
						this.appendChild(node);
					}.bind(this);
					css.src=this.getAttribute('href');
				}
			}
		}
	}
	x.xhtml.script={
		lifecycle:{
			inserted:function(){
				this.getAttribute('src')&&this.parentNode.scripts._push(this);
			}
		},
		methods:{
			loading:function(cb){
				var node=document.createElement('script');
				node.type="text/javascript";
				cb&&(node.onload=cb);
				node.src=this.getAttribute('src');
				this.appendChild(node);
			}
		}
	}
	document.createElement('x-body');
	x.xhtml.register('x-html',x.xhtml.html); 
	x.xhtml.register('x-script',x.xhtml.script);
	x.xhtml.register('x-link',x.xhtml.link);
})(xtag);