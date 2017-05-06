(function(x){
	var week=['日','一','二','三','四','五','六'];
	x.xhtml.date={
		lifecycle:{
			inserted:function(){
				var self=this;
				x.tools.loadCSS(['/libs/mobiscroll/mobiscroll.css']);
				x.tools.loadJS(['/libs/mobiscroll/mobiscroll.js'],function(){
					var input=this.xtag.input=this.querySelector('input');
					var min=input.getAttribute('min');
					var minDate=min?new Date(min):new Date(1999,12,01);
					var max=input.getAttribute('max');
					var maxDate=max?new Date(max):new Date(new Date().getFullYear()+10,12,31);
					var format=input.getAttribute('format');
					var value=input.value;
					this.convertWeekMark(value);
					this.xtag.mobiscroll=$(input).mobiscroll().date({
						defaultValue:value?new Date(value):new Date(),
						showOnFocus: false,
						showOnTap: true,
						animate: 'pop',
						rows : 5,
						maxWidth : 768,
						showLabel : false, //取消年月日显示
						preset: 'date', //日期
						dateFormat:input.getAttribute('format')||'yy-mm-dd', // 日期格式
						setText: '确定', //确认按钮名称
						cancelText: '取消',//取消按钮名籍我
						dateOrder: format=='yyyy-MM'?'yymm':'yymmdd', //面板中日期排列格式
						dayText: '日', 
						monthText: '月', 
						yearText: '年', //面板中年月日文字
						headerText:false, //显示的日期
						endYear:2100, //结束年份
						theme: 'ios',     // Specify theme like: theme: 'ios' or omit setting to use default 
						mode: 'scroller',       // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
						display: 'bottom', // Specify display mode like: display: 'bottom' or omit setting to use default 
						lang: 'zh',       // Specify language like: lang: 'pl' or omit setting to use default
						minDate: minDate,  // More info about minDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-minDate
						maxDate: maxDate,   // More info about maxDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-maxDate
						onSelect: function (value, inst) {
							this.value=inst.getDate().format(format||"yyyy-MM-dd");
							x.trigger(this,'xchange');
						}.bind(input),
						onClose:function(valueText, inst){
							self.xtag.timer&&clearTimeout(self.xtag.timer);
							self.xtag.timer=setTimeout(function(){
								location.href.indexOf('#ui::date')>-1&&history.back();
							},200);
						},
						onCancel:function(valueText, inst){
							self.xtag.timer&&clearTimeout(self.xtag.timer);
							self.xtag.timer=setTimeout(function(){
								location.href.indexOf('#ui::date')>-1&&history.back();
							},200);
						},
						onShow:function(html, valueText, inst){
							var state={fromUrl:location.href,toUrl:location.href.split("#")[0]+"#ui::date"};
							history._state=state;
							history.pushState(state,'',state.toUrl);
							var event=x.addEvent(window,'popstate',function(){
								x.removeEvent(window,event);
								this.hide(false, 'cancel');
							}.bind(inst))
						}
					});
					x.trigger(this,'xready');
				}.bind(this)); 
			},
			removed:function(){
				this.xtag.mobiscroll.mobiscroll('destroy');
			}
		},
		events:{
			'xchange':function(){
				this.convertWeekMark(this.querySelector('input').value);
			}
		},
		methods:{
			convertWeekMark:function(value){
				if(value&&this.getAttribute('weekmark')!==null){
					var node=this.querySelectorAll('input')[1];
					if(node){
						node.value=value+' 周'+(week[new Date(value).getDay()]);
					}
				}
			}
		}
	}
	x.xhtml.register('x-date',x.xhtml.date);
})(xtag);