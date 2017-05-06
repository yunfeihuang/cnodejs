(function(){
	var parseQuery=function(str){
		var ret = {},reg = /([^?=&]+)=([^&]+)/ig,match;
		while (( match = reg.exec(str)) != null) {
			ret[match[1]] = match[2]?decodeURIComponent(match[2]):"";
		}
		return ret;
	}
	var loadJS=function(paths,cb){
		var i=0;
		var callback=function(){
			i++;
			fn();
		}
		var head=document.querySelector('head');
		var fn=function(){
			if(paths[i]){
				var dom=head.querySelector('link[href="'+paths[i]+'"]');
				if(!dom){
					var node=document.createElement('script');
					node.src=paths[i];
					node.type="text/javascript";
					node.onload=callback;
					node.src=paths[i];
					head.appendChild(node);
				}else{
					callback();
				}
			}else{
				cb&&cb();
			}
		}
		fn();
	}
	var query=parseQuery(location.search);
	
	var config={
		version:'20160817',
		isApp:(query.platform == 'Android' || query.platform == 'iOS'),
		platform:query.platform,
		accessToken:query.access_token,
		nodeCode:query.nodeCode
	}
	
	window.config=config;
	var loadHybrid=function(){
		if(config.isApp){
			window.SYSTEM={ACCESSTOKEN:config.accessToken};
			var cordova="http://res.dinghuo123.com/app/hybrid/cordova-dist/platform/"+query.platform.toLowerCase()+"/cordova.js";
			loadJS([cordova,'http://res.dinghuo123.com/app/hybrid/cordova-dist/HybridBase.js'],function(){
				//alert(window.hybrid)
			})
		}
	}
	loadHybrid();
})()