/*
ydh app based class  --mw
 */

 (function(root,Fnhybrid){
 	//cmd
	if (typeof define === 'function' && define.cmd) {
		define(Fnhybrid);
	} else if (typeof exports === 'object') { //umd
		module.exports = Fnhybrid();
	} else {
		var HybridBase=Fnhybrid();
		root.hybrid = new HybridBase();
	}
 })(window,function(require, exports, module) {
				function HybridBase (Model){
				    //this.model = Model;
				    this.ERRORMESSAGE = "设备接口调用失败！";
				}
				/**
				 * 确认弹框 
				 * @param  Object opt
				 */
				HybridBase.prototype.showConfirm = function (opt){
					var defaultOpt = {
					    title:'',
					    message:'',
					    label:['确认','取消'],
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					try{
						ydh.device.showConfirm(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					         title:opts.title,
					         message:opts.message,
					         buttonLabels:opts.label
					    });
					}catch(e){
						alert('showConfirm'+this.ERRORMESSAGE);   //暂时去掉
					}
				};
				///////////////////////////////////////////////////////////////////////////////////
				/*设备--ydh.device*/
					/*设备--ydh.device*/
				/**
				 * 获取通用唯一识别码 ydh.device.getUuid
				 * @param  Object opts
				 */
				HybridBase.prototype.getUuid=function (opt){
					var defaultOpt = {
					    uuid:'',  
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					try{
						ydh.device.getUuid(function(res){
							opts.callback.success(res);
					    },function(err){
					        opts.callback.error(err);
					    },{
					         uuid:opts.uuid
					    });
				    }catch(e){
						alert('getUuid'+this.ERRORMESSAGE);   //暂时去掉
					}
				}
				/**
				 * 获取手机APP版本号和版本名称 ydh.device.getAppVersion
				 * @param  Object opts
				 */
				HybridBase.prototype.getAppVersion=function (opt){
					var defaultOpt = {
					    platform:'',
			 		    versionCode:'',
			 		    versionName:'',  
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);

					try{
						ydh.device.getAppVersion(function(res){
							opts.callback.success(res);
					    },function(err){
					        opts.callback.error(err);
					    },{
					         platform:opts.platform,
					         versionCode:opts.versionCode,
					         versionName:opts.versionName
					    });
				    }catch(e){
						alert('getAppVersion'+this.ERRORMESSAGE);   //暂时去掉
					}
				}
				/**
				 * 获取当前网络类型 ydh.device.getNetworkType
				 * @param  Object opts 
				 */
				HybridBase.prototype.getNetworkType=function (opt){
					var defaultOpt = {
					    result:'',   
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);

					try{
						ydh.device.getNetworkType(function(res){
							opts.callback.success(res);
					    },function(err){
					        opts.callback.error(err);
					    },{
					         result:opts.result
					    });
				    }catch(e){
						alert('getNetworkType'+this.ERRORMESSAGE);   //暂时去掉
					}
				}

				/**
				 * 跳转页面 ydh.device.openPage
				 * @param  Object opts
				 */
				HybridBase.prototype.openPage = function (opt){
					var defaultOpt = {
					    url:'', 
					    title:null,  
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);

					try{
						ydh.device.openPage(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					        url:opts.url,
					        title:opts.title
					    });
				    }catch(e){
						alert('openPage'+this.ERRORMESSAGE);   //暂时去掉
					}

				};
				
				/**
				 * 添加事件 ydh.device.pushEvent
				 * @param  Object opts
				 */

				HybridBase.prototype.pushEvent = function (opt){
					var defaultOpt = {
						//对JSON有疑问？
					    eventObject:'',  
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);

					try{
						ydh.device.pushEvent(function(res){
							opts.callback.success(res);
					    },function(err){
					        opts.callback.error(err);
					    },{
					         eventObject:opts.eventObject
					    });
				    }catch(e){
						alert('pushEvent'+this.ERRORMESSAGE);   //暂时去掉
					}
				};
				/**
				 * 显示toast ydh.device.toast
				 * @param  Object opts
				 */
				HybridBase.prototype.showToast = function (opt){

					var defaultOpt = {
					    text:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);

					try{
						ydh.device.showToast(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					         text:opts.text
					    });
					}catch(e){
						alert('showToast'+this.ERRORMESSAGE);   //暂时去掉
					}
					
				};
				/**
				 * 显示浮层 ydh.device.showPreloader
				 * @param  Object opts
				 */
				HybridBase.prototype.showPreloader = function (opt){
					try{
						ydh.device.showPreloader(function(res){
					        // alert("success:");
					    },function(err){
					        alert("showPreloader error:"+err);
					    },{
					        text: ( (opt && opt.data) || '加载中..' )
					    });
						
					}catch(e){
						//alert('showPreloader'+this.ERRORMESSAGE);   //暂时去掉
						console.log('showPreloader'+this.ERRORMESSAGE);   //暂时去掉
					}
					
				};
				/**
				 * 隐藏浮层 ydh.device.hidePreloader,和showPreloader配对使用。
				 * @param  Object opts
				 */
				 HybridBase.prototype.hidePreloader = function (opt){
				 	try{
				 		ydh.device.hidePreloader(function(res){
					        // alert("success:");
					    },function(err){
					        alert("showPreloader error:"+err);
					    });
				 	}catch(e){
				 		//alert('hidePreloader'+this.ERRORMESSAGE);   //暂时去掉
				 		console.log('hidePreloader'+this.ERRORMESSAGE);   //暂时去掉
				 	}
				 }
				//////////////////////////////////////////////////////////////

				/*以下使用(业务)ydh.biz*/

				/**
				 * 获取accessTokeb ydh.biz.getAccessToken
				 * @param  Object opts
				 * 
				 */
				HybridBase.prototype.getAccessToken = function (opt){

					var defaultOpt = {
					    accessToken:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);

					try{
						ydh.biz.getAccessToken(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					         accessToken:opts.accessToken
					    });
					}catch(e){
						alert('getAccessToken'+this.ERRORMESSAGE);   //暂时去掉
					}
					
				};
				/**
				 * 分享 ydh.biz.shareContent
				 * @param  Object opts
				 */
				HybridBase.prototype.shareContent = function (opt){
					var defaultOpt = {
					    url:'',
					    title:'',
					    content:'',
					    image:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					console.log(opts,opts.url)
					try{
						ydh.biz.shareContent(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					         url:opts.url,
					         title:opts.title,
					         content:opts.content,
					         image:opts.image
					    });
					}catch(e){
						alert('shareContent'+this.ERRORMESSAGE);   //暂时去掉
					}
					
				};
				/**
				 * 图片浏览器 ydh.biz.showImages
				 * @param  Object opts 
				 */
				HybridBase.prototype.showImages = function (opt){

					var defaultOpt = {
						//对数组有疑问？
					    urls:'',  
					    current:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);

					try{
						ydh.biz.showImages(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					         urls:opts.urls,    
					         current:opts.current
					    });
					}catch(e){
						alert('showImages'+this.ERRORMESSAGE);   //暂时去掉
					}
					
				};

				/**
				 * 日期选择器 ydh.biz.pickDate
				 * @param  Object opts
				 */
				HybridBase.prototype.pickDate = function (opt){
					var defaultOpt = {
					    format:'',
					    value:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);

					try{
						ydh.biz.pickDate (function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					         format:opts.format,
					         value:opts.value
					    });
					}catch(e){
						alert('pickDate'+this.ERRORMESSAGE);   //暂时去掉
					}
					
				};

				/**
				 * 选择图片上传 ydh.biz.uploadImages 
				 * @param  Object opts 
				 */
				HybridBase.prototype.uploadImages = function (opt){
					//有number有疑问？
					var defaultOpt = {
					    multiple:true,
					    max:9,
					    attachmentType:opt.attachmentType,
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					console.log(opts);
					try{
						ydh.biz.uploadImages(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					        multiple:opts.multiple,
					        max:opts.max,
					        attachmentType:opts.attachmentType
					    });
					}catch(e){
						alert('uploadImages'+this.ERRORMESSAGE);   //暂时去掉
					}
					
				};

				/**
				 * 选择文件上传 ydh.biz.uploadFile   
				 * @param  Object opts 
				 */
				HybridBase.prototype.uploadFile = function (opt){

					var defaultOpt = {
					    attachmentType:opt.attachmentType,
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					try{
						ydh.biz.uploadFile(function(res){
							console.log('res:'+res);
							opts.callback.success(res);
					    },function(err){
					    	console.log('err:'+err);
					    	opts.callback.error(err);
					    },{
					        attachmentType:opts.attachmentType
					    });
					}catch(e){
						alert('uploadFile'+this.ERRORMESSAGE);   //暂时去掉
					}
					
				};
				/**
				 * 打电话 ydh.biz.call
				 * @param  Object opts
				 */
				HybridBase.prototype.call = function (opt){
					var defaultOpt = {
					    phone:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);

					try{
						ydh.biz.call(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					         phone:opts.phone
					    });
					}catch(e){
						alert('call'+this.ERRORMESSAGE);   //暂时去掉
					}
					
				};

				/**
				 * 发短信 ydh.biz.sendMessage
				 * @param  Object opts
				 */
				HybridBase.prototype.sendMessage = function (opt){
					var defaultOpt = {
					    telephone:'',
					    text:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);

					try{
						ydh.biz.sendMessage(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					         telephone:opts.telephone,
					         text:opts.text
					    });
					}catch(e){
						alert('sendMessage'+this.ERRORMESSAGE);   //暂时去掉
					}
					
				};

				/**
				 * 扫码 ydh.biz.scanCode
				 * @param  Object opts
				 */
				HybridBase.prototype.scanCode = function (opt){
					var defaultOpt = {
					    type:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					try{
						ydh.biz.scanCode(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					         type:opts.type
					    });
					}catch(e){
						alert('scanCode'+this.ERRORMESSAGE);   //暂时去掉
					}
					
				};

				/**
				 * 导航栏--设置导航栏标题 ydh.biz.navigation.setTitle  
				 * @param  Object opts 
				 */
				HybridBase.prototype.setTitle = function (opt){
					var defaultOpt = {
					    title:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);

					try{
						ydh.biz.navigation.setTitle(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					         title:opts.title
					    });
					}catch(e){
						alert('setTitle'+this.ERRORMESSAGE);   //暂时去掉
					};
				};


				/**
				 * 底部菜单栏--显示隐藏底部菜单 ydh.biz.tab.setVisibility
				 * @param  Object opts 
				 */
				HybridBase.prototype.setVisibilityTab = function (opt){
					var defaultOpt = {
					    visibility:1,
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					try{
						ydh.biz.tab.setVisibility(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					         visibility:opts.visibility
					    });
					}catch(e){
						alert('setTitle'+this.ERRORMESSAGE);   //暂时去掉
					}
				}

				/**
				 * 底部菜单栏--显示隐藏顶部导航栏 ydh.biz.tab.setVisibility
				 * @param  Object opts 
				 */
				HybridBase.prototype.setVisibilityNavigation = function (opt){
					var defaultOpt = {
					    visibility:1,
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					try{
						ydh.biz.navigation.setVisibility(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					         visibility:opts.visibility
					    });
					}catch(e){
						alert('setTitle'+this.ERRORMESSAGE);   //暂时去掉
					}
				}
				/**
				 * 下载 ydh.biz.download
				 * @param  Object opts 
				 */
				HybridBase.prototype.download = function (opt){
					var defaultOpt = {
					    downloadUrl:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					
					opts.downloadUrl = opts.downloadUrl+'&access_token='+SYSTEM.ACCESSTOKEN;

					console.log(opts.downloadUrl);
					try{
						ydh.biz.download(function(res){
							console.log(res)
							opts.callback.success(res);
					    },function(err){
					    	console.log(err)
					    	opts.callback.error(err);
					    },{
					        downloadUrl:opts.downloadUrl
					    });
					}catch(e){
						alert('download'+this.ERRORMESSAGE);   //暂时去掉
					}
				}
				/**
				 * 切换账号 ydh.biz.changeAccount
				 */
				HybridBase.prototype.changeAccount = function (opt){
					try{
						ydh.biz.changeAccount(function(res){
							console.log('res:changeAccount'+res)
					    },function(err){
					    	console.log('error:'+err)
					    });
					}catch(e){
						alert('changeAccount'+this.ERRORMESSAGE);  
						console.log('changeAccount failed');
					}
				}
				/**
				 * 注销账号 ydh.biz.logout
				 */
				HybridBase.prototype.logout = function (opt){
					try{
						ydh.biz.logout(function(res){
							console.log('res:'+res)
					    },function(err){
					    	console.log('error:'+err)
					    });
					}catch(e){
						alert('logout'+this.ERRORMESSAGE);  
						console.log('logout failed');
					}
				}
				/**
				 * IOS 评分 ydh.biz.grade
				 */
				HybridBase.prototype.grade = function (opt){
					try{
						ydh.biz.grade(function(res){
							console.log('res:'+res)
					    },function(err){
					    	console.log('error:'+err)
					    });
					}catch(e){
						alert('grade'+this.ERRORMESSAGE);  
						console.log('grade failed');
					}
				}
				/**
				 * 保存图片到手机 ydh.biz.saveImage
				 * @param  Object opts 
				 */
				HybridBase.prototype.saveImage = function (opt){
					var defaultOpt = {
					    url:'',
					    name:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);

					opts.url = opts.url +'&access_token='+SYSTEM.ACCESSTOKEN;
					try{
						ydh.biz.saveImage(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },{
					        url:opts.url,
					        name:opts.name
					    });
					}catch(e){
						alert('saveImage'+this.ERRORMESSAGE);   //暂时去掉
					}
				}
				
				/**
				 * 设置导航栏背景颜色 ydh.biz.navigation.setBackgroundColor
				 * @param  Object opts 
				 */
				HybridBase.prototype.setBackgroundColor = function (opt){
					var defaultOpt = {
					    color:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					console.log(opts);
					// alert(SYSTEM.showstyleTemplateColor)
					try{
						ydh.biz.navigation.setBackgroundColor(function(res){
							console.log('res'+res);
							opts.callback.success(res);
					    },function(err){
					    	console.log('err'+err);
					    	opts.callback.error(err);
					    },{
					        color:opts.color
					    });
					}catch(e){
						alert('setBackgroundColor'+this.ERRORMESSAGE);   //暂时去掉
					}
				}

				/**
				 * 设置状态栏属性 ydh.biz.statusBar.setAttributes
				 * @param  Object opts 
				 */
				HybridBase.prototype.setAttributes = function (opt){
					var defaultOpt = {
					    backgroundColor:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					try{
						ydh.biz.statusBar.setAttributes(function(res){
							console.log('res'+res);
							opts.callback.success(res);
					    },function(err){
					    	console.log('err'+err);
					    	opts.callback.error(err);
					    },{
					        backgroundColor:opts.backgroundColor
					    });
					}catch(e){
						alert('setAttributes'+this.ERRORMESSAGE);   //暂时去掉
					}
				}
				
				/**
				 * 支付宝支付 ydh.biz.alipay.pay
				 * @param  Object opts 
				 */
				HybridBase.prototype.alipay = function (opt){
					var defaultOpt = {
					    info:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					console.log(opts);
					try{
						ydh.biz.alipay.pay(function(res){
							console.log('res'+res);
							opts.callback.success(res);
					    },function(err){
					    	console.log('err'+err);
					    	opts.callback.error(err);
					    },{
					        info:opts.info
					    });
					}catch(e){
						alert('alipay'+this.ERRORMESSAGE);   //暂时去掉
					}
				}

				/**
				 * 易极付注册 ydh.biz.yiji.registerForYiJi
				 * @param  Object opts 
				 */
				HybridBase.prototype.registerForYiJi = function (opt){
					var defaultOpt = {
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					console.log(opts);
					try{
						ydh.biz.yiji.registerForYiJi(function(res){
							console.log('res'+res);
							opts.callback.success(res);
					    },function(err){
					    	console.log('err'+err);
					    	opts.callback.error(err);
					    });
					}catch(e){
						alert('alipay'+this.ERRORMESSAGE);   //暂时去掉
					}
				}
				
				/**
				 * 易极付支付 ydh.biz.yiji.pay
				 * @param  Object opts 
				 */
				HybridBase.prototype.yijipay = function (opt){
					var defaultOpt = {
						merchantAccount:'',
						ticketNo:'',
						buyerAccountId:'',
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);
					console.log('易极付opts:'+opts);
					try{
						ydh.biz.yiji.pay(function(res){
							console.log('res'+res);
							opts.callback.success(res);
					    },function(err){
					    	console.log('err'+err);
					    	opts.callback.error(err);
					    },{
					        merchantAccount:opts.merchantAccount,
							ticketNo:opts.ticketNo,
							buyerAccountId:opts.buyerAccountId
					    });
					}catch(e){
						alert('alipay'+this.ERRORMESSAGE);   //暂时去掉
					}
				}

				//打开出库
				HybridBase.prototype.openScanOutStorage = function(opt){
					alert(1);
					ydh.biz.ui.openScanOutStorage();
				}

				//设置右上角菜单
				HybridBase.prototype.setMenu = function (opt){
					var defaultOpt = {
						backgroundColor:'',
						items:[],
					    callback:{
					        success:function(res){},
					        error:function(err){}
					    }
					};
					var opts = $.extend(true,defaultOpt,opt);

					try{
						ydh.biz.navigation.setMenu(function(res){
							opts.callback.success(res);
					    },function(err){
					    	opts.callback.error(err);
					    },opts);
					}catch(e){
						alert('alipay'+this.ERRORMESSAGE);   //暂时去掉
					}
				}
				
				!!module && (module.exports = HybridBase);
				return HybridBase
			});
		
