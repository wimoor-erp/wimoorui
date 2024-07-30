export default function(url){
	/*    if(url&&url.indexOf("@")==0){
			url=url.replace("@","/src");
		} */
		return new URL(`../../assets/image/${url}`, import.meta.url).href;
	}
