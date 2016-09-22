$(function(){
	(function($){
		//初始化
		//移动端meta
		$(document.head).append('<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">')
		$(document.body).css({'overflow':'hidden'})
		//添加父元素
		$('#pagepiling').wrap('<div class="pagepilingBox"></div>');
		$('.pagepilingBox').css({
			'overflow':'hidden',
			'width':'100%',
			'height':$(window).height()+'px',
			'position':'fixed'
		})
		$('#pagepiling').css({
			'position':'absolute',
			'top':0
		})
		//自定义一个对象
		var defaults={
			//主容器
			'container':'#pagepiling',
			//分页
			'sections':'.section',
			//是否显示右侧导航默认显示
			'show':true,
			//右侧导航默认背景色
			'showBg':'rgba(0,0,0,.5)',
			//右侧导航默认选种颜色
			'clickShowBg':'#eee'
		}
		var opts;
		//声明一个数组,用来存放这几页
		var arrElement = [];
		var container;
		var sections;
		var index=0;
		var dur;
		var flag=true;
		var show;
		var clickShowBg;
		//右侧导航边框颜色
		var showBg;
		var SP=$.fn.fullPage=function(options){
			opts=$.extend({},defaults,options||{});
			container=$(opts.container);
			dur=opts.duration;
			show=opts.show;
			showBg=opts.showBg;
			clickShowBg=opts.clickShowBg;
			sections=container.children(opts.sections);
			sections.each(function(){
				arrElement.push($(this));
			})
			full();
			SP.show();
			showStyle();
			clickShow();

		};
		//右侧导航函数
		SP.show=function(){
			if(show){
				var pageHtml = '<ul id="pages"><li></li>';
				for(var i=1;i<arrElement.length;i++){
					pageHtml+='<li></li>'
				}
				pageHtml += '</ul>';
				$('#pagepiling').append(pageHtml);
				clickShow(index)
			}else{
				return;
			}
			//为每个小圆点绑定事件(事件委托)
			$("#pages").delegate("li","click",function(){
				index=$(this).attr('data-ind');
				clickShow(index);
				SP.move(index);
			});
		}
		//右侧导航定义样式
		function showStyle(){
			$('#pages li').css({
				'height':'5px',
				'width':'5px',
				'background':showBg,
				'margin-bottom':'10px',
				'padding':'2px',
				'borderRadius':'50%'
			})
			var i=0;
			$('#pages li').each(function(){
				$(this).attr({'data-ind':i++})
			})
			$('#pages').css({
				'position':'fixed',
				'right':'50px',
				'top':$(window).height()/2-$('#pages').height()/2+'px',
				'list-style':'none',
			});
		}
		//右侧导航选中样式
		function clickShow(){
			$($('#pages li')[index]).css({
				'background':clickShowBg
			}).siblings().css({
					'background':showBg
				})
		}
		
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
			clickShow(index)
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
			clickShow(index)	
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
})