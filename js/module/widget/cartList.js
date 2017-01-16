/*

购物车列表 模块（组件）

对已经添加到购物车中的商品 进行展示以及 计算

*/
cartListObj={
	domInit:function(){
		this.$dom = $('.carmessage-wrap');
		this.$clear = $('.carme-right');
		this.$list = $('.carmessage-list');
	},
	init:function(){
		this.domInit();
		this.bindEvent();	
	},
	bindEvent:function(){
		var that=this;
		this.$clear.on('click', function(event){
			that.removeCart();
			detailObj.sideCount=0;
			detailObj.carTotal();
			$('.selectNum').hide(); 	 	
		});

		this.$dom.on('click', '.plus', function(event){
			var curId = $(this).closest('.carmessage-list .food-info').data('id');
			var curObj = detailObj.foodListMap[curId];
			curObj.plus();
			detailObj.cartListMap[curId] = curObj;
			detailObj.carTotal();
			that.sTotalPrice(curObj,curId);
		});

		this.$dom.on('click', '.minus', function(event){
			var curId = $(this).closest('.carmessage-list .food-info').data('id');
			var curObj = detailObj.foodListMap[curId];
			curObj.minus();
			detailObj.cartListMap[curId] = curObj; //进行更新
			detailObj.carTotal();
			that.sTotalPrice(curObj,curId);
			if(curObj.num === 0) {
				that.deleteCart(curObj);
				Store(detailObj.id, detailObj.cartListMap);
				return;
			}
			//储存本地缓存
        	
		});
	},
	addCart:function(obj){
		//添加购物车	
		var str = obj.loadCartList(obj.num);
		this.$list.append(str);	 	
	},
	deleteCart:function(curCartObj){
		this.$list.find(curCartObj.selector).remove();
		delete detailObj.cartListMap[curCartObj.id]; 

	},
	removeCart:function (){
		//清空购物车
		for(var key in detailObj.cartListMap) {
			var curObj = detailObj.cartListMap[key];
			var foodid = curObj.id;
			detailObj.foodListMap[foodid].num = 0;
			$(curObj.selector).find('.minus').hide();
			$(curObj.selector).find('.num').hide();
			this.deleteCart(detailObj.cartListMap[key]);
		} 	
		this.toggle();
	},
	cartShow:function (){
		this.$dom.show();
	},
	toggle:function (){
		this.$dom.toggle().parent().parent().prev().toggle();
		//console.log(this.$dom.parent().parent().prev());
	},
	cartHide:function (){
		this.$dom.hide();	 	
	},
	sTotalPrice:function(curObj,curId){
		var $price = $('.shopping-footer [data-id="'+ curId +'"]').find('.price');
		var sTPrice = curObj.num * curObj.price;
		//console.log(curObj.num,curObj.price,sTPrice)
		parseInt(sTPrice) === sTPrice ? sTPrice = parseInt(sTPrice) : sTPrice = sTPrice.toFixed(1)
		$price.html('¥ ' + sTPrice);
	}

};
