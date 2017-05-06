(function(x){
	EJS&&(EJS.ext = '.html');
	var tools={
		template:{
			render:function(temp,data){
				var query=tools.parseQuery(location.search);
				query.toString=function(){
					return location.search.replace('?','');
				}
				return new EJS(temp).render(x.merge({},{query:query},data));
			}
		},
		fetch:function(options){
			var _options={headers:{'Access-Control-Allow-Origin':'*'}};
			_options.mode= "no-cors";
			_options.method=options.method||options.type||"GET";
      _options.credentials='include';
			if(options.contentType){
				_options.headers['content-type']=options.contentType;
        if(options.contentType=='application/json'){
          _options.headers['Accept']=options.contentType;
        }
			}
      if(options.data){
        if(_options.headers['content-type']=='application/json'){
          _options.body=JSON.stringify(options.data);
        }else{
		  if(!/GET/i.test(_options.method)){
			  var data = new FormData();
			  for(var name in options.data){
				data.append(name,options.data[name]);
			  }
			_options.body=data;
		  }else{
			  var data = [];
			  for(var name in options.data){
				data.push(name+'='+options.data[name]);
			  }
			  options.url+=(options.url.indexOf('?')==-1?'?':'&')+data.join('&');
		  }
        }
      }
			//触发自定义事件
			if(options.context){
				if(/x-form/i.test(options.context.nodeName)){
					x.trigger(options.context,'xsubmit');
          var form=options.context.querySelector('form');
					if(form&&form.target){
						var query=x.merge({},tools.parseQuery(location.search.replace(/\?|#/g,'')+location.hash.replace(/\?|#/g,'')),options.data);
            delete query.toString;
						if(form.target=='hash'){
							location.hash=tools.param(query);
              options.complete&&options.complete.call(options.context);
							return;
						}else if(/^#/.test(form.target)){
							var node=document.getElementById(form.target.replace('#',''));
							x.trigger(node,'xquerychange',query);
              options.complete&&options.complete.call(options.context);
							return;
						}
					}
				}
				if(/x-ajat/i.test(options.context.nodeName)){
					x.trigger(options.context,'xfetch');
				}
			}
			if(options.url){
				fetch(options.url,_options).then(function(res){
					if(res.ok&&res.status<400){
						this.complete&&this.complete.call(this.context);
						this.context&&x.trigger(this.context,'xcomplete');
						if(this.dataType=='text'){
							return res.text();
						}
						return res.json();
					}
					if(res.status=="abort") return;
					var msg = "请求失败，请稍后再试!";
					if (res.status === "parseerror") msg = "数据响应格式异常!";
					if (res.status === "timeout") msg = "请求超时，请稍后再试!";
					if (res.status === "offline") msg = "网络异常，请稍后再试!";
					this.error&&this.error.call(this.context);
					this.context&&x.trigger(this.context,'xerror');
				}.bind(options)).then(function(body){
					if(body){
						this.success&&this.success.call(this.context,body.data?body.data:body);
						this.context&&x.trigger(this.context,'xsuccess',body.data?body.data:body);
						this.context&&/x-ajat/i.test(this.context.nodeName)&&x.trigger(this.context,'xrender',body.data?body.data:body);
					}
				}.bind(options));
			}else{
				options.complete&&options.complete.call(options.context);
				options.context&&x.trigger(options.context,'xcomplete');
				options.success&&options.success.call(options.context);
				options.context&&x.trigger(options.context,'xsuccess');
				options.context&&/x-ajat/i.test(options.context.nodeName)&&x.trigger(options.context,'xrender');
			}
		},
		ajax:function(options){
			//网络是否在线
			/*
			var supportNet=(typeof(navigator.onLine)=='boolean');
			if(supportNet&&!navigator.onLine){
				options.context&&x.trigger(options.context,'xneterror');
				return;
			}*/
      if(options.url&&options.url.indexOf('https')>-1){
        this._fetch(options);
      }else{
        this.fetch(options);
      }
		},
		parseQuery:function(str){//解析字符串的参数
			var ret = {},reg = /([^?=&]+)=([^&]+)/ig,match;
			var numberReq=/^[0-9.]+$/;
			while (( match = reg.exec(str)) != null) {
				ret[match[1]] = match[2]?(numberReq.test(match[2])?parseFloat(match[2]):decodeURIComponent(match[2])):'';
			}
			ret.toString=function(){
				return str.indexOf('?')>-1?str.split('?')[1]:str;
			}
			return ret;
		},
		param:function(obj){
			var result=[];
			for(var name in obj){
        if(obj[name]!==''){
          result.push(encodeURIComponent(name)+'='+encodeURIComponent(obj[name]));
        }
			}
			return result.join('&');
		},
		validateHooks:{
			email:'^[a-zA-Z0-9_-][\.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$',
			mobile:'^1[0-9]{10}$',
			phone:'^\\d{7,12}$',
			password:'^[0-9A-Za-z]{6,20}$'
		},
		loadJS:function(paths,cb){
			var i=0;
			var callback=function(){
				i++;
				fn();
			}
			var head=document.querySelector('head');
			var fn=function(){
				var path=paths[i];
				if(path){
					if(false&&window.config){
						if(path.indexOf('?')>-1){
							path+="&v="+config.version;
						}else{
							path+="?v="+config.version;
						}
					}
					var dom=head.querySelector('link[href="'+path+'"]');
					if(!dom){
						var node=document.createElement('script');
						node.type="text/javascript";
						node.onload=callback;
						node.src=path;
						head.appendChild(node);
					}else{
						callback();
					}
				}else{
					cb&&cb();
				}
			}
			fn();
		},
		loadCSS:function(paths,cb){
			var i=0;
			var callback=function(){
				i++;
				fn();
			}
			var head=document.querySelector('head');
			var fn=function(){
				var path=paths[i];
				if(path){
					if(window.config){
						if(path.indexOf('?')>-1){
							path+="&v="+config.version;
						}else{
							path+="?v="+config.version;
						}
					}
					var dom=head.querySelector('link[href="'+path+'"]');
					if(!dom){
						var node=document.createElement('link');
						if(node.onload!==undefined){
							node.onload=callback;
							node.rel="stylesheet";
							node.href=path;
							head.appendChild(node);
						}else{
							var css=new Image();
							css.onerror=function(){
								node.href=path;
								node.rel="stylesheet";
								head.appendChild(node);
								callback();
							}.bind(head);
							css.src=callback();
						}
					}else{
						callback();
					}
				}else{
					cb&&cb();
				}
			}
			fn();
		}
	}
	x.tools=tools;
	/**xtag static methods**/
	x._addClass=x.addClass;
	x.addClass=function(node,clas){
		if(node instanceof Array){
			node.forEach(function(item){
				x._addClass(item,clas);
			});
		}else{
			x._addClass(node,clas);
		}
	}
	x._removeClass=x.removeClass;
	x.removeClass=function(node,clas){
		if(node instanceof Array){
			node.forEach(function(item){
				x._removeClass(item,clas);
			});
		}else{
			x._removeClass(node,clas);
		}
	}
	x.activeClass=function(node,clas){
		x.removeClass(x.toArray(node.parentNode.children),clas);
		x.addClass(node,clas);
	}
	x._toggleClass=x.toggleClass;
	x.toggleClass=function(node,clas){
		if(node instanceof Array){
			node.forEach(function(item){
				x._toggleClass(item,clas);
			});
		}else{
			x._toggleClass(node,clas);
		}
	}
	x.hasClass=function(node,clas){
		return x.matchSelector(node,'.'+clas);
	}
	x.getParameter=function(node){
		var result={};
		x.queryChildren(node,'param').forEach(function(item){
			var value=item.value;
			item.value==='false'&&(value=false);
			item.value==='true'&&(value=true);
			isNaN(item.value)===false&&(value=parseFloat(value));
			item.name&&(result[item.name]=value);
		});
		return result;
	}
	x.index=function(node){
		var index=0;
		x.toArray(node.parentNode.children).forEach(function(item,i){
			if(item==node){
				index=i;
			}
		});
		return index;
	}
	x.trigger=function(node,eventName,data){
		if(node instanceof Array==false){
			node=[node];
		}
		node.forEach(function(item){
			if(eventName&&eventName.indexOf('x')==0){
				var event=item.getAttribute('on'+eventName);
				event&&(new Function(event).call(item,{detail:data}));
				item['on'+eventName]&&item['on'+eventName]();
			}
			x.fireEvent(item,eventName,{detail:data});
		});
	}
	x.closest=function(node,selector,context){
		while (node && !x.matchSelector(node, selector)){
			node = node !== context && node !== document && node.parentNode
			if(node==document){
        node=null;
				break;
			}
		}	
		return node
	}
	x.css=function(node,properties,isFrame){
		var supportedPrefix = /^(transform|animation|transition|border|box-shadow)/i;
		var style=node.style.cssText,_properties={};
		if(style){
			style.split(';').forEach(function(value){
				var keys=value.split(':');
				keys[0]&&(_properties[keys[0]]=keys[1]);
			});
		}
		for(var key in properties){
			supportedPrefix.test(key)&&(properties[x.prefix.css+key]=properties[key]);
		}
		x.merge(_properties,properties);
		var array=[]
		for(var key in _properties){
			key&&_properties[key]!==undefined&&array.push(key+':'+_properties[key]);
		}
		if(!isFrame){
			node.style.cssText=array.join(';');
		}else{
			x.requestFrame(function(){
				this.style.cssText=array.join(';');	
			}.bind(node));
		}
	}
	x.fadeIn=function(node,duration,cb){
		if(!node||!node.nodeName)return;
		var properties={opacity:0};
		if(node&&window.getComputedStyle(node)['display']=='none'){
			properties.display='block';
		}
		if(!duration){
			duration=250;
		}else if(typeof duration=='function'){
			cb=duration;
			duration=250;
		}
		x.css(node,properties);
		x.animate(node,{opacity:1},duration,'ease-out',cb);
	}
	x.fadeOut=function(node,duration,cb){
		if(!node||!node.nodeName)return;
		if(!duration){
			duration=250;
		}else if(typeof duration=='function'){
			cb=duration;
			duration=250;
		}
		node.style.opacity='1';
		x.animate(node,{opacity:0},duration,'ease-out',function(){
			node.style.display='none';	
			cb&&cb.call(node);
		});	
	}
	x.slideDown=function(node,duration,cb){
		if(!duration){
			duration=200;
		}else if(typeof duration=='function'){
			cb=duration;
			duration=200;
		}
		x.css(node,{visibility:'hidden',position:'absolute',display:'block'});
		var sHeight=window.getComputedStyle(node)['height'];
		x.css(node,{visibility:'visible',position:'static',height:'0px',display:'block',overflow:'hidden'});
		x.animate(node,{height:sHeight},duration,'ease-out',function(){
			this.style.cssText='display:block';
			cb&&cb();
		});
	}
	x.slideUp=function(node,duration,cb){
		if(!duration){
			duration=200;
		}else if(typeof duration=='function'){
			cb=duration;
			duration=200;
		}
		x.css(node,{height:window.getComputedStyle(node)['height'],overflow:'hidden'});
		x.animate(node,{height:0},duration,'ease-out',function(){
			this.style.cssText='display:none';
			cb&&cb();
		});
	}
	x.offset=function(node){
		var left = 0, top = 0;
		while (node != null) {
			left += node.offsetLeft-parseFloat(window.getComputedStyle(node)['margin-left']||0);
			top +=node.offsetTop-parseFloat(window.getComputedStyle(node)['margin-top']||0);
			node = node.offsetParent;
		}
		return { left: left, top: top };
	}
	x.animate=function(node,properties,duration,ease,cb){
		var transforms,prefix=x.prefix.css, cssProperties = {},eventCallBack;supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
		if(typeof ease=='function'){
			cb=ease;
			ease='';
		}
		 if (typeof properties == 'string') {
			  // keyframe animation
			  cssProperties[prefix + 'animation-name'] = properties
			  cssProperties[prefix + 'animation-duration'] = duration + 'ms'
		} else {
			for (key in properties){
				if (supportedTransforms.test(key)) {
				  transforms || (transforms = [])
				  transforms.push(key + '(' + properties[key] + ')')
				}else{
					cssProperties[key] = properties[key];
				} 
			}
			if (transforms) cssProperties[prefix + 'transform'] = transforms.join(' ')
			if (typeof properties === 'object') {
				cssProperties[prefix + 'transition-property'] = Object.keys(properties).join(',')
				cssProperties[prefix + 'transition-duration'] = duration + 'ms'
				cssProperties[prefix + 'transition-timing-function'] = (ease || 'linear')
			}
		}
		x.css(node,cssProperties,true);
		setTimeout(function(){
			node.style['transition']=node.style[x.prefix.lowercase+'Transition']=node.style['animation']=node.style[x.prefix.lowercase+'Animation']='';
			cb&&cb.call(node);
		},duration+50);
	}
	x.addEvent(document,'WebComponentsReady',function(e){
		x.componentsReadyMarker=true;
	});
	x.componentsReady=function(cb){
		if(!x.componentsReadyMarker){
			x.addEvent(document,'WebComponentsReady',function(e){
				cb&&cb();
			});
		}else{
			cb&&cb();
		}
	}
	/**custom tag**/
	x.xhtml={
		extend:function(xhtml){
			x.merge(this,xhtml);
		},
		register:function(name,xhtml){
			x.register(name,x.merge({},x.clone(this.base),xhtml));
		}
	}
	var polyfill=function(cb){
		var arr=[];
		if(!window.Promise){
			arr.push('/libs/es6/promise-0.1.1.min.js');
		}
		if(!window.fetch){
			arr.push('/libs/es6/fetch.min.js');
		}
		if(arr.length==0){
			cb&&cb();
		}else{
			tools.loadJS(arr,cb);
		}
		cb&&cb();
	}
	//xready事件封装
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', function () {
			polyfill(function(){
				x.fireEvent(document,'domready');	
			});
		}, false);
	}else if (document.attachEvent) {
		document.attachEvent('onreadytstatechange', function () {
			if (document.readyState == "complete") {
				polyfill(function(){
					x.fireEvent(document,'domready');	
				});
			}
		});
	}else if (document.lastChild == document.body) {
		polyfill(function(){
			x.fireEvent(document,'domready');	
		});
	}
	
	window.setReqonseFontSize=function(){ 
		var deviceWidth = document.documentElement.clientWidth;
		var devicePixelRatio=window.devicePixelRatio||window.webkitDevicePixelRatio||window.mozDevicePixelRatio;
		var calc=7.5;
		if(deviceWidth > 414) deviceWidth = 414;
		if(deviceWidth < 320) deviceWidth = 320;
		document.documentElement.style.fontSize = Math.ceil(deviceWidth /7.5) + 'px';	//计算设计稿和实际像素的缩放比。向上取整1px = 0.01rem 
	}
	window.setReqonseFontSize();
	
})(xtag);
