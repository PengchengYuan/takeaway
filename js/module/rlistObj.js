
var rlistObj = Object.create(searchObj); //原型继承
//$.extend 进行对象与对象的合并
rlistObj  = $.extend(rlistObj, {
	name: '餐厅列表页',
	dom: $('#rlist'),
    isjia:true,
    lastLi:0,
    num:0,
    loadBanner:function(){
        console.log('发送banner请求');
        $('.area a').html(decodeURI(location.hash.split('-')[4]));
        var geohash=location.hash.split('-')[1];
        $.ajax({
            url: '/v2/index_entry',
            dataType: 'json',
            data: {
               geohash:geohash,
               group_type:1,
               flags:['F']
            },
            success: function(res){
                var str1='';
                var str2='';
                for(var i=0;i<8;i++){
                    str1+='<a href=""><div class="container"><img src="//fuss10.elemecdn.com/'+res[i].image_url+'"></div><span class="title">'+res[i].title+'</span></a>';
                }
                $('#rlist .banner .first').html(str1);
                for(var j=8;j<res.length;j++){
                    str2+='<a href="'+res[j].link+'"><div class="container"><img src="//fuss10.elemecdn.com/'+res[j].image_url+'"></div><span class="title">'+res[j].title+'</span></a>';
                }
                $('#rlist .banner .second').html(str2);
                console.log('加载完成'); 
            },
            error: function(res){
                console.log('504,请联系后台那娃');      
            }
        });
    },
    loadShop:function(num){
        var that=this;
        console.log('发送goods请求');
        var latitude=location.hash.split('-')[2];
        var longitude=location.hash.split('-')[3];
        $.ajax({
            url: '/shopping/restaurants',
            dataType: 'json',
            data: {
               latitude:latitude,
               longitude:longitude,
               offset:num,
               limit:20,
               extras:['activities']
            },
            success: function(res){
                var str='';
                for(var i=0;i<res.length;i++){
                    var image_path=imagePath(res,i);
                    var distance=res[i].distance;
                    distance=distance>1000?(distance/1000).toFixed(2)+'km':distance+'m';

                    str+='<li class="item" data-id="'+res[i].id+'" data-lat="'+res[i].latitude+'" data-lon="'+res[i].longitude+'"><div class="left-wrap"><img class="logo" src="http://fuss10.elemecdn.com/'+image_path+'"></div><div class="right-wrap"><div class="line"><h3 class="shopname">'+res[i].name+'</h3></div><div class="line"><div class="moneylimit"><span>¥'+res[i].float_minimum_order_amount+'起送</span><span>配送费约¥'+res[i].float_delivery_fee+'</span></div><div class="timedistance-wrap"><span class="distance-wrap">'+distance+'</span><span class="time-wrap">'+res[i].order_lead_time+'分钟</span></div></div></div></li>';

                }
                $('#ranList').append(str);
                that.bindEvent();
                that.isjia=true;
                console.log('加载完成'); 
            },
            error: function(res){
                console.log('504,请联系后台那娃');      
            }
        });
    },
    bindEvent:function(){
        var that=this;
        that.lastLi=$('#ranList').children().eq($('#ranList').children().length-1);
        $(window).scroll(function(){
            //按需加载
            if($('body').scrollTop()+$(window).height()>that.lastLi.offset().top){
                //console.log(that.isjia);
                if(that.isjia){
                    that.num = that.num+20;
                    //console.log(that.num);
                    that.loadShop(that.num);
                    that.isjia = false;
                }
            }
            //返回顶部显现
            if($('body').scrollTop()){
                $('#rlist .returnTop .return').show();
            }else{
                $('#rlist .returnTop .return').hide();
            }
        });
        //返回顶部点击
        $('#rlist .returnTop .return').on('click',function(){
            $('body').scrollTop(0);
        });

        //餐厅列表点击跳转（传id、经纬度）
        $('#ranList').on('click','li',function(){
            //console.log(this);
            var Id = this.dataset.id;
            var lat = this.dataset.lat;
            var lon = this.dataset.lon;
            location.href = '#detail-' + Id + '-' + lat + '-' +lon;

        });
    },
    //banner图
    banner:{
        first:$('.first')[0],
        second:$('.second')[0],
        bindEvent:function(){
            var that=this;
            var wrap=$('#rlist .bannerWrap')[0];
            var startLeft,moveLeft,endLeft;
            wrap.addEventListener('touchstart', function(event) {
                //console.log(event);
                if (event.targetTouches.length == 1) {
            　　　　event.preventDefault();
                    startLeft=event.targetTouches[0].pageX;
                    //console.log(startLeft);
                }
            }, false); 
            wrap.addEventListener('touchmove', function(event) {
                if (event.targetTouches.length == 1) {
            　　　　event.preventDefault();
                    var touch = event.targetTouches[0];
                    moveLeft=touch.pageX;
                    if(moveLeft>startLeft){
                        wrap.style.marginLeft = '-16rem';
                        that.first.style.left= '0';
                        that.second.style.left='-16rem';
                    }else{
                        wrap.style.marginLeft = '0';
                        that.first.style.left= '0';
                        that.second.style.left='16rem';
                    }
                    wrap.style.marginLeft = touch.pageX-startLeft + 'px';
                }
            }, false);
            wrap.addEventListener('touchend', function(event) {
                //console.log(1)
        　　　　event.preventDefault();
                endLeft=event.changedTouches[0].pageX;
                var half=1/2*$(window).width();
                var cha=startLeft-endLeft;
                var yu =startLeft-cha;
                wrap.style.transition='0.5s margin-left';
                //左移
                if(startLeft>endLeft){
                    if(startLeft-endLeft>half){
                        wrap.style.marginLeft='-16rem';
                        that.changeColor();
                        setTimeout(function(){
                            wrap.style.transition='0s margin-left';
                            that.first.style.left= '16rem';
                            that.second.style.left=0;
                            wrap.style.marginLeft = 0;
                            that.tihuan();
                        },500);
                    }else{
                        wrap.style.marginLeft='0';
                        setTimeout(function(){wrap.style.transition='0s margin-left';},500);
                    }
                //右移
                }else{
                    if(endLeft-startLeft>half){
                        wrap.style.marginLeft='16rem';
                        that.changeColor();
                        setTimeout(function(){
                            wrap.style.transition='0s margin-left';
                            that.first.style.left= 0;
                            that.second.style.left='16rem';
                            wrap.style.marginLeft = '-16rem';
                            that.tihuan();
                        },500);
                    }else{
                        wrap.style.marginLeft= 0;
                        setTimeout(function(){wrap.style.transition='0s margin-left';},500);
                    }
                }
            }, false);
        },
        //两页对倒
        tihuan:function(){
            if(this.first==$('.second')[0]){
                this.first=$('.first')[0];
                this.second=$('.second')[0];
            }else{
                this.first=$('.second')[0];
                this.second=$('.first')[0];
            }
        },
        changeColor:function(){
            var mFirst=$('#rlist .banner .mark .mFirst');
            mFirst.css('background-color')=='rgb(221, 221, 221)'?
            mFirst.css('background-color','#999').siblings().css('background-color','#ddd'):
            mFirst.css('background-color','#ddd').siblings().css('background-color','#999');
        },
        init:function(){
            this.bindEvent();
        }
    },
    init:function(){
        this.loadBanner();
        this.loadShop(0);
        this.banner.init();
    }
});

