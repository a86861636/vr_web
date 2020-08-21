<template>
  <div class="swiper">
    <swiper class="bg" ref="mySwiper" :activeIndex="index" :options="bgOptions">
      <swiper-slide class="box" v-for="(item,index) in bgImg" :key="index">
        <img class="img" :src="item.img" alt="">
        <div class="ani text swiper-no-swiping" swiper-animate-effect="fadeInDown" swiper-animate-duration="1s" swiper-animate-delay="0s">{{item.text1}}</div>
        <div class="ani text swiper-no-swiping" swiper-animate-effect="fadeInUp" swiper-animate-duration="1.5s" swiper-animate-delay="0.1s">{{item.text2}}</div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <div class="center swiper-no-swiping">
      <swiper ref="mySwiper1" :options="centerOptions">
        <swiper-slide class="box " v-for="(item,index) in centerImg" :key="index">
          <img class="img" :src="item.img" alt="">
          <!-- <div class="text">{{item.text1}}</div> -->
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import {swiperAnimateCache,swiperAnimate} from "@/assets/js/swiper.animate1.0.3.min.js"
var swiper1
export default {
  name: 'carrousel',
  data() {
    return {
      swiper1: '',
      bgImg: [
        {
          img: require("@/assets/index/swiper (2).jpg"),
          text1: 'VR',
          text2: 'Virtual Reality'
        },{
          img: require("@/assets/index/swiper (1).jpg"),
          text1: 'MR',
          text2: 'Mixed Reality'
        },{
          img: require("@/assets/index/swiper (3).jpg"),
          text1: 'AR',
          text2: 'Augmented Reality'
        },{
          img: require("@/assets/index/swiper (5).jpg"),
          text1: 'C#',
          text2: 'Unity3D'
        },{
          img: require("@/assets/index/swiper (4).jpg"),
          text1: '影视特效',
          text2: 'Film Special Effects'
        }
      ],
      centerImg: [
        {
          img: require('@/assets/index/icon-vr.png'),
          text1: 'VR',
          text2: 'experience wonderful'
        },{
          img: require('@/assets/index/icon-mr.png'),
          text1: 'MR',
          text2: 'experience wonderful'
        },{
          img: require('@/assets/index/icon-ar.png'),
          text1: 'AR',
          text2: 'experience wonderful'
        },{
          img: require('@/assets/index/icon-c#.png'),
          text1: 'C#',
          text2: 'experience wonderful'
        },{
          img: require('@/assets/index/icon-video.png'),
          text1: '影视特效',
          text2: 'experience wonderful'
        }
      ],
      bgOptions: {
        autoplay: {
          delay: 4000,//1秒切换一次
        },
        loop: true,
        on:{
          init:function(){
            swiperAnimateCache(this);
            swiperAnimate(this);
          },
          slideChangeTransitionStart: function(){
            if(swiper1){
              swiper1.slideToLoop(this.activeIndex-1, 1000, false)
            }
          },
          slideChangeTransitionEnd: function(){
            // if(swiper1){
            //   swiper1.slideTo(this.activeIndex, 1000, false)
            // }
            swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
            //this.slides.eq(this.activeIndex).find('.ani').removeClass('ani'); 动画只展现一次，去除ani类名
          } 
        },
      },
      centerOptions: {
        slidesPerView : 5,
        centeredSlides : true,
        centeredSlidesBounds: true,
        loop: true
      }
    }
  },
  computed: {
  },
  mounted() {
    swiper1 = this.$refs.mySwiper1.$swiper
  },
  beforeDestroy(){
    swiper1 = ''
  }
}
</script>
<style scoped lang="less">
.swiper{
  position: relative;
}
.bg{
  .box{
    position: relative;
    height: calc(100vh - 150px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .img{
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0,-50%);
    width: 100%;
    height: auto;
  }
  .text{
    color: white;
    font-size: 66px;
  }
}
.center{
  z-index: 99;
  position: absolute;
  width: 750px;
  left: 50%;
  bottom: 0;
  transform: translate(-50%,50%);
  .img{
    width: 130px;
    height: 156px;
    display: block;
  }
}
</style>