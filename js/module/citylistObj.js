
var citylistObj = Object.create(searchObj); //原型继承
citylistObj  = $.extend(citylistObj, {
	name: '城市选择页',
	dom: $('#citylist'),
	cityObj:{},
	isload:true,
	init:function () {
		//console.log(this.isload);
		if(this.isload){
			this.loadBaiDuCity();
			this.isload=false;
		}
	},
	loadHotCity:function(){
		that=this;
		$.ajax({
			//url: https://mainsite-restapi.ele.me/v1/cities?type=hot,
			url: '/v1/cities?type=hot',
			type:'get',
			success: function(res){
				var str = "",
					cityNameCode;
				for(var i =0; i < res.length; i++) {
					cityNameCode=encodeURI(res[i].name);
					var bCityId=that.cityObj[res[i].name];
					//console.log(res[i]);
					str += '<p><a href="#address-'+cityNameCode+'-'+res[i].id+'-'+bCityId+'">'+ res[i].name +'</a></p>';
				}
				$(".hotCity .bottom").html(str);
			},
			error: function(){
				console.log('我请求失败了');	 	
			}
		});
	},
	loadBaiDuCity:function(){
		console.log('正在获取地理数据')
		var that=this;
		$.ajax({
			//url: http://waimai.baidu.com/waimai?qt=getcitylist&format=1&t=1483713018080,
			url: '/waimai',
			dataType:'json',
			data:{
				qt:'getcitylist',
				format:1,
				t:'1483713018080'
			},
			type:'get',
			success: function(res){
				var obj=res.result.city_list;
				var arr=[];
				for(var i in obj){
					arr=arr.concat(obj[i]);
				}
				//console.log(arr)
				for(var j in arr){
					that.cityObj[arr[j].name]=arr[j].code;
				}
				//console.log(that.cityObj)
				that.loadHotCity();
				that.loadAllCity();
			},
			error: function(){
				console.log('我请求失败了');	 	
			}
		});		
	},
	loadAllCity:function(){
		var arr=[],str='';
		$.ajax({
			//url: https://mainsite-restapi.ele.me/v1/cities?type=group
			url: '/v1/cities?type=group',
			type:'get',
			success: function(res){
				//console.log(res);
				for ( var i in res ){
					arr.push(i);
					arr.sort();
				}
				//console.log(arr);
				for ( var j in arr ){
					str += '<div class="top"><p>'+arr[j]+'</p></div>';
					str += '<div class="bottom">';
					for(var k=0;k<res[arr[j]].length;k++){
						//console.log(res[arr[j]][k])
						var eCityId=res[arr[j]][k].id;
						var bCityId=that.cityObj[res[i].name];
						str +='<p><a href="#address-'+ res[arr[j]][k].name +'-'+ eCityId +'-'+bCityId+'">'+res[arr[j]][k].name+'</a></p>';
					}
					str += '</div>';
				}
				$('.otherCity').html(str);
			},
			error: function(){
				console.log('我请求失败了');	 	
			}
		});
	}
});
