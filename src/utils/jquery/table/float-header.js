  import $ from 'jquery';
  import {nextTick} from 'vue';
 export function screenToTop(){
	  nextTick(() => {document.documentElement.scrollTop=0;});
 }
 export function checkVisiable(id){
	 return $("#"+id).is(":visible")
 }
 export function tableHeaderFloat(id){
	  nextTick(() => {
	  								function scrollHandler() {
										    var headers=$("#"+id).find(".el-table__header-wrapper");
											var bodys=$("#"+id).find(".el-table__body-wrapper");
											if(headers.length==0||bodys.length==0)return;
	  								        var tablehead= $(headers[0]);
	  								        var tablebody=$(bodys[0]);
											if(tablehead.length==0||tablebody.length==0)return;
	  								        var scroH = $(document).scrollTop();  //滚动高度
	  								        var viewH =  document.body.clientHeight;  //可见高度 
	  								        var contentH = document.body.scrollHeight;  //内容高度
	  										var headHeight=tablehead[0].clientHeight;
	  								        var mytop=parseInt(tablebody.offset().top)-(headHeight+headHeight);
	  														if(mytop==NaN){
	  															return ;
	  														}
	  														 if(mytop<0){
	  																	mytop=0;
	  															}
	  															 
	  								              if(scroH>mytop){
	  								            	  tablebody.css("margin-top",headHeight+ "px")
	  								            	  tablehead.addClass("floathead");
	  								              }else{
	  								            	   tablebody.css("margin-top",0) 
	  								            	   tablehead.removeClass("floathead");
	  								              }	          
	  									    }
	  					        	$(document).scroll(scrollHandler);
									scrollHandler();
	  				  });
  }
  