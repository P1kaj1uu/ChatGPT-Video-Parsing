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

    <div class="loader" ref="loader">
      <div class="bar"></div>
    </div>

    <div class="gptBox">
      <!-- 内容聊天区域 -->
      <div class="chat-content">
        <div class="message" v-for="(item, index) in messages" :key="index">
          <!-- 用户 -->
          <template v-if="item.role === 'user'">
            <div class="me chat">
              <el-tooltip
                class="item"
                effect="dark"
                content="复制发送的内容"
                placement="top"
              >
                <img src="@/assets/images/gpt/copy.png" @click="copySendText" class="copySendImg" alt="复制">
              </el-tooltip>
              <div v-html="markdown(item.content)"></div>
            </div>
            <div class="infoMe-time">
              <span>权志龙的小迷弟</span>
              <span>{{ new Date().toLocaleString() }}</span>
              <img src="@/assets/images/gpt/user.jpg" />
            </div>
          </template>
          <!-- GPT -->
          <template v-else>
            <el-tooltip
              class="item"
              effect="dark"
              content="复制该响应的内容"
              placement="top"
            >
              <img src="@/assets/images/gpt/copy.png" @click="copy" class="copyImg" alt="复制">
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="播放该响应的内容"
              placement="top"
            >
              <img src="@/assets/images/gpt/trumpet.png" @click="playSoundFn" class="trumpetImg" alt="播放">
            </el-tooltip>
            <div class="ai chat ai-content">
              <div v-html="markdown(item.content)" id="chat-markdown"></div>
            </div>
            <div class="infoAI-time">
              <img src="@/assets/images/gpt/chatgpt.jpg" />
              <span class="gptName">ChatGPT</span>
              <span>{{ new Date().toLocaleString() }}</span>
            </div>
          </template>
        </div>
      </div>
      <!-- 发送问题区域 -->
      <div class="chatInputs">
        <Role @selectChange="getSelectValue" ref="roleRef" />
        <el-input
          ref="myInput"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 2 }"
          placeholder="在此输入您的提示词，Esc键换行，Enter键或点击右侧火箭按钮发送消息~"
          v-model="gptValue"
        >
        </el-input>
        <el-tooltip
          class="item"
          effect="dark"
          content="发送消息"
          placement="top"
        >
          <button class="sendImg" @click="handleSend" :disabled="false">
            <img src="@/assets/images/gpt/rocket.png" alt="发送" />
          </button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="清空会话"
          placement="top"
        >
          <button class="clears" @click="clearSession" :disabled="false">
            <img src="@/assets/images/gpt/delete.png" alt="清空" />
          </button>
        </el-tooltip>
      </div>
    </div>

    <VuePuzzleVcode :show="isShowVerify" @success="successVerify" @close="this.isShowVerify = false" />

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
import CopyGPTIcon from '@/assets/images/gpt/icon-copy-gpt.png'
import VuePuzzleVcode from 'vue-puzzle-vcode'
import Role from '@/components/Role'
import { sleep } from '@/utils/sleep'
import { resolveStreamResponse } from '@/utils/resolveStreamResponse'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const initSession = [
  {
    role: 'user',
    content: '你好'
  },
  {
    role: 'assistant',
    content: '你好！请问有什么我可以帮助你的吗？'
  }
]

export default {
  name: 'GPT',
  data() {
    return {
      gptValue: '',
      messages: this.getSessionCache() ? this.getSessionCache() : initSession,
      times: 0,
      isShowVerify: false,
      backupMessage: [
        {
          role: 'user',
          content: '你好'
        },
        {
          role: 'assistant',
          content: '你好！请问有什么我可以帮助你的吗？'
        }
      ]
    }
  },
  components: {
    Role,
    VuePuzzleVcode
  },
  methods: {
    handleSend () {
      if (this.gptValue.trim().length === 0) {
        this.gptValue = ''
        this.focusInput()
        this.$message.warning('发送的消息不能为空哦~')
        return
      }
      localStorage.getItem('GPTToken') ? this.gptSuccessVerify() : this.gptCheckModal()
    },
    // GPT验证码校验弹窗
    gptCheckModal() {
      this.$prompt('当前状态为未验证，请您输入本网站的ChatGPT验证码！详情可联系我wx：Dveiklokk（添加好友时请注明来意）', '验证身份', {
        type: 'warning',
        center: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '格式不正确'
      })
        .then(({ value }) => {
          if (value !== '891523233@qq.com') {
            this.$message({
              type: 'error',
              message: '验证码错误'
            })
          } else {
            localStorage.setItem('GPTToken', value)
            this.$message({
              type: 'success',
              message: '验证成功'
            })
            this.gptSuccessVerify()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消验证'
          })
        })
    },
    // GPT验证码校验通过
    gptSuccessVerify() {
      ++this.times
      if (localStorage.getItem('session_times') >= 12) {
        this.$message.warning('系统检测到当前环境异常，请先验证！')
        this.isShowVerify = true
        return
      }
      this.messages.push({
        role: 'user',
        content: this.gptValue.trim()
      })
      localStorage.setItem('session_times', this.times)
      this.toMessageBottom()
      document.querySelector('.sendImg').disabled = true
      document.querySelector('.clears').disabled = true
      document.querySelector('.loadEffect').style.display = 'block'
      document.querySelector('.loader').style.visibility = 'visible'
      this.getGPTResponse(this.gptValue)
      this.gptValue = ''
      this.$refs.roleRef.clearSelect()
    },
    // 验证码校验通过
    successVerify () {
      this.isShowVerify = false
      this.times = 0
      localStorage.setItem('session_times', this.times)
    },
    onKeyDown (event) {
      if (event.key === 'Escape') {
        this.gptValue += '\n'
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        this.handleSend()
      }
    },
    async getGPTResponse (content) {
      // 此处填入GPT3.5模型的接口
      const fetchPromise = fetch(
        `URL`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ziyu-ystf3oih4jkfwkiljzt6n8bx-64b8a44109959843bc8945cb',
          },
          body: JSON.stringify({
            chatId: localStorage.getItem('newChatId') || '',
            stream: true,
            messages: [{"content": content, "role": "user"}]
          })
        }
      ).catch(() => {
        this.$message.error('出错啦~建议刷新页面后，再重新尝试')
        this.toMessageBottom()
        document.querySelector('.loadEffect').style.display = 'none'
        document.querySelector('.loader').style.visibility = 'hidden'
      }).finally(() => {
        this.focusInput()
      })
      const message = {
        role: 'assistant',
        content: ''
      }
      this.messages.push(message)
      resolveStreamResponse(
        fetchPromise,
        (data) => {
          message.content += JSON.parse(data).choices[0].delta.content
          this.toMessageBottom()
          //message.content += data.choices.map((_) => _.delta.content).join('')
        },
        (err) => {
          message.content += '宝，我出错啦，这个问题我也不知道该怎么回答你呢，要不你慢一点，容我再想一想~（建议：清空会话记录试试...'
          this.$message.error('服务器出错啦~')
          console.log('错误！', err)
        },
        (res) => {
          localStorage.setItem('session_cached', JSON.stringify(this.messages))
          if (res.status && res.status === 500) {
            message.content += 'APIKey余额不足~请联系我（wx：Dveiklokk）进行充值！'
            this.$message.warning('APIKey余额不足')
          }
        },
        document.querySelector('.sendImg'),
        document.querySelector('.clears')
      )
    },
    // 获取子组件传递过来的数据
    getSelectValue (data) {
      this.gptValue = data
    },
    // 清空会话
    clearSession () {
      this.$confirm('此操作将永久清空已存在的对话内容，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '清空成功'
          })
          localStorage.removeItem('newChatId')
          this.messages = this.backupMessage
          this.setSessionCache()
        })
        .catch(() => {})
    },
    // 存储会话
    setSessionCache () {
      return localStorage.setItem(
        'session_cached',
        JSON.stringify(this.messages)
      )
    },
    // 获取会话
    getSessionCache () {
      return JSON.parse(localStorage.getItem('session_cached'))
    },
    // 解析markdown格式和代码高亮显示
    markdown(content) {
      const md = new MarkdownIt({
        highlight: function(str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return (
                '<pre class="hljs"><div class="code-header"><div class="lang">' +
                lang +
                '</div><div class="copy"><img src="' +
                CopyGPTIcon +
                '" /><p>复制</p></div></div><code>' +
                hljs.highlight(lang, str, true).value +
                '</code></pre>'
              )
            } catch (__) {}
          }
          return (
            '<pre class="hljs"><div class="code-header"><div class="lang"></div><div class="copy" ><img src="' +
            CopyGPTIcon +
            '" /><p>复制</p></div></div><code>' +
            md.utils.escapeHtml(str) +
            '</code></pre>'
          )
        },
      })
      const result = md.render(content)
      this.$nextTick(() => {
        let elements = document.querySelectorAll('.copy')
        elements.forEach(item => {
          item.addEventListener('click', this.copyCodeBlock)
        })
      })
      return result
    },
    // 复制GPT回答的全部内容
    copy (e) {
      const input = e.target.parentNode.querySelectorAll('.ai')
      if (input.length === 0) {
        this.$message.info('请耐心等待ChatGPT回复后再复制')
        return
      }
      const textarea = document.createElement('textarea')
      input.forEach(item => {
        textarea.value += item.innerText || item.textContent
      })
      // 将隐藏的 <textarea> 元素添加到文档中，并选中其中的文本
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      // 删除隐藏的 <textarea> 元素
      document.body.removeChild(textarea)
      this.$message.success('复制结果成功')
    },
    // 复制发送的内容
    copySendText (e) {
      const input = e.target.parentNode.querySelectorAll('p')
      const textarea = document.createElement('textarea')
      input.forEach(item => {
        textarea.value += item.innerText || item.textContent
      })
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.$message.success('复制对话成功')
    },
    // 复制代码
    copyCodeBlock (e) {
      const codes = e.target.parentNode.parentNode.nextElementSibling
      const text = codes.innerText || codes.textContent
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.$message.success('复制代码成功')
    },
    // 播放声音
    playSoundFn (e) {
      const input = e.target.parentNode.querySelectorAll('.ai')
      if (input.length === 0) {
        this.$message.info('请耐心等待ChatGPT回复后再播放')
        return
      }
      // 判断浏览器是否支持
      const isSupport = 'speechSynthesis' in window
      if (!isSupport) {
        this.$message.warning('该浏览器暂不支持，请切换浏览器后重试！')
        return
      }
      let soundValue = ''
      input.forEach(item => {
        soundValue += item.innerText || item.textContent
      })
      soundValue = soundValue.replace('复制代码', '')
      const count = Math.ceil(soundValue.length / 20)
      for (let i = 0; i < count; i++) {
        let cur = soundValue.slice(i * 20, i * 20 + 20)
        // 创建SpeechSynthesisUtterance对象
        const speech = new SpeechSynthesisUtterance()
        // 设置要播放的文本内容
        speech.text = cur
        // 调用SpeechSynthesis.speak方法开始播放
        window.speechSynthesis.speak(speech)
      }
    },
    // 聚焦输入框
    focusInput () {
      this.$nextTick(() => {
        this.$refs.myInput.focus()
      })
    },
    // 封装消息滚动到底部的方法
    toMessageBottom () {
      this.$nextTick(() => {
        const content = document.querySelector('.chat-content')
        content.scrollTop = content.scrollHeight
      })
    }
  },
  mounted () {
    let isDisPlay = document.querySelector('.model')?.style.display === 'none'
    let notifyMessage = {
                          title: '系统消息',
                          message: '我的APIKey配额有限，希望大家能省点用谢谢！',
		                      offset: 0,
			                    duration: 2500
                        }
    if (isDisPlay) {
      this.$notify.info(notifyMessage)
    } else {
      sleep(500).then(() => {
        this.$notify.info(notifyMessage)
      })
    }
  },
  created () {
    this.focusInput()
    this.toMessageBottom()
    this.$nextTick(() => {
      this.$refs.myInput.$el.querySelector('.el-textarea__inner').addEventListener('keydown', this.onKeyDown)
    })
  },
  beforeDestroy() {
    this.$refs.myInput.$el.querySelector('.el-textarea__inner').removeEventListener('keydown', this.onKeyDown)
  },
}
</script>

<style lang="less" scoped>
.gptContainer {
  position: relative;
}
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

.chat {
  margin: 10px;
  line-height: 1.5;
  font-size: 16px;
  max-width: 50vw;
}
.message {
  display: flex;
  flex-direction: column;
  position: relative;
}
.me {
  position: relative;
  padding: 10px;
  border-radius: 20px 20px 5px 20px;
  background-color: #95ec69;
  color: #000;
  word-break: break-all;
  align-self: flex-end;
}
.ai {
  padding: 35px 30px 10px;
  background-color: #fff;
  border-radius: 20px 20px 20px 5px;
  align-self: flex-start;
}

.infoMe-time {
  color: #fff;
  user-select: none;
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

.infoAI-time {
  color: #fff;
  user-select: none;
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

.copyImg {
  position: absolute;
  top: 15px;
  left: 25px;
  cursor: pointer;
  width: 25px;
  height: 25px;
}

.trumpetImg {
  position: absolute;
  top: 15px;
  left: 70px;
  cursor: pointer;
  width: 25px;
  height: 25px;
}

.copySendImg {
  position: absolute;
  left: -35px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  width: 25px;
  height: 25px;
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

.clears {
  position: relative;
  cursor: pointer;
  width: 10%;
  background-color: wheat;
  border: 0;
  transition: 0.3s;
  font-style: 20px;
  box-shadow: 0px 0px 5px 0px wheat;

  img {
    width: 30px;
    height: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.optionals {
  position: relative;
  cursor: pointer;
  width: 10%;
  background-color: #fff;
  border: 0;
  border-radius: 5%;
  transition: 0.3s;
  font-style: 20px;

  img {
    width: 30px;
    height: 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.ai-content {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #292a2d;
  line-height: 24px;
}

.loadEffect {
  display: none;
  width: 100px;
  height: 100px;
  left: 50%;
  top: 50%;
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
  background-image: linear-gradient(
    to right,
    #ff5b5b,
    #ffbd2f,
    #21d07a,
    #3c7bff
  );
  background-size: auto 100%;
  animation: loading 2s ease-in-out infinite alternate;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
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
