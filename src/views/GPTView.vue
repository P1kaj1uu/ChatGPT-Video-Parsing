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
              <span>{{ this.getTime() }}</span>
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
              <span>{{ this.getTime() }}</span>
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

export default {
  name: "GPTView",
  data () {
    return {
      gptValue: '',
      flag: false,
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
    // 获取当前的时间
    getTime () {
      const now = new Date()
      // 获取当前年份，返回四位数字
      const year = now.getFullYear()
      // 获取当前月份，注意要加1
      const month = now.getMonth() + 1
      // 获取当前日期（几号）
      const day = now.getDate()
      // 获取当前小时数（0-23）
      const hour = now.getHours()
      // 获取当前分钟数（0-59）
      const minute = now.getMinutes()
      // 获取当前秒数（0-59）
      const second = now.getSeconds()
      return `${year}/${month}/${day} ${hour}:${minute}:${second}`
    },
    // 封装用户输入的内容的DOM结构
    getUserDOM (value, time) {
      // 获取内容区域元素
      let content = document.querySelector('.chat-content')
      // 创建一段元素
      const chatWrapper = document.createElement('div')
      chatWrapper.className = 'chat-wrapper'
      chatWrapper.style.height = '0px'
      const chatMe = document.createElement('div')
      chatMe.className = 'chat-me'
      chatMe.style.width = '100%'
      chatMe.style.float = 'right'
      chatMe.style.marginBottom = '20px'
      chatMe.style.position = 'relative'
      chatMe.style.display = 'flex'
      chatMe.style.flexDirection = 'column'
      chatMe.style.justifyContent = 'flex-end'
      chatMe.style.alignItems = 'flex-end'
      const chatText = document.createElement('div')
      chatText.className = 'chat-text'
      chatText.style.float = 'right'
      chatText.style.maxWidth = '90%'
      chatText.style.padding = '15px'
      chatText.style.borderRadius = '20px 20px 5px 20px'
      chatText.style.backgroundColor = '#95ec69'
      chatText.style.color = '#000'
      chatText.style.wordBreak = 'break-all'
      const textSpan = document.createElement('span')
      textSpan.style.fontSize = '16px'
      textSpan.textContent = value
      const infoTime = document.createElement('div')
      infoTime.className = 'info-time'
      infoTime.style.margin = '10px 0'
      infoTime.style.color = '#fff'
      infoTime.style.fontSize = '14px'
      infoTime.style.display = 'flex'
      infoTime.style.justifyContent = 'flex-end'
      infoTime.style.alignItems = 'center'
      const nameSpan = document.createElement('span')
      nameSpan.textContent = '权志龙的小迷弟'
      nameSpan.style.color = 'rgb(101, 104, 115)'
      nameSpan.style.marginRight = '10px'
      nameSpan.style.verticalAlign = 'middle'
      nameSpan.style.height = '30px'
      nameSpan.style.lineHeight = '30px'
      const timeSpan = document.createElement('span')
      timeSpan.textContent = time
      timeSpan.style.lineHeight = '30px'
      const imgElem = document.createElement('img')
      imgElem.src = require('@/assets/images/gpt/user.jpg')
      imgElem.style.width = '30px'
      imgElem.style.height = '30px'
      imgElem.style.borderRadius = '50%'
      imgElem.style.verticalAlign = 'middle'
      imgElem.style.marginLeft = '10px'
      // 将元素添加到父元素中
      chatText.appendChild(textSpan)
      infoTime.appendChild(nameSpan)
      infoTime.appendChild(timeSpan)
      infoTime.appendChild(imgElem)
      chatMe.appendChild(chatText)
      chatMe.appendChild(infoTime)
      chatWrapper.appendChild(chatMe)
      // 追加到DOM中
      content.appendChild(chatWrapper)
    },
    // 封装GPT回答的内容的DOM结构
    getGPTDOM (value, time) {
      // 获取内容区域元素
      let content = document.querySelector('.chat-content')
      // 创建一段元素
      const chatWrapper = document.createElement('div')
      chatWrapper.className = 'chat-wrapper'
      chatWrapper.style.height = '0px'
      const chatFriend = document.createElement('div')
      chatFriend.className = 'chat-friend'
      chatFriend.style.width = '80%'
      chatFriend.style.float = 'left'
      chatFriend.style.marginBottom = '20px'
      chatFriend.style.position = 'relative'
      chatFriend.style.display = 'flex'
      chatFriend.style.flexDirection = 'column'
      chatFriend.style.justifyContent = 'flex-end'
      chatFriend.style.alignItems = 'flex-start'
      const chatText = document.createElement('div')
      chatText.className = 'chat-text'
      chatText.style.float = 'left'
      chatText.style.maxWidth = '90%'
      chatText.style.padding = '15px'
      chatText.style.borderRadius = '20px 20px 20px 5px'
      chatText.style.backgroundColor = '#fff'
      const elRow = document.createElement('div')
      elRow.className = 'el-row'
      elRow.style.marginLeft = '-10px'
      elRow.style.marginRight = '-10px'
      const elCol1 = document.createElement('div')
      elCol1.className = 'el-col el-col-2'
      elCol1.style.paddingLeft = '10px'
      elCol1.style.paddingRight = '10px'
      elCol1.style.cursor = 'pointer'
      elCol1.addEventListener('click', this.copy)
      const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svgIcon.setAttribute('t', 1679666016648)
      svgIcon.setAttribute('viewBox', '0 0 1024 1024')
      svgIcon.setAttribute('version', '1.1')
      svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      svgIcon.setAttribute('width', '22')
      svgIcon.setAttribute('height', '22')
      svgIcon.setAttribute('class', 'icon')
      const pathIcon = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      pathIcon.setAttribute('fill', '#909399')
      pathIcon.setAttribute('d', 'M661.333333 234.666667A64 64 0 0 1 725.333333 298.666667v597.333333a64 64 0 0 1-64 64h-469.333333A64 64 0 0 1 128 896V298.666667a64 64 0 0 1 64-64z m-21.333333 85.333333H213.333333v554.666667h426.666667v-554.666667z m191.829333-256a64 64 0 0 1 63.744 57.856l0.256 6.144v575.701333a42.666667 42.666667 0 0 1-85.034666 4.992l-0.298667-4.992V149.333333H384a42.666667 42.666667 0 0 1-42.368-37.674666L341.333333 106.666667a42.666667 42.666667 0 0 1 37.674667-42.368L384 64h447.829333z')
      const elCol2 = document.createElement('div')
      elCol2.className = 'el-col el-col-21'
      elCol2.style.paddingLeft = '10px'
      elCol2.style.paddingRight = '10px'
      const markdownBody = document.createElement('div')
      markdownBody.className = 'markdown-body'
      markdownBody.style.webkitTextSizeAdjust = '100%'
      markdownBody.style.color = '#24292e'
      markdownBody.style.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji'
      markdownBody.style.fontSize = '16px'
      markdownBody.style.lineHeight = '1.5'
      markdownBody.style.wordWrap = 'break-word'
      if (markdownBody.children.length >= 2) {
        markdownBody.firstElementChild.style.marginTop = '0 !important'
        markdownBody.lastElementChild.style.marginBottom = '0 !important'
      }
      const markdownContent = document.createElement('p')
      markdownContent.id = 'markdown-content'
      markdownContent.textContent = value
      const infoTime = document.createElement('div')
      infoTime.className = 'info-time'
      infoTime.style.margin = '10px 0'
      infoTime.style.color = '#fff'
      infoTime.style.fontSize = '14px'
      infoTime.style.display = 'flex'
      infoTime.style.justifyContent = 'flex-start'
      infoTime.style.alignItems = 'center'
      const imgElem = document.createElement('img')
      imgElem.src = require('@/assets/images/gpt/chatgpt.jpg')
      imgElem.style.width = '30px'
      imgElem.style.height = '30px'
      imgElem.style.borderRadius = '50%'
      imgElem.style.verticalAlign = 'middle'
      imgElem.style.marginLeft = '10px'
      const gptNameSpan = document.createElement('span')
      gptNameSpan.className = 'gptName'
      gptNameSpan.textContent = 'ChatGPT'
      gptNameSpan.style.lineHeight = '30px'
      gptNameSpan.style.margin = '0 10px'
      const timeSpan = document.createElement('span')
      timeSpan.textContent = time
      timeSpan.style.color = 'rgb(101, 104, 115)'
      timeSpan.style.marginRight = '10px'
      timeSpan.style.verticalAlign = 'middle'
      timeSpan.style.height = '30px'
      timeSpan.style.lineHeight = '30px'
      // 将元素添加到父元素中
      svgIcon.appendChild(pathIcon)
      elCol1.appendChild(svgIcon)
      elRow.appendChild(elCol1)
      elRow.appendChild(elCol2)
      markdownBody.appendChild(markdownContent)
      chatText.appendChild(elRow)
      chatText.appendChild(markdownBody)
      chatFriend.appendChild(chatText)
      infoTime.appendChild(imgElem)
      infoTime.appendChild(gptNameSpan)
      infoTime.appendChild(timeSpan)
      chatFriend.appendChild(infoTime)
      chatWrapper.appendChild(chatFriend)
      // 追加到DOM中
      content.appendChild(chatWrapper)
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
      const userTime = this.getTime()
      this.getUserDOM(this.gptValue, userTime)
      this.toBottom()
      document.querySelector('.loadEffect').style.display = 'block'
      this.flag = true
      // 此处填入GPT3.5模型的接口
      axios.post('GPT.URL', {
        frequency_penalty: 0,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: this.gptValue
          }
        ],
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
        let gptTime = this.getTime()
        dataArray.forEach(str => {
          if (str.trim() !== '' && str.startsWith('data:') && str.includes('content')) {
            let curStr = str.replace('…', '",').replace(/\\n/g, '\n')
            let indexFirst = curStr.indexOf('content') + 10
            let indexLast = curStr.indexOf('"}')
            gptRes += curStr.substring(indexFirst, indexLast)
          }
        })
        this.getGPTDOM(gptRes, gptTime)
      }).catch(error => {
        // GPT响应时间
        let gptErrorTime = this.getTime()
        let errorMessage = '宝，我好卡呀，这个问题我也不知道该怎么回答你呢，要不你慢一点，容我再想一想'
        this.getGPTDOM(errorMessage, gptErrorTime)
        console.log(error)
      }).finally(() => {
        this.gptValue = ''
        this.flag = false
        this.focusInput()
        this.toBottom()
        document.querySelector('.loadEffect').style.display = 'none'
      })
    }
  },
  created () {
    this.getTime()
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
</style>