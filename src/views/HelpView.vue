<!-- 
    * @Description: 帮助页面
    * @Author: 不见水星记（P1kaj1uu）  
-->
<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>帮助</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row style="text-align: center;">
                <el-col>
                    <div class="steps">第一步：进入官方视频网站界面，搜索需要会员的电视剧或者电影</div>
                </el-col>
                <el-col>
                    <img class="helpImgs" src="@/assets/images/help/help1.png">
                </el-col>
            </el-row>
        </el-card>

        <el-card>
            <el-row style="text-align: center;">
                <el-col>
                    <div class="steps">第二步：选择你喜欢的电视剧电影之后，复制对应地址栏的地址</div>
                </el-col>
                <el-col>
                    <img class="helpImgs" src="@/assets/images/help/help2.png">
                </el-col>
            </el-row>
        </el-card>

        <el-card>
            <el-row style="text-align: center;">
                <el-col>
                    <div class="steps">第三步：返回观看页面，粘贴复制的地址，选择解析接口，点击立即播放按钮</div>
                </el-col>
                <el-col>
                    <img class="helpImgs" src="@/assets/images/help/help3.png">
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'HelpView',
    created() {
        if (document.querySelector('.el-notification')) {
            document.querySelector('.el-notification').style.display = 'none'
        }
    }
}
</script>

<style lang="less" scoped>
.steps {
    font-weight: 600;
    font-size: 18px;
}

.helpImgs {
    margin-top: 15px;
    width: 750px;
    height: 500px;
}
</style>