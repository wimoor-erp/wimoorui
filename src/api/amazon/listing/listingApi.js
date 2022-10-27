import request from "@/utils/request";
function amzProductRefresh(){
	 return request.get('/amazon/api/v1/report/product/productInfo/createpojo');
}

export default{
	amzProductRefresh,
} 