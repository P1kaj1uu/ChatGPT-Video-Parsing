<!-- 
    * @Description: ChatGPT页面
    * @Author: 不见水星记（P1kaj1uu）  
-->
<template>
  <div class="gptContainer">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>ChatGPT</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="loader">
      <div class="bar"></div>
    </div>

    <div class="gptBox">
      <!-- 内容聊天区域 -->
      <div class="chat-content">
        <!-- 初始状态开始 -->
        <!-- 用户 -->
        <div class="chat-wrapper">
          <div class="chat-me">
            <div class="chat-text">
              <span style="font-size: 16px;">你好</span>
            </div>
            <div class="info-time">
              <span>权志龙的小迷弟</span>
              <span>{{ new Date().toLocaleString() }}</span>
              <img src="@/assets/images/gpt/user.jpg" />
            </div>
          </div>
        </div>
        <!-- GPT -->
        <div class="chat-wrapper">
          <div class="chat-friend">
            <div class="chat-text">
              <div class="el-row" style="margin-left: -10px; margin-right: -10px;">
                <div class="el-col el-col-2" style="padding-left: 10px; padding-right: 10px; cursor: pointer;" @click="copy">
                  <svg t="1679666016648" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6241" width="22" height="22" class="icon">
                    <path p-id="6242" fill="#909399" d="M661.333333 234.666667A64 64 0 0 1 725.333333 298.666667v597.333333a64 64 0 0 1-64 64h-469.333333A64 64 0 0 1 128 896V298.666667a64 64 0 0 1 64-64z m-21.333333 85.333333H213.333333v554.666667h426.666667v-554.666667z m191.829333-256a64 64 0 0 1 63.744 57.856l0.256 6.144v575.701333a42.666667 42.666667 0 0 1-85.034666 4.992l-0.298667-4.992V149.333333H384a42.666667 42.666667 0 0 1-42.368-37.674666L341.333333 106.666667a42.666667 42.666667 0 0 1 37.674667-42.368L384 64h447.829333z"></path>
                  </svg>
                </div>
                <div class="el-col el-col-21" style="padding-left: 10px; padding-right: 10px;"></div>
              </div>
              <div>
                <div class="markdown-body">
                  <p id="markdown-content">你好！请问有什么我可以帮助你的吗？</p>
                </div>
              </div>
            </div>
            <div class="info-time">
              <img src="@/assets/images/gpt/chatgpt.jpg" />
              <span class="gptName">ChatGPT</span>
              <span>{{ new Date().toLocaleString() }}</span>
            </div>
          </div>
        </div>
        <!-- 初始状态结束 -->
      </div>
      <!-- 发送问题区域 -->
      <div class="chatInputs">
        <el-input
          ref="myInput"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 2}"
          placeholder="在此输入您的提示词，点击右侧火箭按钮发送消息~"
          v-model="gptValue"
        >
        </el-input>
        <button class="sendImg" @click="sendMessage" :disabled="flag">
          <img src="@/assets/images/gpt/rocket.png" alt="发送" />
        </button>
      </div>
    </div>

    <div class="loadEffect">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// 导入封装的获取当前时间、用户输入的DOM结构和GPT响应的DOM结构函数
import { getTime } from '@/utils/currentTime'
import { getUserDOM } from '@/utils/userDOM'
import { getGPTDOM } from '@/utils/gptDOM'

export default {
  name: "GPTView",
  data () {
    return {
      gptValue: '',
      flag: false,
      gptNum: 0,
      messageGPTList: []
    }
  },
  methods: {
    // 复制GPT回答的内容
    copy (e) {
      const input = e.target.parentNode.parentNode.nextElementSibling.querySelector('#markdown-content')
      const textarea = document.createElement('textarea')
      textarea.value = input.innerText || input.textContent
      // 将隐藏的 <textarea> 元素添加到文档中，并选中其中的文本
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      // 删除隐藏的 <textarea> 元素
      document.body.removeChild(textarea)
      this.$message.success('复制成功')
    },
    // 聚焦输入框
    focusInput () {
      this.$nextTick(() => {
        this.$refs.myInput.focus()
      })
    },
    // 封装消息滚动到底部的方法
    toBottom () {
      this.$nextTick(() => {
        const content = document.querySelector('.chat-content')
        content.scrollTop = content.scrollHeight
      })
    },
    sendMessage () {
      if (this.gptValue.trim().length === 0) {
        this.gptValue = ''
        this.focusInput()
        this.$message.warning('发送的消息不能为空哦~')
        return
      }
      // 用户发送的时间
      const userTime = getTime()
      getUserDOM(this.gptValue, userTime)
      this.toBottom()
      document.querySelector('.loadEffect').style.display = 'block'
      document.querySelector('.loader').style.visibility = 'visible'
      this.flag = true
      // 支持上下文对话
      let messageList = this.gptNum >= 1 ? [...this.messageGPTList, { role: 'user', content: this.gptValue }] : [{ role: 'user', content: this.gptValue }]
      // 此处填入GPT3.5模型的接口
      axios.post('GPT.URL', {
        frequency_penalty: 0,
        max_tokens: 1000,
        messages: messageList,
        model: 'gpt-3.5-turbo',
        n: 1,
        presence_penalty: 0,
        stop: '',
        stream: true,
        temperature: 1,
        top_p: 1
      }).then(res => {
        let dataArray = res.data.split('\n')
        let gptRes = ''
        // GPT响应时间
        let gptTime = getTime()
        dataArray.forEach(str => {
          if (str.trim() !== '' && str.startsWith('data:') && str.includes('content')) {
            let curStr = str.replace('…', '",').replace(/\\n/g, '\n')
            let indexFirst = curStr.indexOf('content') + 10
            let indexLast = curStr.indexOf('"}')
            gptRes += curStr.substring(indexFirst, indexLast)
          }
        })
        ++this.gptNum
        this.messageGPTList = [...messageList, { role: 'assistant', content: gptRes }]
        getGPTDOM(gptRes, gptTime)
      }).catch(error => {
        // GPT响应时间
        let gptErrorTime = getTime()
        let errorMessage = '宝，我好卡呀，这个问题我也不知道该怎么回答你呢，要不你慢一点，容我再想一想'
        getGPTDOM(errorMessage, gptErrorTime)
        console.log(error)
      }).finally(() => {
        this.gptValue = ''
        this.flag = false
        this.focusInput()
        this.toBottom()
        document.querySelector('.loadEffect').style.display = 'none'
        document.querySelector('.loader').style.visibility = 'hidden'
      })
    }
  },
  created () {
    this.focusInput()
  }
};
</script>

<style lang="less" scoped>
.gptBox {
  position: relative;
  height: 80vh;
  border-radius: 3%;
  background-color: #323644;
}
.chat-content {
  width: 100%;
  height: 85%;
  overflow-y: scroll;
  padding: 20px;
  box-sizing: border-box;
  scrollbar-width: thin; /* 滚动条宽度 */
  scrollbar-color: #999 #eee; /* 滚动条颜色 */
}

.chat-me {
  width: 100%;
  float: right;
  margin-bottom: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;

  .chat-text {
    float: right;
    max-width: 90%;
    padding: 15px;
    border-radius: 20px 20px 5px 20px;
    background-color: #95ec69;
    color: #000;
    word-break: break-all;
  }

  .info-time {
    margin: 10px 0;
    color: #fff;
    font-size: 14px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    span:first-child {
      color: rgb(101, 104, 115);
      margin-right: 10px;
      vertical-align: middle;
      height: 30px;
      line-height: 30px;
    }

    span:last-child {
      line-height: 30px;
    }

    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
      margin-left: 10px;
    }
  }
}

.chat-friend {
  width: 80%;
  float: left;
  margin-bottom: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;

  .chat-text {
    float: left;
    max-width: 90%;
    padding: 15px;
    border-radius: 20px 20px 20px 5px;
    background-color: #fff;

    .markdown-body {
      -webkit-text-size-adjust: 100%;
      color: #24292e;
      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
      font-size: 16px;
      line-height: 1.5;
      word-wrap: break-word;
    }
    .markdown-body>:first-child {
      margin-top: 0 !important;
    }
    .markdown-body>:last-child {
      margin-bottom: 0 !important;
    }
  }

  .info-time {
    margin: 10px 0;
    color: #fff;
    font-size: 14px;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
      margin-left: 10px;
    }

    span:first-child {
      line-height: 30px;
    }

    .gptName {
      margin: 0 10px;
    }

    span:last-child {
      color: rgb(101, 104, 115);
      margin-right: 10px;
      vertical-align: middle;
      height: 30px;
      line-height: 30px;
    }
  }
}

/* 隐藏默认的滚动条 */
::-webkit-scrollbar {
   display: none;
}
.chatInputs {
  width: 90%;
  position: absolute;
  left: 50%;
  transform: translateX(-51%);
  bottom: 0;
  margin: 1%;
  display: flex;
}

.el-textarea {
  font-size: 18px;
}

.el-textarea :deep(textarea) {
  resize: none;
}

.sendImg:hover {
  cursor: pointer;
}

.sendImg {
  position: relative;
  width: 10%;
  background-color: rgb(29, 144, 245);
  border: 0;
  transition: 0.3s;
  box-shadow: 0px 0px 5px 0px rgb(0 136 255);

  img {
    width: 30px;
    height: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.loadEffect {
  display: none;
  width: 100px;
  height: 100px;
  left: 40%;
  top: 40%;
  position: absolute;
}
.loadEffect span {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: lightgreen;
  position: absolute;
  animation: load 1.04s ease infinite;
}
@keyframes load {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
.loadEffect span:nth-child(1) {
  left: 0;
  top: 50%;
  margin-top: -8px;
  animation-delay: 0.13s;
}
.loadEffect span:nth-child(2) {
  left: 14px;
  top: 14px;
  animation-delay: 0.26s;
}
.loadEffect span:nth-child(3) {
  left: 50%;
  top: 0;
  margin-left: -8px;
  animation-delay: 0.39s;
}
.loadEffect span:nth-child(4) {
  top: 14px;
  right: 14px;
  animation-delay: 0.52s;
}
.loadEffect span:nth-child(5) {
  right: 0;
  top: 50%;
  margin-top: -8px;
  animation-delay: 0.65s;
}
.loadEffect span:nth-child(6) {
  right: 14px;
  bottom: 14px;
  animation-delay: 0.78s;
}
.loadEffect span:nth-child(7) {
  bottom: 0;
  left: 50%;
  margin-left: -8px;
  animation-delay: 0.91s;
}
.loadEffect span:nth-child(8) {
  bottom: 14px;
  left: 14px;
  animation-delay: 1.04s;
}

.loader {
  visibility: hidden;
  position: relative;
  margin: auto;
  width: 95%;
  height: 5px;
  background-color: #eaedf1;
}

.bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-image: linear-gradient(to right, #ff5b5b, #ffbd2f, #21d07a, #3c7bff);
  background-size: auto 100%;
  animation: loading 2s ease-in-out infinite alternate;
  box-shadow: 0 0 5px rgba(255,255,255,0.2);
}

@keyframes loading {
  0% {
    width: 0%;
  }

  25% {
    background-position: 0 0;
  }

  50% {
    background-position: 50% 0;
  }

  75% {
    background-position: 100% 0;
  }

  100% {
    width: 100%;
    background-position: 0 0;
  }
}
</style>