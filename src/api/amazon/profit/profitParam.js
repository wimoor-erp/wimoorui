import request from "@/utils/request";

function getFBA(data){
	return request.post('/amazon/api/v1/profit/profitParam/getFBA',data );
}
 
function updateFBA(data){
  	return request.post('/amazon/api/v1/profit/profitParam/updateFBA',data);
  }
  
function saveFBA(data){
    	return request.post('/amazon/api/v1/profit/profitParam/saveFBA',data);
}
function deleteFBA(data){
    	return request.post('/amazon/api/v1/profit/profitParam/deleteFBA',data);
}
  
function getTier(data){
	return request.get('/amazon/api/v1/profit/profitParam/getTier',{params:data });
}
  
function getTierFormat(data){
	return request.post('/amazon/api/v1/profit/profitParam/getTierFormat',data );
}
 
function saveTierFormat(data){
  	return request.post('/amazon/api/v1/profit/profitParam/saveTierFormat',data);
  }
  
function updateTierFormat(data){
    	return request.post('/amazon/api/v1/profit/profitParam/updateTierFormat',data);
}
function deleteTierFormat(data){
    	return request.post('/amazon/api/v1/profit/profitParam/deleteTierFormat',data);
}
 
 function getTierPage(data){
 	return request.post('/amazon/api/v1/profit/profitParam/getTierPage',data );
 }
  
 function saveTier(data){
   	return request.post('/amazon/api/v1/profit/profitParam/saveTier',data);
   }
   
 function updateTier(data){
     	return request.post('/amazon/api/v1/profit/profitParam/updateTier',data);
 }
 function deleteTier(data){
     	return request.post('/amazon/api/v1/profit/profitParam/deleteTier',data);
 }
 	 
export default{
	 getFBA,updateFBA,getTier,saveFBA,deleteFBA,
	 getTierFormat,saveTierFormat,updateTierFormat,deleteTierFormat,
	 getTierPage,saveTier,updateTier,deleteTier
}