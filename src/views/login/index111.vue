<template>
  <div class="login-box">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <h2 class="login-title">欢迎登陆</h2>
      <el-form-item label="身份" prop="status" class="status-select">
        <el-select v-model="form.status" placeholder="请选择" style="width: 338px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="form.userName" aria-placeholder="请输入用户名"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" aria-placeholder="请输入密码"></el-input>
      </el-form-item>

      <el-form-item label="验证码" prop="code">
        <el-input v-model="form.code" aria-placeholder="请输入验证码"></el-input>
        <div class="identifybox">
          <img slot="suffix" class="verificationCode" @click="changeCaptchaUrl" ref="codeImg">
          <el-button @click="changeCaptchaUrl" type='text' class="textbtn">看不清，换一张</el-button>
        </div>
      </el-form-item>


      <el-form-item class="login-button" align="right">
        <el-button type="primary" @click="onSubmit('form')">登录</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>

export default {
  userName: 'Login',
  data() {
    return {
      token: '',
      form: {
        userName: '',
        password: '',
        status: '',
        code: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择身份', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '长度为4', trigger: 'blur' }
        ]
      },
      options: [{
        value: '局长',
        label: '局长'
      }, {
        value: '副局长',
        label: '副局长'
      }, {
        value: '干事',
        label: '干事'
      }, {
        value: '人事部门管理员',
        label: '人事部门管理员'
      }, {
        value: '股所所长',
        label: '股所所长'
      }],
      value: ''
    }
  },
  mounted() {
    this.changeCaptchaUrl()
  },
  methods: {
    onSubmit: function(formName) {
      this.$refs[formName].validate((valid) => {
        var vm = this
        if (valid) {
          this.axios({
            method: 'post',
            //url: 'http://81.70.146.96:8080//Spring_Web_exploded/login',
            url: '/api/login',
            headers: {
              'Access-Token': vm.token,
              'Content-Type': 'application/json;charset=UTF-8'

            },
            xhrFields: {
              withCredentials: true
            },
            data: JSON.stringify({
              userName: vm.form.userName,
              password: vm.form.password,
              status: vm.form.status,
              code: vm.form.code
            })

          }).then(function(response) {
            var typecode = response.data
            console.log(typecode)
            if (typecode == 'success') {
              vm.$message({
                message: '登陆成功',
                type: 'success'
              })
              //vm.$router.push('/dashboard')
              vm.$router.push({ path: this.redirect || '/' })
            } else {
              if (typecode == 'nameerror') {
                vm.$message.error('账号不存在')
              } else if (typecode == 'passworderror') {
                vm.$message.error('密码不正确')
              } else if (typecode == 'codeerror') {
                vm.$message.error('验证码不正确')
              } else if (typecode == 'statuserror') {
                vm.$message.error('身份不符合')
              } else {
                vm.$message.error('登陆失败')
              }
              vm.changeCaptchaUrl()
              console.log('aaaaa')
            }
          })
        } else {
          console.log('error submit!!')
          vm.$message.error('用户名或密码格式不正确')
          return false
        }
      })
    },
    changeCaptchaUrl: function() {
      var vm = this
      this.axios({
        method: 'get',
        url: '/api/getcode',
        responseType: 'blob'
        //headers: {'Access-Token': vm.token}
      }).then(function(response) {
        var img = vm.$refs.codeImg
        let url = window.URL.createObjectURL(response.data)
        img.src = url
        //取得后台通过响应头返回的sessionId的值
        vm.token = response.headers['access-token']
      })
      console.log(vm.token)
    }
  }

}
</script>

<style scoped>
.login-box {
  width: 500px;
  height: 450px;
  border: 1px solid #DCDFE6;
  margin: 150px auto;
  padding: 20px 50px 20px 30px;
  border-radius: 20px;
  box-shadow: 0px 0px 20px #DCDFE6;
}

.login-title {
  text-align: center;
  margin-bottom: 40px;
}

.login-button {
  margin-right: 20px;
  margin-top: -50px;
}

.status-select {
  width: 200%;
}

.identifybox {
  margin: 10px;
}
</style>
