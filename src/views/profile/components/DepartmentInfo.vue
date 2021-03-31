<template>
  <el-form>
    <el-form-item label="部门名称">
      <el-input v-model.trim="info.person.department.name" readonly/>
    </el-form-item>
    <el-form-item label="部门编号">
      <el-input v-model.trim="info.person.department.id" readonly/>
    </el-form-item>
    <el-form-item label="部门信息">
      <el-input v-model.trim="info.person.department.info" readonly/>
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
