<template>
  <div class="app-container">
    <div class="filter-container">
<!--      <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item"-->
<!--                @keyup.enter.native="handleFilter"></el-input>-->
<!--      <el-select v-model="listQuery.sex" placeholder="性别" clearable style="width: 90px" class="filter-item">-->
<!--        <el-option v-for="item in sexs" :key="item" :label="item" :value="item"/>-->
<!--      </el-select>-->
<!--      <el-input v-model="listQuery.department" placeholder="部门" style="width: 200px;" class="filter-item"-->
<!--                @keyup.enter.native="handleFilter"/>-->
<!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">-->
<!--        查询-->
<!--      </el-button>-->
<!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"-->
<!--                 @click="handleCreate">-->
<!--        新增-->
<!--      </el-button>-->
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
      <el-table-column label="id" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="type" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="fileUrl" width="590px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fileUrl }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="filePath" width="180px" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.filePath }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="tableName" width="180px" align="center">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{ row.tableName }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column label="showName" width="380px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.showName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="选项" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="push(row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="pushClean(row)">清洗</el-button>
<!--          <el-button type="primary" size="mini" @click="userPasss(row)">用户名密码</el-button>-->
          <el-button v-if="row.status!='删除'" size="mini" @click="handleDelete(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.num"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="personRules" :model="createTemp" label-position="left" label-width="90px"
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
      <el-form ref="dataForm" :rules="userRules" :model="temp" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="身份证号" prop="personID">
          <el-input v-model="userTemp.id" disabled/>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userTemp.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userTemp.password"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="userUpdata()">
          提交
        </el-button>
        <el-button @click="dialogUserVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="绩效" :visible.sync="dialogPerformanceVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="签到次数" prop="overSign">
          <el-input v-model="performanceTemp.overSign" readonly/>
        </el-form-item>
        <el-form-item label="未签到次数" prop="notSign">
          <el-input v-model="performanceTemp.notSign" readonly/>
        </el-form-item>
        <el-form-item label="完成任务数" prop="overTask">
          <el-input v-model="performanceTemp.overTask" readonly/>
        </el-form-item>
        <el-form-item label="任务总数" prop="allTask">
          <el-input v-model="performanceTemp.allTask" readonly/>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsers,
  addPerson,
  deletePerson,
  updatePerson,
  updatUser,
  getPerformanceById
} from '@/api/user-admin'

import {
  getDataSources,
  deleteDataSource
} from '@/api/datasource'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'DataSource',
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
        name: '',
        sex: '',
        department: '',
        page: 1,
        num: 200
      },
      performance: '111',
      sexs: ['男', '女'],
      // calendarTypeOptions,
      // sortOptions: [{ label: '绩效升序', key: '+score' }, { label: '绩效降序', key: '-score' }],
      // statusOptions: ['published', 'draft', 'deleted'],
      // showReviewer: false,
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
      userTemp:{
        username:'',
        password:'',
        id:'',
        status:''
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
      // userTemp: {
      //   personID: '',
      //   username: '',
      //   password: ''
      // },
      dialogFormVisible: false,
      performanceTemp:{
        allTask:undefined,
        overTask:undefined,
        overSign:undefined,
        notSign:undefined
      },
      dialogPerformanceVisible:false,
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
      personRules:{
        personName:[{ required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
        sex:[{ required: true, message: '请选择性别', trigger: 'change' }],
        personID:[{ required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 16, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }],
        politic:[
          { required: true, message: '请输入', trigger: 'change' }
        ],
        department:[{ required: true, message: '请选择部门', trigger: 'change' }],
        // status:[ { required: true, message: '请选择', trigger: 'change' }],
        position:[{ required: true, message: '请输入', trigger: 'blur' }],
        speciality:[{ required: true, message: '请输入', trigger: 'blur' }]
      },
      userRules:{
        username: [ { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }],
        password: [{ min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }]
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

  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = false
      getDataSources(this.listQuery).then(response => {
        this.list = response.data.items
        console.log(this.list)
        this.total = response.data.total
        console.log(response.data)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    push(row){
      this.$router.push('/tabledata/' + row.id)
    },
    pushClean(row){
      this.$router.push('/dataclean/' + row.id)
    },

    handleFilter() {
      this.listQuery.page = 1
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

      // this.createTemp.department = this.createTemp.department.id
      // console.log(row.person.department)
      this.temp.status = row.status
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    userPasss(row){
      this.userTemp.username = row.username
      this.userTemp.password = row.password
      this.userTemp.id = row.person.personID
      this.userTemp.status = row.status
      this.dialogUserVisible = true
    },
    userUpdata() {
      var vm = this

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updatUser(this.userTemp).then(() => {

            vm.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })

          })
        }
      })

    },
    updateData() {
      var vm = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updatePerson(this.createTemp, this.temp.status).then(() => {
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
      deleteDataSource(row.id).then(response => {
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
    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['姓名', '性别', '身份证号', '政治面貌', '职位', '专业特长', '部门']
    //     const filterVal = ['personName', 'sex', 'personID', 'politic', 'status', 'speciality', 'department']
    //     // const data = this.formatJson(filterVal)
    //     const data = this.list
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: 'table-list'
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
    // getSortClass: function(key) {
    //   const sort = this.listQuery.sort
    //   return sort === `+${key}` ? 'ascending' : 'descending'
    // }
  }
}
</script>
