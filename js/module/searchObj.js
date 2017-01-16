//每个模块（对象）它们都有自己属性以及方法
var searchObj = {
	name: '地址搜索页',
	dom: $('#address'),
	init: function(){
		//模块初始化的方法
		//alert(81)
		this.bindEvent();  //绑定它自己应该绑定的事件
		this.cityChange();	
	},
	cityChange:function(){
		var nowCity=decodeURI(location.hash.split('-')[1]);
		location.hash.indexOf('address') == -1 || nowCity == 'undefined'?$('.city-name a').html('上海'):$('.city-name').html(nowCity);
	},
	bindEvent: function(){
		//console.log('绑定事件');
		var button = $('#query');
		var baidu = $("#baidu");
		var that=this;
		// 饿了么的搜索
		button.click(function(event){
			//console.log('我被查询了');
			var word = $("#keyword").val();
			var ID=location.hash.split('-')[2];
			$.ajax({
				//url: '/v1/pois?city_id=1&keyword='+ word  +'&type=search',
				url: '/v1/pois',
				data: {
					city_id: ID || 1,
					keyword: word,
					type: 'search'
				},
				type: 'get',
				success: function(res){
					var str = "";
					for(var i =0; i < res.length; i++) {
						//console.log(res[i]);
						str += '<li><a href="#rlist-'+res[i].geohash+'-'+res[i].latitude+'-'+res[i].longitude+'-'+encodeURI(res[i].name)+'">'+ res[i].name +'</a></li>';
					}	
					$("#list").html(str);
				},
				error: function(){
					//console.log('我请求失败了');	 	
				}
			});
		});

		//百度外卖的搜索
		baidu.click(function(event){
			//console.log('百度外卖搜索');
			var word = $("#keyword").val();
			var ID=location.hash.split('-')[3];
			//console.log(ID);
			$.ajax({
				url: '/waimai',
				dataType: 'json',
				data: {
					qt:'poisug',
					wd: word,
					cb:'suggestion_1483600579740',
					cid:ID ||289,
					b:'',
					type:0,
					newmap:1,
					ie:'utf-8'
				},
				success: function(res){
					//console.log(res);
					//console.log('我请求成功了');
					var str = "";
					for(var i =0; i < res.s.length; i++) {
						str += '<li>'+ res.s[i] +'</li>';
					}	
					$("#list").html(str);	 	
				},
				error: function(res){
					console.log('我请求失败了');	 	
				}
			});
		});
	},
	enter: function(){
		//进入该模块
		this.dom.show();
	},
	leave: function(){
		//离开该模块
		this.dom.hide(); 
		cacheMap['rlist'] = false;
		cacheMap['detail'] = false;
		
		$('#ranList').html('');
	}
};