(function(x){
	document.createElement('x-attachment-item');
	var template='<%data.forEach(function(item){%><x-attachment-item><span class="remove"><i class="iconfont">&#xe957</i></span><img data-src="<%=img_src(item.fileName)%>" src="<%=img_src(item.fileName)%>@100w_100h_1o.jpg" /><textarea class="hide"><%=JSON.stringify(item)%></textarea></x-attachment-item><%})%>';
	EJS.Helpers.prototype.attachmentTemplate=template;
	x.xhtml.attachment={
		lifecycle:{
			inserted:function(){
				if(this.querySelector('x-upload')){
					x.requestFrame(function(){
						x.addClass(this,'attachment-remove');
					}.bind(this));
				}
				x.trigger(this,'xready');
			}
		},
		methods:{
			append:function(data){
				var node=this.querySelector('x-upload');
				var fragment=x.createFragment(x.tools.template.render({text:template},{data:data}));
				var items=fragment.querySelectorAll('x-attachment-item');
				if(node){
					for(var i=0;i<items.length;i++){
						this.insertBefore(items[i],node);
					}
				}else{
					for(var i=0;i<items.length;i++){
						this.append(items[i]);
					}
				}
			}
		},
		events:{
			"click:delegate(x-attachment-item)":function(e){
				if(this.parentNode.querySelector('x-upload')) return;
				if(/img/i.test(e.target.nodeName)||/x-attachment-item/i.test(e.target.nodeName)){
					var data=[];
					var index=0;
					var self=this;
					var width=window.innerWidth;
					x.query(this.parentNode,'x-attachment-item').forEach(function(node,i){
						var img=node.querySelector('img');
						if(node==self){
							index=i;
						}
						data.push({src:img.getAttribute('data-src'),w:width,h:width*(img.height/img.width)});
					});
					storage.setJSON('photoswiper',{data:data,index:index});
					location.open('/crm/src/module/photoswiper.html',true);
				}
			},
			'xuploadsuccess':function(e){
				this.append([e.detail]);
				x.trigger(this,'xupdate',{type:'add'});
			},
			'click:delegate(.remove)':function(e){
				var item=x.closest(this,'x-attachment-item');
				var attachment=item.parentNode;
				var object=JSON.parse(item.querySelector('textarea').value);
				var upload=attachment.querySelector('x-upload');
				upload&&upload.uploader&&upload.uploader.removeFile(object.fileid)
				attachment.removeChild(item);
				x.trigger(attachment,'xupdate',{type:'remove'});
			}
		}
	}
	x.xhtml.register('x-attachment',x.xhtml.attachment);
})(xtag);