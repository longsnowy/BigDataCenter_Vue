<template>
  <el-form>
    <el-form-item label="姓名">
      <el-input v-model.trim="info.person.personName"/>
    </el-form-item>
    <el-form-item label="性别">
      <el-input v-model.trim="info.person.sex"/>
    </el-form-item>
    <el-form-item label="身份证号">
      <el-input v-model.trim="info.person.personID" readonly/>
    </el-form-item>
    <el-form-item label="政治面貌">
      <el-input v-model.trim="info.person.politic"/>
    </el-form-item>
    <el-form-item label="专业特长">
      <el-input v-model.trim="info.person.speciality"/>
    </el-form-item>
    <el-form-item label="部门">
      <el-input v-model.trim="info.person.department.name"/>
    </el-form-item>
    <el-form-item label="绩效">
      <el-input :value="getPerformance(info.person.personID)" readonly/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getPerformanceById } from '@/api/user-admin'

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
    return{
      performance:'111'
    }
  },
  methods: {
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    },
    getPerformance(personID) {
      var task
      var sign
      var sign2
      getPerformanceById(personID).then(response => {
        task = '任务: ' + response.data.overTask + '/' + response.data.allTask + '  '
        sign = '签到次数: ' + response.data.overSign + '  '
        sign2 = '未签到次数: ' + response.data.notSign + '  '

        console.log(task + sign + sign2)
        this.performance = task + sign + sign2
      })

      return this.performance
    }

  }


}
</script>
