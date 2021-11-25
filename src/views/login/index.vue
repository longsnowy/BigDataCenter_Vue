<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">数据中心</h3>
      </div>
      <!-- <el-form-item label="" prop="status">
        <el-select v-model="loginForm.status" placeholder="请选择身份" style="width:100%">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
<!--
      <el-form-item label="" prop="code">
        <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
        <div class="identifybox">
          <img slot="suffix" class="verificationCode" @click="changeCaptchaUrl" ref="codeImg">
          <el-button @click="changeCaptchaUrl" type='text' class="textbtn">看不清，换一张</el-button>
        </div>
      </el-form-item> -->

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      <!-- <div class="tips">
        <span style="margin-right:20px;">账号: 请找人事管理员获取账号</span>
        <span> 初始密码: 000000</span>
      </div> -->

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import {getCode} from '@/api/user'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        status: 'admin',
        username: 'admin',
        password: 'admin',
        // code: '',
        // token: ''
      },
      loginRules: {
        // status: [{ required: true, message: '请选择身份', trigger: 'change' }],
        username: [{ required: true,  message: '请输入用户名',trigger: 'blur'}, { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码',trigger: 'blur'}, { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }],
        // code:[{ required: true,message: '请输入验证码', trigger: 'blur' }, { min: 4, max: 4, message: '长度为4个字符', trigger: 'blur' }]
      },
      // options: [{
      //   value: 'admin',
      //   label: '局长'
      // }, {
      //   value: 'fuadmin',
      //   label: '副局长'
      // }, {
      //   value: 'officer',
      //   label: '干事'
      // }, {
      //   value: 'useradmin',
      //   label: '人事admin'
      // }, {
      //   value: 'stockadmin',
      //   label: '股所所长'
      // }],
      value: '',
      token: '',
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    // this.changeCaptchaUrl()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // changeCaptchaUrl: function() {
    //   var vm = this
    //   this.axios({
    //     method: 'get',
    //     url: 'http://localhost:8080/Spring_Web_exploded/getcode',
    //     responseType: 'blob'
    //     //headers: {'Access-Token': vm.token}
    //   }).then(function(response) {
    //     var img = vm.$refs.codeImg
    //     let url = window.URL.createObjectURL(response.data)
    //     img.src = url
    //     //取得后台通过响应头返回的sessionId的值
    //     vm.loginForm.token = response.headers['access-token']
    //     // console.log(response.headers)
    //     // console.log('function111' + vm.loginForm.token)
    //   })
    //   // console.log(vm.token)
    // },
    handleLogin() {
      var vm = this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          console.log('handleLogin');
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            // this.loading =
            //   vm.changeCaptchaUrl()
          })
        } else {
          console.log('登陆失败')
          // vm.changeCaptchaUrl()
          return false
        }

        console.log(11111)
      })

    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 70px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .status-select{
    width: 100%;
  }

  .verificationCode{
    margin: 10px;
  }
}
</style>
