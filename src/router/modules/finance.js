/** When your routing erp is too long, you can split it into small modules **/
export default [

  {
  	path:"f/p/d",
  	name:'paymentRequest_details',
  	component:()=>import("@/views/finance/paymentRequest/components/details")  
  },
  {
  	path:"f/c/c",
  	name:'costSharing_create',
  	component:()=>import("@/views/finance/costSharing/components/create")  
  },
  {
  	path:"f/j/e",
  	name:'jobCosting_edit',
  	component:()=>import("@/views/finance/jobCosting/components/edit")  
  },

]
