<!-- 
    * @Description: 欢迎页面
    * @Author: 不见水星记（P1kaj1uu）  
-->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 轮播图区域 -->
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in swiperList">
          <img :src="item.path" :key="item.id">
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination"></div>
      <!-- 如果需要导航按钮 -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </div>
</template>

<script>
import 'swiper/dist/js/swiper'
import 'swiper/dist/css/swiper.css'
import Swiper from 'swiper'

export default {
  name: 'WelcomeView',
  data() {
    return {
      // 轮播图列表
      swiperList: [
        {
          path: require('@/assets/images/welcome/a.jpg'),
          id: 1
        },
        {
          path: require('@/assets/images/welcome/a.jpg'),
          id: 2
        },
        {
          path: require('@/assets/images/welcome/a.jpg'),
          id: 3
        },
        {
          path: require('@/assets/images/welcome/a.jpg'),
          id: 4
        },
        {
          path: require('@/assets/images/welcome/a.jpg'),
          id: 5
        }
      ]
    }
  },
  created() {
    if (document.querySelector('.el-notification')) {
      document.querySelector('.el-notification').style.display = 'none'
    }
  },
  mounted() {
    new Swiper('.swiper-container', {
      direction: 'horizontal', // 水平切换选项
      autoplay: {
        //自动开始
        delay: 2000, //时间间隔
      },
      loop: true, // 循环模式选项
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
        clickable: true // 分页器可以点击
      },
      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    })
  }
}
</script>

<style lang="less" scoped>
.swiper-slide {
  display: flex;
  transform: scale(0.8);
  justify-content: center;
  align-content: center;
}
.swiper-slide img {
   transform: scale(0.8);
   cursor: move;
}
</style>
