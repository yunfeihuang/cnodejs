(function(x){
	x.xhtml.form={
		lifecycle:{
			inserted: function(){
				this.querySelector('form').setAttribute('novalidate','novalidate');
				x.trigger(this,'xready');
			}
		},
		accessors:{
			confirm:{
				attribute: {},
				set:function(value){
					if(value===undefined&&this.modal){
						delete this.modal;
						return;
					}
					if(this.modal){
						this.modal.html(value);
					}else{
						this.modal=document.createElement('x-modal');
						this.modal.setAttribute('type','confirm');
						this.modal.innerHTML=value;
						document.body.appendChild(this.modal);
						x.addEvent(this.modal,'xdefine',function(){
							this.submit();
						}.bind(this));
					}
				}
			}
		},
		attributeChanged: function(attrName, oldValue, newValue){
			if(attrName=='confirm'){
				this.modal&&this.modal.html(newValue);
			}
		},
		methods:{
			getHook:function(name){
				return x.tools.validateHooks[name];
			},
			hookValidate:function(name,value){
				var hook=this.getHook(name);
				if(typeof hook=='string'){
					var reg=new RegExp(hook);
					return reg.test(value);
				}
				if(typeof hook=='function'){
					return hook(value);
				}
			},
			validateField:function(node){
				//ie9 fix
				if(node.required===undefined){
					"required|pattern|max|min".split("|").forEach(function(item){
						if(item=="required"){
							node[item]=node.getAttribute(item)===null?false:true;
						}else{
							node[item]=node.getAttribute(item);
						}
					});
				}
				//有disabled的不做校验
				if(node.disabled===true){
					x.trigger(node,'valid');
					return;
				}
				var type=node.type;
				var val=node.value.trim();
				if(type=='radio'||type=='checkbox'){
					var name=node.name;
					var required=node.required;
					if(required==true&&name&&x.query(this,'input[name="'+name+'"]:selected').length==0){
						x.trigger(node,'invalid',node.getAttribute('requiredmsg')||'请选择')
						return;
					}
				}else if(node.nodeName=='select'){
					if(node.required==true&&!val){//非空校验
						x.trigger(node,'invalid',node.getAttribute('requiredmsg')||'请选择此字段');
						return;
					}
				}else{
					if(node.required==true&&!val){//非空校验
						x.trigger(node,'invalid',node.getAttribute('requiredmsg')||'请输入此字段');
						return;
					}
					if(val){
						/*
						if(this.hookValidate(type,val)===false){//类型校验
							this.trigger.call(node,'invalid','输入值不正确');
							return;
						}*/
						if(val&&node.pattern&&this.hookValidate(node.pattern,val)===false){//正则表达式校验
							x.trigger(node,'invalid',node.getAttribute('patternmsg')||'输入值不正确');
							return;
						}
						if(node.max&&!isNaN(node.max)&&parseFloat(val)>parseFloat(node.max)){//数值范围校验
							x.trigger(node,'invalid','输入值不能大于'+node.max);
							return;
						}
						if(node.min&&!isNaN(node.min)&&parseFloat(val)>parseFloat(node.min)){//数值范围校验
							x.trigger(node,'invalid','输入值不能小于'+node.min);
							return;
						}
						var minlength=node.getAttribute('minlength');
						if(minlength&&val.length<minlength){//字符长度范围校验
							x.trigger(node,'invalid','输入值不能小于'+minlength+"个字符");
							return;
						}
					}
				}
				x.trigger(node,'valid');
			},
			validate:function(){				
				return this.validateFail;
			},
			serializeArray:function(form){
				 var result = [];
				 x.toArray(form.elements).forEach(function(node){
					 var type = node.type;
				  if (node.nodeName.toLowerCase() != 'fieldset' &&!node.disabled && type != 'submit' && type != 'reset' && type != 'button'&& node.name &&((type != 'radio' && type != 'checkbox') || node.checked))
					result.push({
					  name: node.name,
					  value: node.value.trim(),
					  type:node.type,
					  json:node.getAttribute('json'),
					  xss:node.getAttribute('xss')
					})
				 })
				return result;
			},
			getFormData:function(form){
				var data={};
				var fields=this.serializeArray(form||this.querySelector('form'));
				fields.forEach(function(field){
					//防止xss攻击
					if(field.value&&field.xss!='none'){
						field.value=field.value.replace(/>/g,'&gt;').replace(/</g,'&lt;');
					}
					//字符串转化JSON
					if(field.value&&field.json!==null){
						field.value=JSON.parse(field.value);
					}
					if(!data[field.name]){
						if(field.type=='checkbox'){
							data[field.name]=[];
							if(field.value){
								data[field.name].push(field.value);
							}
						}else{
              data[field.name]=field.value;
            }
					}else{
						if(data[field.name] instanceof Array){
							data[field.name].push(field.value);
						}
					}
				});
				return data;
			},
			submit:function(){
				var form=this.querySelector('form');
				var formdata=this.getFormData(form);
				if(this.filterFormData){
					formdata=this.filterFormData(formdata)
				}
				if(form.getAttribute('disabled')===null){
					form.setAttribute('disabled','disabled');
					x.tools.ajax({
						url:form.action,
						data:formdata,
            contentType:form.getAttribute('contenttype'),
						type:form.getAttribute('method')||'POST',
						context:this,
						complete:function(){
							setTimeout(function(){
								form.removeAttribute('disabled'); 
							},2000);
						}
					});
				}
			},
			createToast:function(text){
				if(!this.toast){
					this.toast=document.createElement('x-toast');
					this.toast.setAttribute('type','info');
					this.toast.setAttribute('align','bottom');
					this.toast.innerHTML=text;
					document.body.appendChild(this.toast);
				}else{
					this.toast.innerHTML=text;
				}
				return this.toast;
			},
      reset:function(){
        x.toArray(this.querySelector('form').elements).forEach(function(node){
					 var type = node.type;
					 var nodeName=node.nodeName.toLowerCase();
					 if(nodeName=="input"){
						 if(node.type&&node.type!='hidden'&&node.getAttribute('notreset')===null){
							node.value='';
						 }
					 }else if(nodeName=="textarea"&&node.getAttribute('notreset')===null){
						node.value='';
					 }else if(nodeName=="select"&&node.getAttribute('notreset')===null){
					 	node.children[0]&&(node.value=node.children[0].value);   
					 }
				});
      },
      invalid:function(e){
        if(!this.validateFail){
					this.validateFail=true;
					this.createToast(e.detail).show();
				}
      },
      valid:function(e){
      
      },
      beforeSubmit:function(){
        this.validateFail=false;
				x.trigger(x.query(this,'input,textarea,select'),'validator');
				if(!this.validate()){
					if(this.modal){
						this.modal.show();
					}else{
						this.submit();
					}
				}
      }
		},
		events:{
			'validator:delegate(input,select,textarea)':function(){
        var xform=x.closest(this,'x-form');
				xform.validateField&&xform.validateField(this);
			},
			'invalid:delegate(input,textarea,select)':function(e){
				var xform=x.closest(this,'x-form');
        xform.invalid&&xform.invalid(e);
			},
      'valid:delegate(input,textarea,select)':function(e){
				var xform=x.closest(this,'x-form');
        xform.valid&&xform.valid(e);
			},
			'submit:delegate(form)':function(e){
				e.preventDefault();
				var xform=x.closest(this,'x-form');
				xform.beforeSubmit&&xform.beforeSubmit();
			},
			'reset:delegate(form)':function(e){
				e.preventDefault();
        var xform=x.closest(this,'x-form');
				xform.reset&&xform.reset();
			}
		}
	}
  if(document.currentScript&&document.currentScript.src.indexOf('-pc.js')>-1){
    x.xhtml.form.methods.invalid=function(e){
      var target=e.target;
      this.validateFail=true;
      var node=target._help?target._help:document.createElement('div');
      node.innerHTML=e.detail;
      node.className='control-help';
      /*
      if(target.getAttribute('help')){
        node=document.getElementById(target.getAttribute('help'));
      }else if(target.parentNode.querySelector('.control-help')){
        node=target.parentNode.querySelector('.control-help');
      }else{ 
        node=document.createElement('div');
        node.className='control-help';
        target.parentNode.appendChild(node)
      }*/
      var offset=target.getBoundingClientRect();
      node.style.left=offset.left+'px';
      node.style.top=offset.top+offset.height+document.body.scrollTop+'px';
      target._help=node;
      !node.parentNode&&document.body.appendChild(node);
    }
    x.xhtml.form.methods.valid=function(e){
      e.target._help&&(e.target._help.style.display='none');
    }
    x.xhtml.form.events['blur:delegate(input,select,textarea)']=function(){
      var xform=x.closest(this,'x-form');
      xform.validateField&&xform.validateField(this);
    }
  }
	x.xhtml.register('x-form',x.xhtml.form);
})(xtag);
