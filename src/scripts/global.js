Date.prototype.format = function(format){
	format=format||'yyyy-MM-dd';
	var t = this;
	var o = {
		"M+": t.getMonth() + 1, //month
		"d+": t.getDate(), //day
		"h+": t.getHours(), //hour
		"m+": t.getMinutes(), //minute
		"s+": t.getSeconds(), //second
		"q+": Math.floor((t.getMonth() + 3) / 3), //quarter
		"S": t.getMilliseconds() //millisecond
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (t.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};
EJS.Helpers.prototype.include=function(url,selector,data){
	if(url&&selector){
		var node=xtag.createFragment(new EJS({url:url}).text).querySelector(selector);
		if(node){
			if(data){
				return xtag.tools.template.render({text:node.innerHTML},{data:data});
			}else{
				return node.innerHTML;
			}
		}
	}
}
//格式化金额
EJS.Helpers.prototype.FormatMoney = function(val, dec){
	val = parseFloat(val);
	dec = dec || 2;	//小数位
	if(isNaN(val)){
		return '';
	};
	if(val === 0) {
		return '0.00';
	};
	val = val.toFixed(dec).split('.');
	var reg = /(\d{1,3})(?=(\d{3})+(?:$|\D))/g;
	return val[0].replace(reg, "$1,") + '.' + val[1];
};
// 文本换行转化
EJS.Helpers.prototype.Newlines = function(txt){
	return txt.replace(/\n|\r/g,'<br />');
};
//计算月份的天数
EJS.Helpers.prototype.getMonthDays = function(year,month){
	return 32-new Date(year,month,32).getDate();
};
var storage={
	events:{},
	getJSON:function(key,session){
		var session=session||sessionStorage;
		var value=session.getItem(key)
		return value?JSON.parse(value):null;
	},
	setJSON:function(key,obj,session){
		var session=session||sessionStorage;
		session.setItem(key,JSON.stringify(obj));
		this.trigger(key,obj);
	},
	removeJSON:function(key,session){
		var session=session||sessionStorage;
		var value=session.getItem(key);
		session.removeItem(key);
		value&&this.trigger(key);
	},
	on:function(key,fn){
		if(!this.events[key]){
			this.events[key]=[fn];
		}else{
			this.events[key].push(fn);
		}
		if(arguments.callee&&arguments.callee.caller&&arguments.callee.caller.arguments&&arguments.callee.caller.arguments[0]){
			var node=arguments.callee.caller.arguments[0];
			if(node.nodeName&&/x-html/i.test(node.nodeName)){
				if(!node.xtag.eventkey){
					node.xtag.eventkey=Math.random()*10000000;
					xtag.addEvent(node,'xdestroy',function(e){
						this.destroy(e.target.xtag.eventkey);
					}.bind(this));
				}
				fn.eventkey=node.xtag.eventkey;
			}
		}
	},
	off:function(key,fn){
		if(this.events[key]&&this.events[key].forEach){
			this.events[key].forEach(function(item,i){
				if(item==fn){
					storage.events[key].splice(i,1);
				}
			});
		}
	},
	trigger:function(key,obj){
		if(this.events[key]&&this.events[key].forEach){
			this.events[key].forEach(function(item){
				item&&item(obj);
			});
		}
	},
	destroy:function(eventkey){
		for(var name in this.events){
			if(this.events[name]&&this.events[name].length>0){
				var array=[];
				for(var i=0;i<this.events[name].length;i++){
					if(this.events[name][i].eventkey!=eventkey){
						array.push(this.events[name][i])
					}
				}
				this.events[name]=array;
			}
		}
	}
}
function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

xtag.tools._fetch=function(options){
	var x=xtag;
	//网络是否在线
	/*
	var supportNet=(typeof(navigator.onLine)=='boolean');
	if(supportNet&&!navigator.onLine){
		x.trigger(options.context||document.body,'xneterror');
		return;
	}*/
	if(options.url){
		if(options.url.indexOf('.html')==-1){
			options.dataType='json'
		}else{
			options.dataType='text'
		}
	}
	//触发自定义事件
	if(options.context){
		if(/x-form/i.test(options.context.nodeName)){
			x.trigger(options.context,'xsubmit');
			if(options.context.target){
				var query=x.merge({},tools.parseQuery(location.search.replace(/\?|#/g,'')+location.hash.replace(/\?|#/g,'')),options.data);
				if(options.context.target=='hash'){
					location.hash=tools.param(query);
					return;
				}
				if(/^#/.test(options.context.target)){
					var node=document.getElementById(options.context.target.replace('#',''));
					x.trigger(node,'xquerychange',query);
					return;
				}
			}
			var session=options.context.getAttribute('session');
			if(session&&options.data) {storage.setJSON(session,options.data)}
			if(options.url.indexOf('.html')>-1){
				options.complete&&options.complete.call(options.context);
				options.context&&x.trigger(options.context,'xcomplete');
				options.success&&options.success.call(options.context);
				options.context&&x.trigger(options.context,'xsuccess');
				location.open(options.url,true);
				return;
			}
		}
		if(/x-ajat/i.test(options.context.nodeName)){
			x.trigger(options.context,'xfetch');
		}
	}
	if(options.url){
		options._error=options.error;
		options.error=function(xhr){
			if(xhr.status=="abort") return;
			var msg = "请求失败，请稍后再试!";
			if (xhr.status === "parseerror") msg = "数据响应格式异常!";
			if (xhr.status === "timeout") msg = "请求超时，请稍后再试!";
			if (xhr.status === "offline") msg = "网络异常，请稍后再试!";
			this._error&&this._error.call(this.context);
			this.context&&x.trigger(this.context,'xerror',msg);
		}.bind(options);
		options._success=options.success;
		options.success=function(data,status,xhr){
			if(xhr.status<400){
				if(this.dataType!='text'){
					if(data&&data.success===true){
						this._success&&this._success.call(this.context,data.data);
						this.context&&x.trigger(this.context,'xsuccess',data.data);
						this.context&&/x-ajat/i.test(this.context.nodeName)&&x.trigger(this.context,'xrender',data.data);
					}else if(data&&data.code==302){
						if(this.context){
							this.context.innerHTML='<div class="tc" style="line-height:1rem">'+data.message+'</div>';
						}
						location.href="/index";  
					}else{  
						this._error&&this._error.call(this.context,data);
						this.context&&x.trigger(this.context,'xerror',data);
					}
				}else{
					this._success&&this._success.call(this.context,data);
				} 
			}else{
				if(xhr.status=="abort") return;
				var msg = "请求失败，请稍后再试!";
				if (xhr.status === "parseerror") msg = "数据响应格式异常!";
				if (xhr.status === "timeout") msg = "请求超时，请稍后再试!";
				if (xhr.status === "offline") msg = "网络异常，请稍后再试!";
				this.xerror&&this.xerror.call(this.context);
				this.context&&x.trigger(this.context,'xerror',msg);
			}
			this.complete&&this.complete.call(this.context);
			this.context&&x.trigger(this.context,'xcomplete');
		}.bind(options);
		$.ajax(options);
	}else{
		options.complete&&options.complete.call(options.context);
		options.context&&x.trigger(options.context,'xcomplete');
		options.success&&options.success.call(options.context);
		options.context&&x.trigger(options.context,'xsuccess');
		options.context&&/x-ajat/i.test(options.context.nodeName)&&x.trigger(options.context,'xrender');
	}
}

$(function(){
	if(!config.isApp){//非原生的h5控制：头部导航条
		$(document.body).addClass("web-app-control");
	}
	var accessControl=function(){//权限控制:在元素class加上right--156 156权限ID
		var nodes=this.querySelectorAll('[class*="right--"]');
		for(var i=0;i<nodes.length;i++){
			var node=nodes[i];
			var match=node.className.match(/right--(\d+)/);
			if(match&&match[1]&&config&&config.right.userRight.indexOf(parseInt(match[1]))>-1){
				xtag.requestFrame(function(){
					node.className=node.className.replace(match[0],'');
				}.bind(node));
			}
		}
	}
	$(document.body).on('xsuccess','x-form',function(e){//数据提交成功提示
		if(e.target==this){
			if(this.getAttribute("toast")!=='none'&&this.querySelector('form')&&this.querySelector('form').action){
				window.toast({align:'bottom',destroy:'destroy',content:this.getAttribute("toast")||"提交成功"});
			}
		}
	}).on('xerror','x-form',function(e){//数据提交失败提示
		if(e.target==this){
			if(this.getAttribute("toast")!=='none'){
				window.toast({align:'bottom',destroy:'destroy',content:e.detail&&e.detail.message?e.detail.message:"提交失败"});
			}
		}
	}).on('xfetch','x-ajat',function(e){//显示加载状态样式
		if(e.target==this&&!this.getAttribute('insert')){ 
			$(this).addClass('loading');
		}
	}).on('xcomplete','x-ajat',function(e){//隐藏加载状态样式
		if(e.target==this){
			$(this).removeClass('loading');
		}
		var scrollbox=$(e.target).closest('x-scrollbox');
		if(scrollbox.length==1&&scrollbox.children('.loading')){
			scrollbox[0].stopLoading();
		}
	}).on('xerror','x-ajat',function(e){//数据获取失败提示
		if(e.target==this){
			xtag.requestFrame(function(){
				$(this).removeClass('loading').html('<div class="reload"><a class="js-reload"><i class="iconfont">&#xe94a</i><p>戳我刷新</p></a></div>');
			}.bind(this));
		}
	}).on('click','x-ajat .js-reload',function(e){//ajat组件重试事件
		var ajat=$(e.target).closest('x-ajat')[0];
		ajat.fetch(ajat.xtag.action);
	}).on('xneterror','x-ajat',function(){//网络异常提示
		window.toast({content:"网络异常，请检查网络设置"});
	}).on('xneterror',function(e){
		if(e.target==document.body){
			window.toast({content:"网络异常，请检查网络设置"});
		}
	}).on('xrender','x-ajat',function(){//锚点定位显示
		if(location.hash&&location.hash.indexOf('#ui::')==-1){
			var node=this.querySelector(location.hash);
			if(node){
				var xhtml=xtag.closest(this,'x-html');
				if(xhtml){
					var scrollbox=xhtml.querySelector('x-scrollbox')||xhtml.querySelector('.scrollbox');
					if(scrollbox){
						xtag.skipFrame(function(){
							scrollbox.scrollTop=node.offsetTop;
						});
					}
				}
			}
		}
	}).on('xrender','x-ajat',function(e){//没有数据的提示
		var data=e.detail;
		if(data&&data instanceof Array&&data.length==0&&this.children.length==0){
			this.innerHTML=' <div class="tc" style="line-height:1rem;height:1rem">暂无数据</div>'
		}
	}).on('xhtmlready','x-html',function(){//权限控制
		accessControl.call(this);
	}).on('xrender','x-ajat',function(e){//权限控制
		if(e.target==this){
			accessControl.call(this);
		}
	});
})
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}