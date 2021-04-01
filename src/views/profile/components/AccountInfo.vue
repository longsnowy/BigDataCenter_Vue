<template>
  <el-form>
    <el-form-item label="姓名" prop="personName">
      <el-input v-model.trim="info.person.personName"/>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-input v-model.trim="info.person.sex"/>
    </el-form-item>
    <el-form-item label="身份证号" prop="personID">
      <el-input v-model.trim="info.person.personID" readonly/>
    </el-form-item>
    <el-form-item label="政治面貌" prop="politic">
      <el-input v-model.trim="info.person.politic"/>
    </el-form-item>
    <el-form-item label="职位" prop="position">
      <el-input v-model.trim="info.person.position" readonly/>
    </el-form-item>
    <el-form-item label="专业特长" prop="speciality">
      <el-input v-model.trim="info.person.speciality"/>
    </el-form-item>
    <el-form-item label="部门" prop="department">
      <el-input v-model.trim="info.person.department.name"/>
    </el-form-item>
    <el-form-item label="绩效">
      <el-input :value="getPerformance(info.person.personID)" readonly/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit()">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getPerformanceById, updatePerson } from '@/api/user-admin'

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
      performance: '111',
      info2: this.info,
      createTemp: {
        personName: '',
        sex: '男',
        personID: '341623200009064450',
        politic: '党员',
        position: '环卫',
        speciality: '团队协作',
        department: 3
      }
    }
  },
  methods: {
    submit() {
      console.log(this.info)
      console.log(this.info.person.personName)
      console.log(this.info.status)
      this.createTemp = {
        personName: this.info.person.personName,
        sex: this.info.person.sex,
        personID: this.info.person.personID,
        politic: this.info.person.politic,
        position: this.info.person.position,
        speciality: this.info.person.speciality,
        department: this.info.person.department.id
      }
      // this.createTemp.personName = this.info.person.personName
      // this.createTemp.sex = this.info.person.sex
      // this.createTemp.personID = this.info.person.personID
      // this.createTemp.politic = this.info.person.politic
      // this.createTemp.position = this.info.person.position
      // this.createTemp.department = this.info.person.department.id
      // this.createTemp.speciality = this.info.person.speciality
      // this.status = info.status
      console.log('createTemp' + this.createTemp.personID)
      this.updateData()
    },
    updateData() {
      var vm = this

      updatePerson(vm.createTemp).then(() => {

        vm.$notify({
          title: '成功',
          message: '编辑成功',
          type: 'success',
          duration: 2000
        })

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
