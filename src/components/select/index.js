(function(x){
	document.createElement('x-option');
	document.createElement('x-option-item');
	document.createElement('x-option-placeholder');
	x.xhtml.select={
		events:{
			'touchstart:delegate(select)':function(e){
				e.preventDefault&&e.preventDefault();
				e.returnValue=false;
				e.cancelBubble=true;
			},
			'click':function(e){
				var self=this;
				var html=[];
				var placeholder=self.getAttribute('placeholder');
				placeholder&&html.push('<x-option-placeholder class="line-bottom weak">'+placeholder+'</x-option-placeholder>');
				html.push('<x-option>');
				x.query(self,'option').forEach(function(item){
					html.push('<x-option-item class="line-bottom btn-touch" value="'+(item.getAttribute('value')||'')+'" '+(item.selected?'selected':'')+'>'+item.innerHTML+'</x-option-item>');
				});
				html.push('</x-option>');
				var node=document.createElement('x-modal');
				node.setAttribute('type','custom');
				node.setAttribute('align','bottom');
				node.setAttribute('animation','bottom');
				node.setAttribute('required','false');
				node.setAttribute('destroy','destroy');
				node.innerHTML=html.join('');
				x.addEvent(node,'click',function(event){
					if(/^x-option-item$/i.test(event.target.nodeName)){
						x.query(self,'option')[x.index(event.target)].selected="selected";
						this.hide(function(){
							x.trigger(self.querySelector('select'),'change');
						});
					}
					if(event.target.nodeName.toLowerCase()=="v-overlay"){
						this.hide();
					}
				});
				x.addEvent(node,'xhide',function(){this.parentNode&&this.parentNode.removeChild(this);});
				x.addEvent(node,'xready',function(){node.show()});
				document.body.appendChild(node);
			}
		}
		
	}
	x.xhtml.register('x-select',x.xhtml.select);
})(xtag);