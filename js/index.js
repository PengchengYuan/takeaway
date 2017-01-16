function imagePath(res,i){
	var path='';
	//console.log(!res[i],res.image_path);
	!res[i] ? path = res.image_path || '37af355a5330e52b85487780a5c4b518png': path = res[i].image_path;

	return (path.substring(0,1)+'/'+path.substring(1,3)+'/'+path.substring(3) + '.' +path.substring(32));
}
function Store(nameSpace, data){
	//多态  用同一个API,去实现不同方法（存、取操作）
	if(data) {
		//存操作
		localStorage.setItem(nameSpace, JSON.stringify(data));
		return;
	}
	return JSON.parse(localStorage.getItem(nameSpace));	 	
}
//更进一步的路由的实现
//采用js模块化开发的手段进行项目的路由设计

//模块化开发，首先你要确定模块，对你项目功能进行抽象

//因为我们项目中，有4个不同的页面，在我眼中 就会有4个不同的模块，面向对象的方式
/*
searchObj 地址搜索页面对象

rlistObj 商家列表页对象

detailObj 餐厅详情页对象

citylistObj 城市选择页对象


关键性的难题？  模块与模块之间怎么联系在一起？*/


//创建一个hash值 与模块 映射关系表
var hashMap = {
	'address': searchObj,
	'rlist': rlistObj,
	'detail': detailObj,
	'citylist': citylistObj
};

//hashMap.address  //searchObj
//hashMap['address'] //searchObj

var cacheMap = {
	//判断模块是否初始化的映射关系表
};
var prevModule = null; //前一个模块
var curModule = null;  //当前模块
var hash = location.hash;
if(hash) {
	if(hash.indexOf('citylist')!==-1){
		routeController('citylist');
	}else if(hash.indexOf('rlist')!==-1){
		routeController('rlist');
	}else if(hash.indexOf('detail')!==-1){
		routeController('detail');
	}else{
		routeController(hash);
	} 
}else{
	routeController('citylist');
}
window.onhashchange = function(){
	var hash = location.hash.slice(1); //#address
	if(hash.indexOf('rlist')!==-1){
		routeController('rlist');
	}else if(hash.indexOf('citylist')!==-1){
		routeController('citylist');
	}else if(hash.indexOf('detail')!==-1){
		routeController('detail');
	}else{
		routeController(hash);
	} 	 	
};
function routeController(hash){
	var khash = '';
	var module = hashMap[hash] || citylistObj; // 得到对应hash值的对应的模块对象
	//module = searchObj module = citylistObj
	if(hash.indexOf('address') !== -1) {
		module = searchObj;
		khash = 'address';
		module.cityChange(hash); //改变城市
	}else if(hash.indexOf('rlist') !== -1) {
		khash = 'rlist';
		module = rlistObj;
	}else if(hash.indexOf('detail') !== -1) {
		khash = 'detail';
		module = detailObj;
	}
	//接着我们需要维护好前一个与当前模块的关系？
	prevModule = curModule; //prevModule = null  prevModule = searchObj
	curModule = module; // curModule = searchObj  curModule = citylistObj
	if(prevModule) {
		prevModule.leave(); //searchObj.leave()
	}
	//console.log(curModule);
	curModule.enter();
	//hash = address-天津  khash = address
	//hash = address-上海  khash = address
	if(!cacheMap[khash]) {
		//该模块没有被初始化过
		curModule.init();
		cacheMap[khash] = true;
	}
	//curModule.init(); //执行当前模块的初始化操作

}