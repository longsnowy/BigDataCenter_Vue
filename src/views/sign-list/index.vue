<template>
  <div class="app-container">
    <div class="filter-container">

      <el-date-picker
        v-model="listQuery.date"
        align="right"
        type="date"
        format="yyyy-MM-dd"
        placeholder="选择日期"
        :picker-options="pickerOptions">
      </el-date-picker>

      <el-select v-model="listQuery.isnoon" placeholder="请选择时间段">
        <el-option
          v-for="item in isnoonOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-select v-model="listQuery.state" placeholder="状态">
        <el-option
          v-for="item in issignedOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
<!--      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"-->
<!--                 @click="handleDownload">-->
<!--        导出-->
<!--      </el-button>-->
    </div>

    <el-table
      v-loading="listLoading"
      :data="this.list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="姓名" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.person.personName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.person.personID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="政治面貌" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.person.politic }}</span>
        </template>
      </el-table-column>

      <el-table-column label="职位" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.person.position }}</span>
        </template>
      </el-table-column>

      <el-table-column label="所在部门" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.person.department.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.state===0">未签到</span>
          <span v-if="row.state===1">已签到</span>
        </template>
      </el-table-column>

<!--      <el-table-column label="选项" align="center" width="260" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="{row,$index}">-->
<!--          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>-->
<!--          <el-button type="primary" size="mini" @click="userUpdata(row)">用户名密码</el-button>-->
<!--          <el-button v-if="row.status!='删除'" size="mini" @click="handleDelete(row,$index)">删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="this.pageOps.page" :limit.sync="this.pageOps.num"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="createTemp" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="姓名" prop="personName">
          <el-input v-model="createTemp.personName"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="createTemp.sex" class="filter-item" placeholder="请选择">
            <el-option v-for="item in sexs" :key="item" :label="item"
                       :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="personID">
          <el-input v-model="createTemp.personID" v-if="dialogStatus === 'create'"/>
          <el-input v-model="createTemp.personID" v-if="dialogStatus != 'create'" disabled/>
        </el-form-item>
        <el-form-item label="政治面貌" prop="politic">
          <el-input v-model="createTemp.politic"/>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select
            v-model="createTemp.department"
            placeholder="请选择部门">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职位类别" prop="status">
          <el-select v-model="temp.status" placeholder="职位类别" style="width:100%">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体职位" prop="position">
          <el-input v-model="createTemp.position"/>
        </el-form-item>
        <el-form-item label="专业特长" prop="speciality">
          <el-input v-model="createTemp.speciality"/>
        </el-form-item>
        <!--        <el-form-item label="部门" prop="department">-->
        <!--          <el-input v-model="addTemp.person.department.id"/>-->
        <!--        </el-form-item>-->

        <!--        <el-form-item label="绩效" prop="score">-->
        <!--          <el-input v-model="addTemp.personPo.score"/>-->
        <!--        </el-form-item>-->


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogUserVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="身份证号" prop="personID">
          <el-input v-model="addTemp.person.personID" disabled/>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addTemp.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addTemp.password"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
        <el-button @click="dialogUserVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  getUsers,
  addPerson,
  deletePerson,
  updatePerson,
  fetchPv,
  createArticle,
  updateArticle
} from '@/api/user-admin'

import { sign, signedList } from '@/api/user'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { getDepartments } from '@/api/department-admin' // secondary package based on el-pagination

export default {
  name: 'UserAdmin',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
    // typeFilter(type) {
    //   return calendarTypeKeyValue[type]
    // }
  },
  data() {
    return {
      // tableKey: 0,
      list: undefined,
      departmentList: undefined,
      total: 0,
      listLoading: true,
      listQuery: {
        id: '',
        personId: '',
        date: '',
        time: '',
        isnoon: '',
        state: '1'
      },
      pageOps:{
        page: 1,
        num: 20
      },
      sexs: ['男', '女'],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      isnoonOptions: [{
        value: '0',
        label: '上午'
      }, {
        value: '1',
        label: '下午'
      }],
      issignedOptions: [{
        value: '1',
        label: '已签到'
      }, {
        value: '0',
        label: '未签到'
      }],
      temp: {
        personName: '',
        sex: '男',
        personID: 341623200009064450,
        politic: '党员',
        position: '环卫',
        speciality: '团队协作',
        department: {},
        score: 88,
        status: ''
      },
      addTemp: {
        person: {
          personName: '',
          sex: '男',
          personID: '341623200009064450',
          politic: '党员',
          position: '环卫',
          department: {
            id: 1,
            name: '',
            info: ''
          },
          speciality: '团队协作'
        },
        username: '',
        password: '',
        status: 'admin'
      },
      createTemp: {
        personName: '',
        sex: '男',
        personID: '341623200009064450',
        politic: '党员',
        position: '环卫',
        department: 3,
        speciality: '团队协作'
      },
      options: [{
        value: 'admin',
        label: '局长'
      }, {
        value: 'fuadmin',
        label: '副局长'
      }, {
        value: 'officer',
        label: '干事'
      }, {
        value: 'useradmin',
        label: '人事admin'
      }, {
        value: 'stockadmin',
        label: '股所所长'
      }],
      userTemp: {
        personID: '',
        username: '',
        password: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增',
        userpass: '用户名密码'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      dialogUserVisible: false,
      userdata: {
        personID: '',
        username: '',
        password: ''
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getDepartmentList()
  },
  methods: {
    getList() {
      this.listLoading = false
      signedList(this.listQuery,this.pageOps).then(response => {
        this.list = response.data.items
        // console.log(this.list)
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getDepartmentList() {
      this.listLoading = false
      getDepartments().then(response => {
        this.departmentList = response.data.items
        // console.log(this.list)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },

    resetTemp() {
      this.temp = {
        personName: '',
        sex: '',
        personID: '',
        politic: '',
        status: '',
        speciality: '',
        department: ''
      }
      this.addTemp = {
        person: {
          personName: '',
          sex: '',
          personID: '',
          politic: '',
          position: '',
          department: '',
          speciality: ''
        },
        username: '',
        password: '',
        status: ''
      }
      this.createTemp = {
        personName: '',
        sex: '',
        personID: '',
        politic: '',
        position: '',
        department: '',
        speciality: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.getDepartmentList()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      var vm = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addPerson(this.createTemp, this.temp.status).then(() => {
            this.list.unshift(this.createTemp)
            this.dialogFormVisible = false

            vm.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })

          })
        }
      })

    },
    handleUpdate(row) {
      this.temp.status = row.status
      this.createTemp.personID = row.person.personID
      this.createTemp.personName = row.person.personName
      this.createTemp.sex = row.person.sex
      this.createTemp.politic = row.person.politic
      this.createTemp.position = row.person.position
      this.createTemp.speciality = row.person.speciality
      this.createTemp.department = row.person.department.id

      this.temp.status = row.status
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    userUpdata(row) {
      this.addTemp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'userpass'
      this.dialogUserVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      var vm = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updatePerson(this.createTemp).then(() => {
            const index = this.list.findIndex(v => v.id === this.createTemp.personID)
            this.list.splice(index, 1, this.createTemp)
            this.dialogFormVisible = false
            vm.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
      this.getList()
    },
    handleDelete(row, index) {
      var vm = this
      deletePerson(row.person.personID).then(response => {
        // this.list = response.data.items
        // this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)

        vm.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })

        vm.getList()
      })

      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['姓名', '身份证号', '日期', '时间', '状态']
        const filterVal = ['person.personName', 'person.personID', 'date', 'time', 'status']
        const data = this.formatJson(filterVal,this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
