var hybird = {
    getQueryString:function(name){
        var _self = this;
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var result = window.location.search.substr(1).match(reg);
        if(result!=null){
          return unescape(result[2]);
        }
        return null;
    },
    include:function(path){
        var _self = this;
        var scriptElement=document.createElement("script");
        scriptElement.type = "text/javascript";
        scriptElement.src=path;
        var head=document.getElementsByTagName("head")[0];
        head.appendChild(scriptElement);
    },
    init: function(){
        var _self = this;
         var queryString = _self.getQueryString("platform");
         if(queryString=='Android'){
             _self.include('/libs/hybrid/cordova/platform/android/cordova.js?t='+config.version);
         }else if(queryString=='iOS'){
             _self.include('/libs/hybrid/cordova/platform/ios/cordova.js?t='+config.version);
         } else {
             
         }
     }
 }

hybird.init();