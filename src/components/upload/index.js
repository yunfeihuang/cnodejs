(function(x){
	var template='<%data.forEach(function(item){%><li class="file-item" id="file-<%=item.id%>"><div class="file-item-progress"></div><textarea style="display:none"><%=JSON.stringify(item)%></textarea><div class="flex-box align-center line-bottom"><div class="flex-item"><%=item.fileName%></div><button type="button" class="file-delete"></button></div></li><%})%>';
	x.xhtml.upload={
		lifecycle:{
			inserted:function(){
				/*
				if(config.isApp){
					document.addEventListener('deviceready', function(){
						this.upload();
					}.bind(this), false);
				}else{
					 this.upload();
				}*/
				this.upload();
				x.trigger(this,'xready');
			},
			removed:function(){
				this.hideOverlay();
				this.uploader.stop&&this.uploader.stop(true);
				this.uploader.destroy&&this.uploader.destroy();
				this.uploader=null;
			}
		},
		methods:{
			upload:function(){
				//hybrid
				//if(config.isApp){
				if(false){
					var self=this;
					this.onclick=function(){
						var options=x.getParameter(self);
						//alert(JSON.stringify(options))
						options.max=options.fileNumLimit;
						options.callback={
							success:function(data){
								if(this.filebox){
									var node=document.createElement('div');
									node.innerHTML=x.tools.template.render({text:template},{data:data.urls});
									document.getElementById(this.filebox).appendChild(node.children[0]);
								}
								x.trigger(self,'xuploadsuccess',data.urls);
							}.bind(options),
							error:function(){
								
							}
						}
						if(options.accept=='images'){
							hybrid.uploadImages(options);
						}else if(options.accept=='files'){
							hybrid.upload(options);
						}
					}
				}else{
					var options=x.getParameter(this);
					options.accept=this.getAccept(options.accept);
					this.webuploader(options);
				}
				if(options.filebox){
					document.getElementById(options.filebox).onclick=function(e){
						if(e.target.className.indexOf('file-delete')>-1){
							var node=x.closest(e.target,'.file-item');
							var textarea=node.querySelector('textarea');
							if(textarea){
								var file=JSON.parse(textarea.value);
								var btn=document.getElementById(file.target);
								btn&&btn.uploader.removeFile(file.id);
							}
							node.parentNode.removeChild(node);
						}
					}.bind(this);
				}
			},
			webuploader:function(options){
				x.tools.loadJS(['/crm/libs/webuploader/webuploader.html5only.js'],function(){
					var def = {
						url:'/upload',
						auto:true,
						multiple:false,
						fileSingleSizeLimit:10*1024*1024,	//10M
						compress:false,		//是否压缩上传的图片
						threads:3,		//上传并发数
						callback:false,	 		//上传完成执行的回调
						//如果是APP用到的参数
						upType:'Images',	//Images图片 File 文件
						attachmentType:1,	//1是商品附件，2是订单附件，3是通知附件，4是付款记录附件 5反馈
						road:'question/images/23271/'
					};
					options=x.merge({},def,options);
					options.pick={id:this};
					if(options.multiple!==undefined){
						options.pick.multiple=options.multiple;
					}
					options.server=options.url;
					var uploader=this.uploader = WebUploader.create(options);
					var self=this;
					self.id="uploader-"+Math.random();
					// 当有文件添加进来的时候 单个文件
					uploader.on( 'fileQueued', function( file ) {
						if(this.options.accept&&JSON.stringify(this.options.accept).indexOf("image")>-1&&file.type=="application/octet-stream"&&file.name.indexOf('.')==-1){
							file.name=file.name+".png";
						}
						self.showOverlay();
						var _file={
							fileName:file.name||file.fileName,
							id:file.id,
							size:file.size,
							attachment:file.attachment,
							target:self.id
						}
						if(this.options.filebox){
							var node=document.createElement('div');
							node.innerHTML=x.tools.template.render({text:template},{data:[_file]});
							document.getElementById(options.filebox).appendChild(node.children[0]);
						}
					});

					// 文件上传过程中创建进度条实时显示。
					uploader.on( 'uploadProgress', function( file, percentage ) {
						var node=document.querySelector('#file-'+file.id+' .file-item-progress');
						if(node){
							node.style.width=percentage * 100 + '%';
						}
					});

					// 文件上传成功，给item添加成功class, 用样式标记上传成功。
					uploader.on( 'uploadSuccess', function( file,response ) {
						var node=document.querySelector('#file-'+file.id+' .file-item-progress');
						if(node){
							node.parentNode.removeChild(node);
						}
						if(response&&response.code==200){
							response.data.fileid=file.id;
							x.trigger(self,'xuploadsuccess',response.data);
						}else{
							window.toast({content:response.message||"上传出错"});
							this.removeFile(file.id);
						}
					});

					// 文件上传失败，现实上传出错。
					uploader.on( 'uploadError', function( file ) {
						var node=document.getElementById('file-'+file.id);
						if(node){
							node.querySelector('.flex-item').innerHTML=node.querySelector('.flex-item').innerHTML+"(上传失败)";
							node.removeChild(node.querySelector('.file-item-progress'));
							node.removeChild(node.querySelector('textarea'));
						}
						window.toast({content:file.name+' 上传失败'});
					});

					// 完成上传完了，成功或者失败，先删除进度条。 单个文件
					uploader.on( 'uploadComplete', function(file) {
					
					});

					//全部完成执行
					uploader.on('uploadFinished',function(){
						self.hideOverlay();
					});

					//不能上传
					uploader.on('error', function( type,file ){
						if(type === 'Q_TYPE_DENIED'){
							window.toast({content:'文件类型不符合或者系统浏览器不支持'});
						}else if( type === 'F_DUPLICATE'){
							window.toast({content:'不能上传重复的文件'});
						}else if(type==='Q_EXCEED_NUM_LIMIT'){
							window.toast({content:'上传文件不能超出'+this.options.fileNumLimit+'个'});
						}else if(type==='F_EXCEED_SIZE'){
							window.toast({content:'上传的文件大小超出限制范围'});
						}else{
							window.toast({content:'未知错误类型'+type});
						}
					});
				}.bind(this));
			},
			getAccept:function(accept){
				var ret=accept;
				if(accept === 'images'){
					ret= {
						title: 'Images',
						extensions: 'jpg,jpeg,png',
						mimeTypes: 'image/*'
					}
				}else if(accept === 'files'){
					ret={
						title: 'intoTypes',
						extensions: 'rar,zip,doc,xls,docx,xlsx,pdf',
						mimeTypes: '.rar,.zip,.doc,.xls,.docx,.xlsx,.pdf'
					}
				}
				return ret;
			},
			showOverlay:function(){
				this.xtag.overlay=document.createElement('x-overlay');
				this.xtag.overlay.innerHTML="文件上传中...";
				this.xtag.overlay.style.cssText="text-align: center;color:#eee;line-height:3rem;line-height:80vh;"
				this.xtag.overlay.style.zIndex=1000;
				document.body.appendChild(this.xtag.overlay);
			},
			hideOverlay:function(){
				this.xtag.overlay&&document.body.removeChild(this.xtag.overlay);
				this.xtag.overlay=null;
			}
		}
	}
	x.xhtml.register('x-upload',x.xhtml.upload);
})(xtag);