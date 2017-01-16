var detailObj = Object.create(searchObj);
detailObj = $.extend(detailObj,{
    dom:$('#detail'),
	domInit:function(){
        this.id =location.hash.split('-')[1];
        this.lat = location.hash.split('-')[2];
        this.lng = location.hash.split('-')[3];
    },
	init: function(){
        this.domInit();
        this.loadHeaderInfo();
        this.loadResInfo();
        this.bindEvent(); 
        cartListObj.init(); //购物车列表页模块的初始化工作
	},
    foodListMap:{
        //食物列表映射表
    },
    cartListMap:{
        //购物车列表映射表
    },
    bindEvent: function(){
        var that=this;
        $('.navle-list').on('click','li',function(){
            $(this).addClass('food-active');
            $(this).siblings().removeClass('food-active');
            var selector = '[data-title="'+ this.innerHTML.split('<')[0] +'"]';
            var curelem = $(selector).get(0);
            rightScroll.scrollToElement(curelem, 500);
        });
        //数量增加
        $('.nav-right').on('click','.plus',function(){
            var curId = $(this).closest('.food-info').data('id');
            var curObj = that.foodListMap[curId];
            curObj.plus();
            if(!that.cartListMap[curId]) {
                cartListObj.addCart(curObj);
            }
            that.cartListMap[curId] = curObj;
            cartListObj.sTotalPrice(curObj,curId);
            that.carTotal();
            
        });
        //数量减少
        $('.nav-right').on('click','.minus',function(){
            var curId = $(this).closest('.food-info').data('id');
            var curObj = that.foodListMap[curId];
            curObj.minus();
            that.cartListMap[curId] = curObj; 
            //console.log(that.cartListMap)
            if(curObj.num === 0) {
                //删掉为0的已经选中过的单个购物车
                that.carTotal();
                cartListObj.deleteCart(curObj);
                $('.carcount').hide();
            }
            that.carTotal();
            cartListObj.sTotalPrice(curObj,curId);
        });

        $('.carticon,.cartfooter,.footMark').on('click',function(){
            cartListObj.toggle();
            return false;
        });
    },
    removeEvent:function(){
        $('.navle-list,.nav-right,.carticon,.footMark,.cartfooter,.carmessage-wrap,.carme-right,.carmessage-list').unbind('click');
    },
    //加载头部部分
    loadHeaderInfo: function(){
    	$.ajax({
    		url: '/shopping/restaurant/' + this.id,
    		data: {
    			extras: ['activities', 'album', 'license', 'statistics','identification'],
				latitude:this.lat,
				longitude:this.lng
    		},
    		success: function(res){
    		    //console.log(res);
                var imgpath = imagePath(res,0);
                var bgImg = 'https://fuss10.elemecdn.com/' + imagePath(res,0) +
                            '?imageMogr/quality/80/format/webp/thumbnail/!40p/blur/50x40/';

                $('.tip').html(res.promotion_info);  

                var str = 
                    '<div class="head-left">' +
                        '<img src="https://fuss10.elemecdn.com/'+imgpath+'" alt="">' +
                    '</div>' +
                    '<div class="head-right">' +
                        '<b>' + res.name + '</b>' +
                        '<p>'+
                            '<span>蜂鸟专送</span> / ' +
                            '<span><span>'+res.order_lead_time+'</span>分钟送达</span> / ' +
                            '<span>'+res.piecewise_agent_fee.description+'</span>' +
                        '</p>' +
                        '<p>'+res.activities[0].description+'</p>' +
                        '</div>' +
                    '</div>';
                $('.shopping-head').html(str);
                $('.shopping-header').css({'background':'url(' + bgImg + ') no-repeat','background-size':'cover'});
                $('.carget').html(res.piecewise_agent_fee.description);
    		}
    	});
    },
    //加载食品部分
    loadResInfo: function(){
    	var that = this;
    	$.ajax({
    		url: '/shopping/v2/menu?restaurant_id=' + this.id,
    		success: function(res){
                //console.log(res);
                that.renderLeftPane(res);
                that.renderRightPane(res);
    		}
    	});
    },
    //加载左边导航条部分
    renderLeftPane: function(list){	
		var str = "";
		for(var i = 0; i < list.length; i++) {
			str += '<li data-gId="'+ list[i].id +'">'+ list[i].name +'<span class="selectNum">2</span></li>';
		}
		$('.navle-list').html(str);
    },
    scrollInit:function(){
        window.leftScroll = new IScroll('.nav-left', {
            scrollbars: true, 
            preventDefault: false, //不阻止点击事件
            bounce: true, //弹
            fadeScrollbar:true//设置滚动条的谈入谈出效果。在hideScrollbar为true的时候有效
            
        });
        window.rightScroll = new IScroll('.nav-right', {
            scrollbars: false,
            probeType: 2,//设置滚动条的灵敏度,监听滚动的事件,有1,2,3三个值,3最灵敏
            preventDefault: false, //不阻止点击事件
            bounce: true,
        });
    },
    //加载右边部分
    renderRightPane: function(list){
        this.cacheData = Store(this.id); //取缓存
        //console.log(this.cacheData);
        //渲染食物列表
        var str = '<div class="food-wrapper">';
        for(var i = 0; i < list.length;i++){
            str += '<div class="food-item">'+
                       '<h2 data-title="'+ list[i].name +'">'+ list[i].name +'</h2>'+ 
                        this.renderSingleList(list[i].foods) +
                    '</div>';
        }
        str += '</div>';
        $('.nav-right').html(str);
        //初始化滚动条
        this.scrollInit();

        //楼梯效果        
        this.cacheMaplist = [];
        var sum = 0;
        var that = this;
        $('.food-item').each(function(index,elem){
            sum += $(elem).height();
            that.cacheMaplist.push(sum);
        });
        var leftItem = $('.navle-list').find('li');
        leftItem.eq(0).addClass('food-active');
        rightScroll.on('scroll',function(event){
            for(var i = 0; i < that.cacheMaplist.length; i++){
                if(Math.abs(rightScroll.y) <= that.cacheMaplist[i]){
                    leftItem.removeClass('food-active');
                    leftItem.eq(i).addClass('food-active');
                    break;
                }
            }
        });
       this.status();
    },

    renderSingleList: function(list){
        //console.log(list)
        var str='';
        for(var i = 0; i < list.length;i++){
            if(this.cacheData) {
                //如果缓存数据存在的话, 过去选中购物车列表的数据
                var foodid = list[i].specfoods[0].item_id;
                //console.log(foodid,this.cacheData[foodid]);
                if(this.cacheData[foodid]) {
                    list[i].num = this.cacheData[foodid].num;
                }
            }
            var foodListObj = new SingleFoodList(list[i]);
            this.foodListMap[foodListObj.id] = foodListObj;
            str += foodListObj.loadFoodList();
        }
        //console.log(this.foodListMap);
        return str;
    },
    carTotal:function(){

        //购物车的总数量c_num、总价格Total
        var totalNum = 0;
        var totalPrice = 0;
        this.smallTotalPrice=0;
        var sideSelectMap={};
        this.sideCount=0;

        for(var key in  this.cartListMap){
            var select='.navle-list [data-gId="'+ this.cartListMap[key].categoryId +'"]';
            totalNum += this.cartListMap[key].num;
            totalPrice += this.cartListMap[key].num * this.cartListMap[key].price;
           //侧边栏分类数目
            //console.log(!!!sideSelectMap[this.cartListMap[key].categoryId])
            if(!sideSelectMap[this.cartListMap[key].categoryId]){
                this.sideCount = this.cartListMap[key].num;
                sideSelectMap[this.cartListMap[key].categoryId] =  this.sideCount;
            }else{
                this.sideCount = this.sideCount + this.cartListMap[key].num;
                sideSelectMap[this.cartListMap[key].categoryId] =  this.sideCount;
            }
            if(sideSelectMap[this.cartListMap[key].categoryId]){
                $(select).find('.selectNum').html(sideSelectMap[this.cartListMap[key].categoryId]).show();  
            }else{
                $(select).find('.selectNum').hide();    
            }
        }

        parseInt(totalPrice) == totalPrice ? totalPrice = parseInt(totalPrice) : totalPrice = totalPrice.toFixed(1) ;
        $('.carcount').html(totalNum);
        $('.carprice').html('¥ '+totalPrice);


        if(totalNum !== 0){
            $('.carcount').show();
            $('.carticon img')[0].src = 'img/white.png';
        }else{
            $('.carcount').hide();
            $('.carticon img')[0].src = 'img/black.png';
        }

         //储存本地缓存
        Store(this.id, this.cartListMap);

        
    },
    enter: function(){
        this.dom.show();
        //初始化操作
        this.cartListMap = {};
        this.removeEvent();
        $('.carmessage-list').html('');
        $('.carcount').html(0);
        $('.carprice').html('¥ 0'); 
    },
    status: function(){
        if(this.cacheData) {
            this.cartListMap = this.cacheData;
            for(var key in this.cartListMap) {
                var curObj = this.foodListMap[this.cartListMap[key].id];
                curObj.num = this.cartListMap[key].num;
                //console.log(this.cartListMap[key]);
                cartListObj.addCart(curObj); //初始化的时候，添加购物车列表页
                cartListObj.sTotalPrice(this.cartListMap[key],this.cartListMap[key].id);
                $(this.cartListMap[key].selector).find('#activePane').show();
            }
            this.carTotal();
        }           
    }
});