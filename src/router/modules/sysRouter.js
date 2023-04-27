/** When your routing erp is too long, you can split it into small modules **/
import Login from '@/views/sys/Login.vue'
import Register from '@/views/sys/Register.vue'
import ResetPassword from '@/views/sys/userCenter/resetPassword.vue'
import SSOLogin from '@/views/sys/SSOLogin.vue'
import OrderBlank from '@/views/erp/ship/orderblank/index.vue'
import AuthResult from '@/views/amazon/storeAuth/authResult/index.vue'
import AdvResult from '@/views/amazon/storeAuth/advResult/index.vue'
export default [
  {
	 path: '/ssologin',
	 name: 'SSOLogin',
	 component:SSOLogin
   },
  {
    path: '/login',
    name: 'Login',
    component:Login  
  },
  {
    path: '/register',
    name: 'Register',
    component:Register
  },
  {
    path: '/resetPassword',
    name: 'ResetPassword',
    component:ResetPassword
  },
  {
    path: '/orderblank',
    name: 'OrderBlank',
    component:OrderBlank
  },
  {
    path: '/authresult',
    name: 'AuthResult',
    component:AuthResult
  },
  {
    path: '/advresult',
    name: 'AdvResult',
    component:AdvResult
  },
]
