(function($){
	//初始化
	$(function(){
		//
		$(document.body).css({'overflow':'hidden'})
		//添加父元素
		$('#pagepiling').wrap('<div class="pagepilingBox"></div>');
		$('.pagepilingBox').css({
			'overflow':'hidden',
			'height':$(window).height()+'px',
			'width':'100%',
			'position':'fixed'
		})
		$('#pagepiling').css({
			'position':'absolute',
			'top':0
		})
	})
	//自定义一个对象
	var defaults={
		//主容器
		'container':'#pagepiling',
		//分页
		'sections':'.section',
	}
	var opts;
	//声明一个数组,用来存放这几页
	var arrElement = [];
	var container;
	var sections;
	var index=0;
	var dur;
	var flag=true;
	var SP=$.fn.fullPage=function(options){
		opts=$.extend({},defaults,options||{});
		container=$(opts.container);
		dur=opts.duration;
		sections=container.children(opts.sections);
		sections.each(function(){
			arrElement.push($(this));
		})
		full();
	};
	//向上滑动事件
	SP.moveUp=function(){
		if(flag){
			if(index){
				index--;
			}else if(opts.loop){
				index=(arrElement.length-1);
			}
			SP.move(index);
		}else{
			return;
		}

	}
	//向下滑动事件
	SP.moveDown=function(){
		if(flag){
			if(index<(arrElement.length-1)){
				index++;
			}else if(opts.loop){
				index=0;
			}
			SP.move(index);
		}else{
			return;
		}
	}
	//全屏
	/*arrElement这个属性在SP这个函数的外边是值为空，在里面就不是空，我的疑问，arrElement是全局的为什么，函数full访问不到.目前我能想到的答案，当我网页一打开就加载了
	这个full这个函数(在full()的情况下)，此时此刻SP还没有被页面中的JQ调用啊，所以这时的arrElement是undefined*/

	function full(){
		container.css({
			'width':'100%',
			'height':$(window).height()*arrElement.length+'px'
		});
		sections.each(function(){
			$(this).css({
				'width':'100%',
				'height':$(window).height()+'px'
			})
		})
	}
	//缩放改变尺寸
	//缩放
	$(window).resize(function(){
		//为了控制top值 不能大小变化，而top不变吧
		full();
		SP.move(index);
	
	});
	
	//滚动函数
	SP.move=function(index){
		flag=false;
		container.stop(true).animate({
			top:-index*$(window).height()+'px'
		},dur,function(){
			flag=true;
		});
	}
	/*鼠标滚动事件*/
	$(document).on('mousewheel DOMMouseScroll',mouseWheelHandle);
	function mouseWheelHandle(e){
		var value=e.originalEvent.wheelDelta || -e.originalEvent.detail; //火狐和非火狐
		if(value>0){
			SP.moveUp()
		}else{
			SP.moveDown();
		}
	}

})(jQuery);