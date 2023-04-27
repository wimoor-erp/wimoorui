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

export default{
	amzProductRefresh,getProductInfoWithFnSKU,searchCatalogProducts,
} 