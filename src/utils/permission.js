import store from '@/store/index';
import $ from 'jquery';
import {CheckInputFloat,CheckInputInt} from '@/utils/index';
export  const hasPerm = {
    install:(app)=>{
		 app.directive('hasPerm', {
			  mounted(el, binding){
				  let flag=false;
					  var permissions=store.state.permissionStore.permission;
					  if(permissions){
						  if( binding.value){
							  const value = binding.value
							  flag = permissions.has(value) ;
						  }else{flag=false;}
					  } else{
						  flag=true;
					  }
				  
				  if (!flag) {
				      if (!el.parentNode) {
				          el.style.display = 'none'
				      } else {
				          el.parentNode.removeChild(el)
				      }
				  }
			  }
		 });
	}
}　

export  const dataType = {
    install:(app)=>{
		 app.directive('dataType', {
		 		 			  mounted(el, binding){
								  var $input=$(el).find("input");
								  if($input!=undefined&&$input.length>0){
									  var input=($(el).find("input"))[0];
									  const value =binding.arg?binding.arg:binding.value;
									  	  if(value=="float"){
											input.addEventListener('input',function(){
												this.value=CheckInputFloat(this.value);
												},true);
									  		 // input.oninput=function(){
									  		 // 	   this.value=CheckInputFloat(this.value)
									  		 // }
									  	  }
									  	  if(value=="int"){
											  input.addEventListener('input',function(){
											  	 this.value=CheckInputInt(this.value);
											  	},true);
									  		  // input.oninput=function(){
									  		  // 	   this.value=CheckInputInt(this.value)
									  		  // }
									  	  }
								  }
		 		 			  }
		 		 });
	}
}