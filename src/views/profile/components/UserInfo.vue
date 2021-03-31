<template>
  <el-form>
    <el-form-item label="身份">
      <el-input :value="info.status|statusFilter" readonly/>
    </el-form-item>
    <el-form-item label="用户名">
      <el-input v-model.trim="info.userName" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model.trim="info.password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          person:{}
        }
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
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
