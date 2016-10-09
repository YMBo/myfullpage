$(function(){
	(function($){
		//初始化
		//移动端meta
		//初始化
		$(document.head).append('<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">')
		$(document.body).css({'overflow':'hidden'})
		//添加父元素
		$('#pagepiling').wrap('<div class="pagepilingBox"></div>');
		begin();
		function begin(){
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
		}
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
			//右侧导航默认颜色
			'clickShowBg':'rgba(238,238,238,.7)',
			//时间默认 500
			'duration':500,
			//是否显示滚动条
		 	'scrollBar':false,
		 	//滚动条颜色
		 	'scrollBarBg':'rgba(0,0,0,.8)'
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
		var scrollBarBg;
		var showScrollBar;
		//右侧导航边框颜色
		var showBg;
		var SP=$.fn.fullPage=function(options){
			opts=$.extend({},defaults,options||{});
			container=$(opts.container);
			dur=opts.duration;
			show=opts.show;
			showBg=opts.showBg;
			showScrollBar=opts.scrollBar;
			clickShowBg=opts.clickShowBg;
			scrollBarBg=opts.scrollBarBg;
			sections=container.children(opts.sections);
			sections.each(function(){
				arrElement.push($(this));
			})
			full();
			SP.show();
			showStyle();
			clickShow();
			SP.showScrollBarD();

		};
		//判断是否显示滚动条
		SP.showScrollBarD=function(){
			if(showScrollBar){
				showBar();
				showBar.drag();
			}else{
				return;
			}
		}
		//是否显示滚动条
		function showBar(){
			var bar='<div id="scrollBarBox" ><div class="scrollBar" unselectable="on" style="-moz-user-select:none "></div></div>';
			$('#pagepiling').after(bar);
			$('#scrollBarBox').css({
				'width':'6px',
				'height':$(window).height()+'px',
				'position':'absolute',
				'right':'0',
				'top':'0',

			})
			showBar.beginBar();
		}
		showBar.beginBar=function(){
			$('#scrollBarBox .scrollBar').css({
				'width':'6px',
				'height':$(window).height()/arrElement.length+'px',
				'position':'absolute',
				'background':scrollBarBg,
				'borderRadius':'4px',
				'cursor':'pointer',
				'overflow':'hidden'
			})
		}
		//滚动条移动效果
		function showBarMove(index){
			$('#scrollBarBox .scrollBar').stop().animate({
				'top':index*$('#scrollBarBox .scrollBar').height()+'px',
			},dur)
		}

		//拖动滚动条
		showBar.drag=function(event){
			var t;
			var gradon=false;
			var current;
			var currentTop=0;
			//禁止选中，要不没有这句话，就会有选中的问题
			document.body.onselectstart = function(){return false};
			$('#scrollBarBox .scrollBar').mousedown(function(event){
				gradon=true;
				cY=event.clientY;
				t=event.clientY-parseInt($(this).css('top'));
				$(document).mousemove(function(event){
				if(gradon){
					if(event.clientY>cY){
						current=event.clientY-t>=(arrElement.length-1)*parseInt($('#scrollBarBox .scrollBar').css('height'))?(arrElement.length-1)*parseInt($('#scrollBarBox .scrollBar').css('height')):event.clientY-t;
					}else{
						current=event.clientY-t>=0?event.clientY-t:0;
					}
						$('#scrollBarBox .scrollBar').css({'top':current+'px'});
						}
					})
				})
			$(document).mouseup(function (){
				if(gradon){
					gradon=false;
				            $(this).unbind("mousemove")
				//判断滚动条的位置
				currentBarCenter=$('#scrollBarBox .scrollBar').offset().top+$('#scrollBarBox .scrollBar').height()/2;
				for(var i=0;i<arrElement.length;i++){
					if(currentBarCenter>=i*$('#scrollBarBox .scrollBar').height()&&currentBarCenter<(i+1)*$('#scrollBarBox .scrollBar').height()){
						index=i;
						showBarMove(index);
						SP.move(index);
						clickShow(index);
					}
				}
			/*	showBarMove(index);*/

				}
			}); 
		}
		//右侧导航函数
		SP.show=function(){
			if(show){
				var pageHtml = '<ul id="pages"><li></li>';
				for(var i=1;i<arrElement.length;i++){
					pageHtml+='<li></li>'
				}
				pageHtml += '</ul>';
				$('#pagepiling').after(pageHtml);
				clickShow(index);
				//为每个小圆点绑定事件(事件委托)
				$("#pages").delegate("li","click",function(){
					index=$(this).attr('data-ind');
					clickShow(index);
					SP.move(index);
				});
			}else{
				return;
			}
		}
		//右侧导航定义样式
		function showStyle(){
			$('#pages li').css({
				'height':'8px',
				'width':'8px',
				'background':showBg,
				'margin-bottom':'10px',
				'borderRadius':'50%'
			})
			var i=0;
			$('#pages li').each(function(){
				$(this).attr({'data-ind':i++})
			})
			showPosi();
		}

		//右侧导航定位
		function showPosi(){
			$('#pages').css({
				'position':'fixed',
				'right':'10px',
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
			if(showScrollBar){
					showBarMove(index);
				}
		}
		
		//向上滑动事件
		SP.moveUp=function(){
			if(flag){
				if(index<=(arrElement.length-1)&&index>0){
					index--;
					SP.move(index);
				}else if(opts.loop){
					index=(arrElement.length-1);
					SP.move(index);
				}
				if(show){
					clickShow(index);
				}
				
			}else{
				return;
			}
			
		}
		//向下滑动事件
		SP.moveDown=function(){
			if(flag){
				if(index<(arrElement.length-1)&&index>=0){
					index++;

				}else if(opts.loop){
					index=0;
				}
				if(show){
					clickShow(index);
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
			//右侧小圆点导航重置
			showPosi();
			begin();
			showBar.beginBar();
			showBarMove(index);
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