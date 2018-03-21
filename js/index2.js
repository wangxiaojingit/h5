let loadingFn=(function(){
    $loadingbox=$(".loadingbox");
    $run=$loadingbox.find(".run");
    //计算图片加载真实进度,一般我们加载主要是看图片的进度,在这里我们获取img文件下的所有图片,看进度
    let loadPress=function(){
        let imglist=["img/icon.png","img/zf_concatAddress.png","img/zf_concatInfo.png","img/zf_concatPhone.png","img/zf_course.png","img/zf_course1.png","img/zf_course2.png","img/zf_course3.png","img/zf_course4.png","img/zf_course5.png","img/zf_course6.png","img/zf_cube1.png","img/zf_cube2.png","img/zf_cube3.png","img/zf_cube4.png","img/zf_cube5.png","img/zf_cube6.png","img/zf_cubeBg.jpg","img/zf_cubeTip.png","img/zf_emploment.png","img/zf_messageArrow1.png","img/zf_messageArrow2.png","img/zf_messageChat.png","img/zf_messageKeyboard.png","img/zf_messageLogo.png","img/zf_messageStudent.png","img/zf_outline.png","img/zf_phoneBg.jpg","img/zf_phoneDetail.png","img/zf_phoneListen.png","img/zf_phoneLogo.png","img/zf_return.png","img/zf_style1.jpg","img/zf_style2.jpg","img/zf_style3.jpg","img/zf_styleTip1.png","img/zf_styleTip2.png","img/zf_teacher1.png","img/zf_teacher2.png","img/zf_teacher3.jpg","img/zf_teacher4.png","img/zf_teacher5.png","img/zf_teacher6.png","img/zf_teacherTip.png"]
        let total=imglist.length;
        let cur=0;//当前加载图片的个数
        for(let i=0;i<imglist.length;i++){
           let current=imglist[i];
           let tempImg=new Image;
           tempImg.src=current;
           tempImg.onload=function(){
               cur++;
               tempImg=null;
               $run.css("width",cur/total*100+"%");
               if(cur>=total){
               let delayTime=window.setTimeout(()=>{
                    $loadingbox.remove();
                    phoneRender.init();
                    window.clearTimeout(delayTime);
                 },1500)
                 
               }
           }
        }
    }
    return {
        init:function(){
            $loadingbox.css("display","block");
            loadPress()
        }
    }
})(Zepto)


let phoneRender=(function($){
    
    let $phonebox=$(".phonebox");
    let $listenbox=$phonebox.find(".listenbox");
    let $touch=$listenbox.find(".touch");
    let $detailsbox=$phonebox.find(".detailsbox");
    let $detailtouch=$detailsbox.find(".touch")
    let $time=$phonebox.find(".time");
    let bell=$("#bell")[0];
    let say2=$("#say2")[0];

    let $phonePlan=$.Callbacks();
    //让bell音乐暂停
    $phonePlan.add(function(){
        bell.pause();//让bell音乐暂停
       
    })
    //控制phone的接听区域出现
    $phonePlan.add(function(){
        $listenbox.css("display","none");
        $detailsbox.css("transform",'translateY(0)');
        
    })

    //让音频开始播放,并且出现time
    $phonePlan.add(function(){
        say2.play();
        $time.css("display","block");
        
        let timer=window.setInterval(()=>{
            let total=say2.duration;
            let current=say2.currentTime;//当前播放的时长
            let minutes=Math.floor(current/60);
            let second=Math.floor(current%60);
            minutes<10 ? minutes="0"+minutes:null;
            second<10 ? second="0"+second:null;
            $time.html(`${minutes}:${second}`);
            //当播放完的时候清除定时器进去到下个页面
            if(current>=total){
             clearInterval(timer);
             enterNext();
            }
        },1000)
        
    })
    $phonePlan.add(()=>{
        $detailtouch.tap(()=>{
            enterNext();
        })
    })
     //进入到下一个页面
     let enterNext=function(){
        bell.pause();
        say2.pause();
        $phonebox.remove();
        messageboxRender.init()

     }
    return {
        init:function(){
            $phonebox.css("display","block");
            //让音乐自动播放
            bell.play();
            //给touch 绑定点击事件(接听电话)
            $touch.tap($phonePlan.fire)
            
        }
    }
})(Zepto)



let messageboxRender=(function($){
    let $messagebox=$(".messagebox");
    let $tokenlists=$messagebox.find(".tokenlists");
    let $keybord=$messagebox.find(".keybord");
    let $send=$keybord.find(".send");
    let $lists=$tokenlists.find("li");
    let $text=$keybord.find("span");
    let $plane=$.Callbacks();
    let $audio=$messagebox.find("audio");
    //让对话一个个出现
    let num=-1,timerMe=null,messY=0;
    //文字打印效果
    let textfn=function(){
        let n=-1;
        let $texts=$text.html();
        console.log($texts);
        $text.html('')
        $text.css("display","block");
        let timer=setInterval(()=>{
            n++;
            let code=$texts[n];
            $text[0].innerHTML+=code;
            if(n>=$texts.length-1){
                clearInterval(timer);
                //让发送按钮出现
                $send.css("display","block");
                
            }
        },500)
    }
    let messagefn=function(){
        num++;
        $lists.eq(num).css({"display":"block","transform":"translateY(0)"});
        if(num==2){
            clearInterval(timerMe);
            //键盘从下往上出现
           let detime= window.setTimeout(()=>{
                $keybord.css("transform","translateY(0)");
                clearTimeout(detime);
                //让文字出现
                textfn();
                

            },1000)

        }
        if(num>=4){
            //让整个ul往上走，
            let lih=$lists.eq(num).height();
            messY+=lih;
            $tokenlists.css("transform",`translateY(-${messY}px)`)
        }
        if(num==$lists.length-1){

            clearInterval(timerMe);
            window.setTimeout(()=>{
                $audio[0].pause();
                $messagebox.remove();
                cubeRender.init();

            },1000)

        }
    };

    $plane.add(()=>{
        timerMe= window.setInterval(messagefn,1000)
    })
    $plane.add(function(){
       //给发送按钮绑定点击事件
        $send.on("click",function(){
        $text.html("");
        //$keybord.css("transform","translateY(0)");
        $keybord.css("transform","translateY(3.8rem)");
        timerMe= window.setInterval(messagefn,1000);

       })
    })

    return {
        init:function(){
            $messagebox.css("display","block");
            $audio[0].play();
            $plane.fire();

        }
    }
})(Zepto)



//cube
$(document).on('touchstart','touchmove',function(e){
    e.preventDefault();
})

let cubeRender=(function(){
    let $cubebox=$(".cubebox");
    let $cube=$(".cube");
    let $cubelits=$cube.find("li")
    let touchstart1=function(e){
        let  point=e.changedTouches[0];
        let $this=$(this);
        let attX=point.clientX;
        let attY=point.clientY;
        $this.attr({
            attX:attX,
            attY:attY,
            isMove:false
        })

    }
    let touchmove1=function(e){
        let point=e.changedTouches[0];
        let $this=$(this);
        let changeX=parseInt(point.clientX-$this.attr("attX"));
        let changeY=parseInt(point.clientY-$this.attr("attY"));
        if(Math.abs(changeX)>10||Math.abs(changeY)>10){
            $this.attr("isMove","true");
        }
        $this.attr({
            changeX:changeX,
            changeY:changeY,
        })
    }
    let touchend1=function(e){
        let point=e.changedTouches[0];
        let $this=$(this);
        if($this.attr("isMove")=="false")return;
        let rotateX=parseInt($this.attr("rotateX"))-$this.attr("changeY")/3;
        let rotateY=parseInt($this.attr("rotateY"))+$this.attr("changeX")/3;
        $this.css(`transform`,`rotateX(${rotateX}deg) rotateY(${rotateY}deg)` ).attr({
            rotateX:rotateX,
            rotateY:rotateY,
            isMove:false
        });



    }
    return{
        init:function(){
            $cubebox.css("display","block");
            $cube.on({
                touchstart:touchstart1,
                touchmove:touchmove1,
                touchend:touchend1
            })
            $cube.attr({
                "rotateX":10,
                "rotateY":10,
            })
            $cubelits.tap(function(){
                let $index=$(this).index();
                detailRender.init($index);
            })
        }
    }
})()


//detailbox
let detailRender=(function(){
    let $detailbox=$(".detailbox");
    let $cubebox=$(".cubebox");
    let myswiper=null;
    let $back=$detailbox.find(".backarrow");
    let $main = $('.main');
    
    let Fold=function(swiper){
         //swiper.slides 获取swiper的滑动页面组合
         //swiper.activeIndex 当前活动块的索引.
         let slidesAry=swiper.slides;

          //一旦进入页面,就给当前活动块页面增加一个类名"start",其它页面都移除这个类名.

          $(".swiper-wrapper .swiper-slide").each(function(index,element){
             
            if(index==swiper.activeIndex){
               $(this).addClass("start").siblings().removeClass("start");
               
            }
           })

         if(swiper.activeIndex==0){
            //让dl显示折叠效果
            $main.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.8
            });
            $main.makisu( 'open' );
         }else{
            $main.makisu({
                selector: 'dd',
                overlap: 0,
                speed: 0
            });
            $main.makisu( 'close' );
         }

        
        
         

    }
    return {
        init:function(index=0){
            $cubebox.css("display","none");
            $detailbox.css("display","block");
            //init swiper
            if(!myswiper){
                 myswiper=new Swiper ('.swiper-container', {
                    //loop: true, 在移动端有3d动画的时候最好不用loop，在部分安卓机有问题
                    effect:'coverflow',
                    onInit:Fold,
                    onTransitionEnd:Fold
                });
                //给返回按钮绑定事件
                $back.tap(function(){
                    $cubebox.css("display","block");
                    $detailbox.css("display","none");
                })
            }
            myswiper.slideTo(index, 0);


        }
    }
})()

loadingFn.init();