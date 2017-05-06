(function(x){
	var base={
		lifecycle:{				
			attributeChanged:function(attrName, oldValue, newValue){
				if(/^required|requiredmsg|disabled|type|name|value|checked|max|min|maxlength|pattern|patternmsg|placeholder|readonly|step|autocomplete$/.test(attrName)){
					var node=this.querySelector('input');
					newValue!==null&&node&&node.setAttribute(attrName,newValue);
					oldValue!==null&&newValue==null&&node&&node.removeAttribute(attrName);
				}
				this.attrChanged&&this.attrChanged.apply(this,arguments);
			}
		},
		accessors:{
			required:{
				attribute: {
					selector:'input'
				}
			},
			requiredmsg:{
				attribute: {
					selector:'input'
				}
			},
			disabled:{
				attribute: {
					selector:'input'
				}
			},
			type:{
				attribute: {
					selector:'input'
				}
			},
			name:{
				attribute: {
					selector:'input'
				}
			},
			value:{
				attribute: {
					selector:'input'
				}
			},
			max:{
				attribute: {
					selector:'input'
				}
			},
			min:{
				attribute: {
					selector:'input'
				}
			},
			maxlength:{
				attribute: {
					selector:'input'
				}
			},
			pattern:{
				attribute: {
					selector:'input'
				}
			},
			patternmsg:{
				attribute: {
					selector:'input'
				}
			},
			placeholder:{
				attribute: {
					selector:'input'
				}
			},
			readonly:{
				attribute: {
					selector:'input'
				}
			},
			step:{
				attribute: {
					selector:'input'
				}
			},
			checked:{
				attribute: {
					selector:'input'
				}
			}
		}
	}
	x.xhtml.input={
		lifecycle:{
			created:function(){
				if(!this.querySelector('label')){
					this.innerHTML='<label class="line-radius"><input/></label>'
				}
			}
		},
		events:{
			'focus':function(e){
				if(e.target.type&&(!/checkbox|radio/.test(e.target.type))){
					x.requestFrame(function(){
						x.addClass(this,'focus');
					}.bind(this));
				}
			},
			'blur':function(e){
				if(e.target.type&&(!/checkbox|radio/.test(e.target.type))){
					x.requestFrame(function(){
						x.removeClass(this,'focus');
					}.bind(this));
				}
			},
			'change':function(e){
				this.setAttribute('value',e.target.value);
			}
		}
	}
	x.xhtml.register('x-input',x.merge({},base,x.xhtml.input));
	x.xhtml.radio={
		lifecycle:{
			created:function(){
				if(!this.querySelector('label')){
					this.innerHTML='<label><input type="radio" /><i></i><span></span></label>'
				}
			}
		},
		accessors:{
			label:{
				attribute: {},
				set:function(value){
					this.querySelector('span').innerHTML=value;
				}
			}
		}
	}
	x.xhtml.register('x-radio',x.merge({},base,x.xhtml.radio));
	x.xhtml.checkbox={
		lifecycle:{
			created:function(){
				if(!this.querySelector('label')){
					this.innerHTML='<label><input type="checkbox" /><i></i><span></span></label>'
				}
			}
		},
		accessors:{
			label:{
				attribute: {},
				set:function(value){
					this.querySelector('span').innerHTML=value;
				}
			}
		},
		events:{
			'change':function(e){
				x.requestFrame(function(){
					if(e.target.checked){
						this.setAttribute('checked','');
					}else{
						this.removeAttribute('checked');
					}
				}.bind(this));
			}
		},
	}
	x.xhtml.register('x-checkbox',x.merge({},base,x.xhtml.checkbox));
})(xtag);