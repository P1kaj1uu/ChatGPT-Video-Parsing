<!-- 
    * @Description: 首页页面
    * @Author: 不见水星记（P1kaj1uu）  
-->
<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <h3 style="user-select: none; cursor: pointer;">VIP视频在线解析</h3>
      </div>
      <el-button type="info" @click="ContactMeFn">联系我</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu default-active="1" class="el-menu-vertical-demo" background-color="#333744" text-color="#fff"
          active-text-color="#409eff" router>
          <el-menu-item index="1" :index="'/home/welcome'">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="2" :index="'/home/video'">
            <i class="el-icon-video-camera-solid"></i>
            <span slot="title">观看</span>
          </el-menu-item>
          <el-menu-item index="3" :index="'/home/help'">
            <i class="el-icon-question"></i>
            <span slot="title">帮助</span>
          </el-menu-item>
          <el-menu-item index="4" :index="'/home/about'">
            <i class="el-icon-user-solid"></i>
            <span slot="title">关于</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 右侧内容主体 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
        <el-footer v-show="$route.path === '/home/welcome'">
          <div>声明：本站只提供影视解析服务，请勿用于任何商业用途。如有侵权，请联系我！</div>
          <div>联系方式：Dveiklokk（微信号）</div>
          <div>© Copyright 2023 P1Kaj1uu. All Rights Reserved.</div>
        </el-footer>
      </el-container>
    </el-container>
    <el-dialog title="联系我" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="dialogTxt">
        <div style="text-align: center;">联系方式：<span style="font-weight: 600;">Dveiklokk</span>（微信号）</div>
        <div style="text-align: center;">
          <img style="width: 350px; height: 350px; text-align: center;" src="@/assets/images/home/wx.jpg" />
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    // 联系我
    ContactMeFn() {
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    }
  },
  created () {
    if (document.querySelector('.el-notification')) {
      document.querySelector('.el-notification').style.display = 'none'
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  >div {
    display: flex;
    align-items: center;

    h3 {
      margin-left: 25px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
  position: absolute;
  left: 200px;
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}

.el-footer {
  background-color: #373d41;
  line-height: 20px;
  position: absolute;
  left: 200px;
  right: 0;
  bottom: 0;

  div {
    color: #fff;
    font-size: 12px;
    text-align: center;
  }
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
