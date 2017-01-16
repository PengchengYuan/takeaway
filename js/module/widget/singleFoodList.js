//单个购物车对象 

//会产生很多个单个购物车对象

//工厂模式  构造函数

function SingleFoodList(obj){
	this.categoryId=obj.category_id;
	this.image_path = obj.image_path;
	this.id = obj.item_id;
	this.name = obj.name;
	this.description= obj.description;
	this.price = obj.specfoods[0].price;
	this.num = obj.num || 0;
	this.selector = '[data-id="'+ this.id +'"]';
}
SingleFoodList.prototype.changeNum = function(){
	$(this.selector).find('.num').html(this.num);
	if(this.num === 0) {
		$(this.selector).find('#activePane').hide();
		return;
	}
	$(this.selector).find('#activePane').show();
};
SingleFoodList.prototype.plus = function(){
	this.num++;
	this.changeNum();
};
SingleFoodList.prototype.minus = function(){
	this.num--;
	this.changeNum(); 	
};
SingleFoodList.prototype.loadFoodList = function(){
	var path = this.image_path;
    var imgpath = path.substring(0,1)+'/'+path.substring(1,3)+'/'+path.substring(3) + '.' +path.substring(32);
    var  f='<img src="//fuss10.elemecdn.com/'+ imgpath +'" alt="">' || '';
    return '<div class="food-info" data-id="'+this.id+'" data-gId="'+  this.categoryId +'">'+
                '<div class="food-img">'+f+'</div>'+
                '<div class="food-txt">'+
                    '<b>'+this.name+'</b>'+
                    '<p>'+ this.description +'</p>'+
                    '<p class="month"><span>月销12份</span><span>好评率100%</span></p>'+
                    '<div class="pri">'+
                        '<div class="price">￥'+ this.price +'</div>'+
                        '<div class="num-area">'+
                        	'<div class="numWrap">'+
	                            '<div id="activePane">'+
	                                '<div class="minus">-</div><div class="num">' + this.num + '</div>'+
	                            '</div>'+
	                        '</div>'+
	                        '<div class="plus">+</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
};
SingleFoodList.prototype.loadCartList = function(){
	return '<div class="food-info" data-id="'+ this.id +'">'+
			    '<div class="food-txt">'+
			    	'<b>'+this.name+'</b>'+
			    	'<div class="pri">'+
			      		'<div class="price">￥'+ this.price +'</div>'+
			     		'<div class="num-area">'+
			       		 	'<div class="minus">-</div>'+
			        		'<div class="num">'+ this.num  +'</div>'+
			       		    '<div class="plus">+</div>'+
			      		'</div>'+
			    	'</div>'+
			    '</div>'+
			'</div>';
};