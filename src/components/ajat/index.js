(function(x){
	x.xhtml.ajat={
		lifecycle:{
			inserted: function(){
				if(this.getAttribute('action')===null&&this.getAttribute('disabled')===null){
					this.init();
				}
        if(this.getAttribute('hash')!==null){
          x.addEvent(window,'hashchange',function(){
            this.fetch();
          }.bind(this))
        }
				x.trigger(this,'xready');
			},
			attributeChanged: function(attrName, oldValue, newValue){
				if(oldValue&&newValue&&attrName=='action'&&this.getAttribute('disabled')===null){
					//this.init();
				}
				if(attrName=='disabled'&&newValue===null){
					//this.init();
				}
			}
		},
		accessors:{
			action:{
				attribute: {},
				set:function(){
					if(this.getAttribute('disabled')===null){
					if(navigator.userAgent.indexOf('Android')>-1){
					  setTimeout(function(){this.init();}.bind(this),200);
					}else{
					  this.init();
					}
					}
				}
			},
			disabled:{
				attribute: {}
			}
		},
		methods:{
			init:function(){
				this.parseAction();
				var timer=document.readyState=='loading'?100:50;
				setTimeout(function(){
					this.moveTemplate();
					var node=x.closest(this,'x-html');
					if(node&&!node.xtag.readyState){
						x.addEvent(node,'xhtmlready',function(){
							this.fetch();
						}.bind(this))
					}else{
						x.requestFrame(function(){
							this.fetch();
						}.bind(this));
					}
				}.bind(this),timer);
			},
			enable:function(){
				this.removeAttribute('disabled');
			},
			disable:function(){
				this.setAttribute('disabled','disabled');
			},
			getTemplate:function(){
				if(this.template){
					return this.template.innerHTML;
				}else{
					var tempid=this.getAttribute('template');
					if(tempid){
						if(EJS&&/.html/.test(tempid)){
							return new EJS({url:tempid.replace(".html",'')}).text;
						}else{
							return document.getElementById(tempid)?document.getElementById(tempid).innerHTML:"";
						}
					}
				}
			},
			setTemplate:function(template){
				this.template=template;
			},
			parseAction:function(action){
				var action=action||this.getAttribute('action')||'';
				if(action){
					action=x.tools.template.render({text:action},{});
					this.xtag.req={
						url:action.split('?')[0]?action.split('?')[0]:'',
						query:x.tools.parseQuery(action)
					};
				}else{
					this.xtag.req={}
				}
			},
			getUrl:function(){
				return this.xtag.req.url;
			},
			setUrl:function(url){
				url&&(this.xtag.req.url=url);
			},
			getQuery:function(){
				var ret=x.merge({},this.xtag.req.query);
				ret.toString=x.tools.param(ret);
				return ret;
			},
			setQuery:function(object,isFetch){
				this.xtag.req.query=object;
				isFetch&&this.fetch();
			},
			moveTemplate:function(){
				if(!this.template){
					this.template=this.querySelector('script[type="text/template"]');
					if(this.template){
						var node=x.closest(this,'x-html');
						if(node){
							node.appendChild(this.template);
						}else{
							document.body.appendChild(this.template);
						}
					}
				}
			},
			fetch:function(action){
				if(this.xtag.xreadyState===1) return;
				action&&(this.xtag.action=action)&&this.parseAction(action);
				var query=x.merge({},this.xtag.req.query);
				delete query.toString;
				this.xtag.xreadyState=1;
				var url=this.xtag.req.url?this.xtag.req.url:'';
				x.tools.ajax({
					url:url,
					context:this,
					data:query,
					type:this.getAttribute('method')||'get',
					success:function(data){
						this.render(data);
					},
					complete:function(){
						this.xtag.xreadyState=0;
					}
				});
			},
			render:function(data){
				var insert=this.getAttribute('insert');
				var html=x.tools.template.render({text:this.getTemplate()},{data:data,req:this.xtag.req,xhtml:x.closest(this,'x-html')});
				if(insert=='after'||insert=='before'){
					if(this.insertAdjacentHTML){
						this.insertAdjacentHTML(insert=='after'?'beforeend':'beforebegin',html);
					}else{
						var node=document.createElement('div');
						node.innerHTML=html;
						if(node.children.length>0){
							var children=x.toArray(node.children);
							insert=='before'&&children.reverse();
							x.toArray(node.children).forEach(function(item){
								if(insert=='before'){
									this.insertBefore(item,this.firstChild);
								}else{
									this.appendChild(item);
								}
							}.bind(this));
						}
					}
				}else{
					this.innerHTML=html;
				}
			}
		}
	}
	x.xhtml.register('x-ajat',x.xhtml.ajat);
})(xtag);
