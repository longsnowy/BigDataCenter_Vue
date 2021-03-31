<template>
  <div class="app-container">
    <div class="filter-container">
<!--      <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item"-->
<!--                @keyup.enter.native="handleFilter"/>-->
<!--      <el-select v-model="listQuery.sex" placeholder="性别" clearable style="width: 90px" class="filter-item">-->
<!--        <el-option v-for="item in sexs" :key="item" :label="item" :value="item"/>-->
<!--      </el-select>-->
<!--      <el-input v-model="listQuery.department" placeholder="部门" style="width: 200px;" class="filter-item"-->
<!--                @keyup.enter.native="handleFilter"/>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        刷新
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="部门编号" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门名称" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门信息" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.info }}</span>
        </template>
      </el-table-column>


      <el-table-column label="选项" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!--          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>-->
          <!--          <el-button type="primary" size="mini" @click="userUpdata(row)">用户名密码</el-button>-->
          <el-button v-if="row.status!='删除'" size="mini" @click="handleDelete(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.num"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="addTemp" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
<!--        <el-form-item label="部门id" prop="id">-->
<!--          <el-input v-model="addTemp.id"/>-->
<!--        </el-form-item>-->
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="addTemp.name"/>
        </el-form-item>

        <el-form-item label="部门信息" prop="info">
          <el-input v-model="addTemp.info"/>
        </el-form-item>

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

import { getDepartments, createDepartment, deleteDepartment } from '@/api/department-admin'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
      total: 0,
      listLoading: true,
      listQuery: {
        // limit: 20,
        // sort: '绩效降序',

        name: '',
        sex: '',
        department: undefined,
        page: 1,
        num: 20

      },
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
        department: undefined,
        score: 88,
        status: '干事'
      },
      addTemp: {
        id: '',
        name: '',
        info: ''
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
  },
  methods: {
    getList() {
      this.listLoading = false
      getDepartments().then(response => {
        this.list = response.data.items
        // console.log(this.list)
        // this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
      this.addTemp = {
          id: '',
          name: '',
          info: ''
      }
    },
    handleCreate() {
      this.resetTemp()
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
          createDepartment(this.addTemp).then(() => {
            this.list.unshift(this.addTemp)
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
      this.addTemp = Object.assign({}, row) // copy obj
      this.addTemp.timestamp = new Date(this.addTemp.timestamp)
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
          const tempData = Object.assign({}, this.addTemp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updatePerson(this.addTemp).then(() => {
            const index = this.list.findIndex(v => v.id === this.addTemp.personID)
            this.list.splice(index, 1, this.addTemp)
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
    },
    handleDelete(row, index) {
      var vm = this
      deleteDepartment(row.id).then(response => {
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
        const tHeader = ['姓名', '性别', '身份证号', '政治面貌', '职位', '专业特长', '部门', '绩效']
        const filterVal = ['personName', 'sex', 'personID', 'politic', 'status', 'speciality', 'department', 'score']
        const data = this.formatJson(filterVal)
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
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
