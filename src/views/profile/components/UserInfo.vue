<template>
  <el-form>
    <el-form-item label="身份">
      <el-input :value="info.status|statusFilter" readonly/>
    </el-form-item>
    <el-form-item label="用户名">
      <el-input v-model.trim="info.userName"/>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model.trim="info.password"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updatUser } from '@/api/user-admin'

export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          person: {}
        }
      }
    }
  },
  data() {
    return {
      userTemp: {
        userName: '',
        password: '',
        id: '',
        status: ''
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'admin': '局长',
        'fuadmin': '副局长',
        'useradmin': '人事管理员',
        'officer': '干事',
        'stockadmin': '股所所长'
      }
      return statusMap[status]
    }
  },
  methods: {
    submit() {
      this.userTemp = {
        userName: this.info.userName,
        password: this.info.password,
        id: this.info.person.personID,
        status: this.info.status
      }

      this.userUpdata()
    },

    userUpdata() {
      var vm = this

      updatUser(this.userTemp).then(() => {

        vm.$notify({
          title: '成功',
          message: '编辑成功',
          type: 'success',
          duration: 2000
        })

      })

    }
  }
}
</script>
