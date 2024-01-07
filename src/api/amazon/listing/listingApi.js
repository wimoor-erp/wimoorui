import request from "@/utils/request";
function amzProductRefresh(){
	 return request.get('/amazon/api/v1/report/product/productInfo/createpojo');
}
function getProductInfoWithFnSKU(data){
	 return request.post('/amazon/api/v1/report/product/productInfo/getProductInfoWithFnSKU',data);
}
function searchCatalogProducts(data){
	 return request.post('/amazon/api/v1/report/product/amzProductRefresh/searchCatalogProducts',data);
}
export function pushAsin(data){
 	 return request.post("/amazon/api/v1/report/product/listing/pushAsin",data)
 }
export function saveAsin(data){
 	 return request.post("/amazon/api/v1/report/product/listing/saveAsin",data)
 }
export function deleteSku(data){
  	 return request.post("/amazon/api/v1/report/product/listing/deleteSku",data)
  }
export function getSku(data){
    	 return request.post("/amazon/api/v1/report/product/listing/sku",data)
    }
export function refreshInfoBySKU(data){
  	 return request.get("/amazon/api/v1/report/product/listing/refreshInfoBySKU",{params:data})
  }
export function getPriceRecord(data){
  	 return request.get("/amazon/api/v1/product/priceRecord/getPriceRecord",{params:data})
  }
export function findAsin(data){
    	 return request.post("/amazon/api/v1/report/product/listing/findAsin",data)
    }
export function findAsinInfo(data){
    	 return request.post("/amazon/api/v1/report/product/listing/findAsinInfo",data)
    }
function recordFollowList(data){
    	 return request.post("/amazon/api/v1/report/product/listing/recordFollowList",data)
    }
function changePrice(data){
	 return request.post("/amazon/api/v1/report/product/listing/changePrice",data)
} 
 

export default{
	amzProductRefresh,getProductInfoWithFnSKU,searchCatalogProducts,pushAsin,findAsinInfo,
	getPriceRecord,saveAsin,deleteSku,refreshInfoBySKU,getSku,recordFollowList,changePrice
} 