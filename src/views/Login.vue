<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 登录表单区域 -->
      <div class="login">
        <img src="@/assets/images/home/logo.png" class="webLogo" alt="Logo" />
        <h3 class="loginTitle">ChattyPlay欢迎您~</h3>
        <el-form
          ref="LoginFormRef"
          :rules="loginFormRules"
          class="login_form"
          :model="loginForm"
          label-width="70px"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入您的ChattyPlay账号"
              autocomplete="off"
              clearable
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              placeholder="请输入您的ChattyPlay密码"
              prefix-icon="el-icon-lock"
              v-model="loginForm.password"
              show-password
              clearable
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="验证码"
            prop="code"
            style="border-bottom: 1px solid black; padding-bottom: 30px"
          >
            <el-input
              style="width: 55%"
              placeholder="请输入右侧的验证码"
              prefix-icon="el-icon-key"
              maxlength="4"
              clearable
              v-model="loginForm.code"
              autocomplete="off"
            ></el-input>
            <div
              style="display: flex; cursor: pointer; user-select: none"
              @click="switchCode"
            >
              <VerifyCode ref="codeRef" :identifyCode="randomCode" />
            </div>
          </el-form-item>
          <div class="loginExact">
            <div style="display: flex">
              <input ref="agreeRef" id="agree" type="checkbox" checked />
              <label for="agree" style="cursor: pointer; user-select: none"
                >同意协议</label
              >
            </div>
            <div
              style="cursor: pointer"
              @click="$message.error('该功能暂未开放，敬请期待~')"
            >
              <img
                src="@/assets/images/login/QQ.png"
                alt="QQ"
                title="QQ授权登录"
              />
              <img
                style="margin-left: 15px"
                src="@/assets/images/login/WeChat.png"
                alt="WeChat"
                title="微信授权登录"
              />
            </div>
          </div>
          <el-form-item class="login_btn">
            <el-button type="success" @click="loginFn">登录</el-button>
            <el-button
              type="primary"
              @click="$router.push('/home/music')"
              >游客</el-button
            >
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="loginFooter">
      © Copyright 2023 P1Kaj1uu. All Rights Reserved.
    </div>
  </div>
</template>

<script>
import VerifyCode from '@/components/VerifyCode.vue'
import { setToken } from '@/utils/token'
import { Heart } from '@/utils/model'
import { sleep } from '@/utils/sleep'

export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        username: 'P1Kaj1uu',
        password: 'OWaGDragon',
        code: '',
        randomCode: ''
      },
      // 登录表单校验规则
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入您的ChattyPlay账号',
            trigger: 'blur'
          },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: '请输入您的ChattyPlay密码',
            trigger: 'blur'
          },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入正确的验证码', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    VerifyCode
  },
  methods: {
    // 随机生成验证码
    switchCode() {
      let str = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ]
      let res = ''
      for (let i = 0; i < 4; i++) {
        let id = Math.ceil(Math.random() * 35)
        res += str[id]
      }
      this.randomCode = res
      this.$refs.codeRef?.identifyCode &&
        this.$set(this.$refs.codeRef, 'SIdentify', this.randomCode)
    },
    // 当点击重置按钮时
    resetForm() {
      this.$refs.LoginFormRef.resetFields()
    },
    // 爱心跳动
    async heartBeat() {
      await Heart()
      // 伪数组
      let ele = document.querySelectorAll('body canvas')
      Array.from(ele).forEach((item) => {
        console.log(item.id)
        if (item.id !== 'canvas_sakura') {
          item.style.position = 'absolute'
          // 全屏显示
          item.style.top = 0
          item.style.left = 0
          item.style.zIndex = 1
          // 动态添加类名，方便后面移除
          item.classList.add('model')
        }
      })
      // 移除爱心跳动效果
      sleep(5000).then(() => {
        let element = document.querySelectorAll('body .model')
        Array.from(element).forEach((item) => {
          console.log(item.className)
          if (item.className === 'model') {
            item.style.display = 'none'
          }
        })
      })
    },
    // 当点击登录按钮时
    loginFn() {
      const isAgree = this.$refs.agreeRef.checked
      const isVerify =
        this.randomCode.toLowerCase() === this.loginForm.code.toLowerCase()
      this.$refs.LoginFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error('请先填写正确的登录信息')
          return false
        } else {
          if (!isVerify) {
            this.$message.error('验证码不正确，请重新输入')
            this.switchCode()
            return false
          } else {
            if (!isAgree) {
              this.$message.error('请同意协议后再登录')
              return false
            } else {
              this.heartBeat()
              this.$router.push('/home/music')
              setToken('Dveiklokk')
            }
          }
        }
      })
    }
  },
  created() {
    this.$message.info('系统提示：如若选择游客访问，部分功能将受到限制哦~')
    this.switchCode()
  }
}
</script>

<style lang="less" scoped>
.login_container {
  position: relative;
  height: 100%;
}
.login_box {
  height: 100%;
  background: url('@/assets/images/login/login.jpg') no-repeat;
  background-size: 100% 100%;
  position: relative;
}
.login {
  width: 450px;
  height: 400px;
  background-image: linear-gradient(
    to right,
    gray,
    paleturquoise,
    peachpuff,
    #9932cc
  );
  border-radius: 5px;
  opacity: 1.5;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.webLogo {
  cursor: pointer;
  position: absolute;
  top: -30px;
  left: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

@keyframes logoAnimation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.webLogo:hover {
  animation: logoAnimation 1.65s linear infinite;
}

.login_form {
  padding: 0px 15px;
}
.el-input {
  width: 90%;
}
.login_btn {
  display: flex;
  justify-content: center;
  margin-left: -50px;
  margin-top: 20px;
}
.loginTitle {
  margin-left: 85px;
  text-align: center;
  font-size: 25px;
  height: 90px;
  line-height: 90px;
  font-weight: 600;
  user-select: none;
  overflow: hidden;
  white-space: nowrap;
  letter-spacing: .15em;
  animation: typing 4s steps(30, end) infinite,
             blink-caret 2s step-end infinite;
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: #666 }
}

.loginExact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -15px;
}
/deep/ .el-form-item__label {
  width: 80px !important;
  color: #0d0a05;
  font-size: 16px;
}

/deep/ .el-form-item__content {
  display: flex;
}

.loginFooter {
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  user-select: none;
}
</style>
