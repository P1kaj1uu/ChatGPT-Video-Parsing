<script>
import { defineComponent } from 'vue';
import resolveStreamResponse from '../utils/resolveStreamResponse'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const initSession = [
  {
    role: 'user',
    content: '你好'
  },
  {
    role: 'assistant',
    content: '你好，请问我能为你做什么？'
  }
]

export default defineComponent({
  data(){
    return {
      messages: this.getSessionCache() ? this.getSessionCache() : initSession,
      inputValue: '',
    }
  },
  methods: {
    handleSend() {
      if (this.inputValue !== '') {
        this.messages.push({
          role: 'user',
          content: this.inputValue.trim()
        })
        this.getGPTResponse(this.inputValue)
        this.inputValue = ''
      }
    },
    async getGPTResponse(content) {
      const fetchPromise = fetch(`https://mychat.freechatgpt.cc/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'content-type':'application/json'
        },
        body:JSON.stringify({
          frequency_penalty: 0,
          max_tokens: 1000,
          messages: this.messages,
          model: 'gpt-3.5-turbo',
          n: 1,
          presence_penalty: 0,
          stop: '',
          stream: true,
          temperature: 1,
          top_p: 1
        })
      })

      const message = {
        role: 'assistant',
        content: ''
      }

      this.messages.push(message)

      resolveStreamResponse(fetchPromise,
        (data) => {  message.content += data.choices.map(_=>_.delta.content).join('') },
        (err) => {console.log('错误！',err); },
        () => { localStorage.setItem('session_cached',JSON.stringify(this.messages)) }
      )
    },
    clearSession() {
      this.messages = initSession
      this.setSessionCache()
    },
    setSessionCache() {
      return localStorage.setItem(session_cached, JSON.stringify(this.messages))
    },
    getSessionCache() {
      return JSON.parse(localStorage.getItem('session_cached'))
    },
    markdown(content) {
      const md = new MarkdownIt({
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang))
          {
            try
            {
              return '<pre class="hljs"><code>' +
                hljs.highlight(lang, str, true).value +
                '</code></pre>';
            } catch (__) { }
          }
          return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
        }
      });
      const result = md.render(content)
      return result
    }
  }
})
</script>

<template>
  <div class="container">
    <div class="chat-container">
      <div class="message" v-for="item,index in messages" :key="index">
        <div class="me chat" v-if="item.role === 'user'">
          <div v-html="markdown(item.content)"></div>
        </div>
        <div class="ai chat" v-else v-html="markdown(item.content)"></div>
      </div>
    </div>
    <div class="input-container">
      <input @keyup.enter="handleSend" v-model="inputValue"/>
      <div class="btn" @click="handleSend">发送</div>
    </div>
    <div class="btn" @click="clearSession">清空会话</div>
  </div>
</template>

<style>
.container{
  display: flex;
  flex-direction: column;
  height: 100%;
}
.chat-container{
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.chat{
  background-color: rgb(255, 255, 255);
  padding: 10px;
  margin: 10px;
  max-width: 50vw;
}
.message{
  display: flex;
  flex-direction: column;
}
.me{
  border-radius: 10px 0px 10px 10px;
  align-self: flex-end;
}
.ai{
  border-radius: 0px 10px 10px 10px;
  align-self: flex-start;
}
.btn{
  padding:10px;
  margin: 5px 10px;
  background-color: rgb(255, 210, 8);
  border-radius: 10px;
  text-align: center;
}
.input-container{
  display: flex;
}
.input-container input{
  flex: 1;
  margin: 5px;
  border-radius: 10px;
  padding: 0px 20px;
  outline: none;
  border: 0px;
  background-color: white;
}
</style>