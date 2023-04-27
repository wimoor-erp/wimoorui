import router from "@/router";
import store from '@/store/index';
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

/**
 * 
        app.directive('hasPerm', {
            mounted(el, binding){
                        console.log(router.currentRoute.value.fullPath);
　　　　　　　　　 // roles的值，应为string数组，存放角色列表  例子：['user','proxy']
                // 也可以根据自己的逻辑修改store.getters['acl/role']
				
                const permissions = ['a','b','c']

　　            // 使用插件时，绑定的值
                const value = binding.value
                let flag =(value.filter(v=>permissions.includes(v))).length > 0;
                if (!flag) {
                    if (!el.parentNode) {
                        el.style.display = 'none'
                    } else {
                        el.parentNode.removeChild(el)
                    }
                }

            }
        })
    
 */