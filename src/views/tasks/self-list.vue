<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="任务名称" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.taskName }}</span>
        </template>
      </el-table-column>


      <el-table-column width="120px" align="center" label="发布人">
        <template slot-scope="scope">
          <span v-for="person in userListOptions">
              <el-button plain size="mini" type="primary" v-if="scope.row.sender===person.personID"
                         @click="showUserInfo(person)">{{ person.personName }}</el-button>
          </span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="执行人">
        <template slot-scope="scope">
          <!--          <el-tag type="success" v-for="receiver in scope.row.recipients">{{ receiver }}</el-tag>-->
          <span v-for="receiver in scope.row.recipients">
            <span v-for="person in userListOptions">
              <el-button plain size="mini" type="primary" v-if="receiver===person.personID"
                         @click="showUserInfo(person)">{{ person.personName }}</el-button>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="重要性">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon"/>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="发布日期">
        <template slot-scope="scope">
          <span>{{ scope.row.beginTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="截止日期">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="任务状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            <span v-if="row.status === 0">未完成</span>
            <span v-if="row.status === 1">已完成</span>
            <span v-if="row.status === 2">已取消</span>
          </el-tag>
        </template>
      </el-table-column>

      <!--      <el-table-column min-width="300px" label="Title">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <router-link :to="'/example/edit/'+row.id" class="link-type">-->
      <!--            <span>{{ row.title }}</span>-->
      <!--          </router-link>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="showTask(scope.row.text)" style="margin-right: 10px">
            查看
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="updateTap(scope.row)">
            完成
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="num" @pagination="getList"/>

    <el-dialog title="信息" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="infoTemp" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="infoTemp.personName" readonly/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-input v-model="infoTemp.sex" readonly/>
        </el-form-item>
        <el-form-item label="身份证号" prop="personID">
          <el-input v-model="infoTemp.personID" readonly/>
        </el-form-item>
        <el-form-item label="政治面貌" prop="politic">
          <el-input v-model="infoTemp.politic" readonly/>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="infoTemp.department.name" readonly/>
        </el-form-item>
        <!--        <el-form-item label="职位类别" prop="status">-->
        <!--          <el-select v-model="temp.status" placeholder="职位类别" style="width:100%">-->
        <!--            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="职位" prop="position">
          <el-input v-model="infoTemp.position" readonly/>
        </el-form-item>
        <el-form-item label="专业特长" prop="speciality">
          <el-input v-model="infoTemp.speciality" readonly/>
        </el-form-item>
        <!--        <el-form-item label="部门" prop="department">-->
        <!--          <el-input v-model="addTemp.person.department.id"/>-->
        <!--        </el-form-item>-->

        <!--        <el-form-item label="绩效" prop="score">-->
        <!--          <el-input v-model="addTemp.personPo.score"/>-->
        <!--        </el-form-item>-->


      </el-form>
      <!--      <div slot="footer" class="dialog-footer">-->
      <!--        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">-->
      <!--          提交-->
      <!--        </el-button>-->
      <!--        <el-button @click="dialogFormVisible = false">-->
      <!--          取消-->
      <!--        </el-button>-->
      <!--      </div>-->
    </el-dialog>

    <el-dialog title="任务详情" width="70%" :visible.sync="contentVisible">
      <div class="editor-content" v-html="this.content" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/user-admin'
import { getSelfTasks, deleteTaskById,updateTask } from '@/api/task-admin'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'warning',
        1: 'success',
        2: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        id: '',
        taskName: '',
        senderId: '',
        text: '',
        beginTime: '',
        endTime: '',
        importance: '',
        status: ''
      },
      page: 1,
      num: 20,
      userListOptions: [],
      userQuery: {
        name: '',
        sex: '',
        department: '',
        page: 1,
        num: 200
      },
      tapTemp:{
        ID:'',
        taskId:'',
        recipientId:'',
        state:1
      },
      dialogFormVisible: false,
      infoTemp: {
        personName: '',
        sex: '男',
        personID: '341623200009064450',
        politic: '党员',
        position: '环卫',
        department: {
          name: '',
          id: 1,
          info: ''
        },
        speciality: '团队协作'
      },
      content:'',
      contentVisible:false

    }
  },
  created() {
    this.getList()
    this.getRemoteUserList()
  },
  methods: {
    getList() {
      this.listLoading = false
      getSelfTasks(this.listQuery, this.page, this.num).then(response => {
        this.list = response.data.items
        // this.total = response.data.total
        this.listLoading = false
      })
    },
    getRemoteUserList() {
      fetchList(this.userQuery).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items
        // console.log(this.userListOptions)
        // console.log(this.list)
      })
    },
    updateTap(row) {
      var vm = this;
      this.tapTemp.taskId = row.id;
      updateTask(this.tapTemp).then(response => {
        vm.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    showUserInfo(person) {
      this.infoTemp.personID = person.personID
      this.infoTemp.personName = person.personName
      this.infoTemp.sex = person.sex
      this.infoTemp.politic = person.politic
      this.infoTemp.position = person.position
      this.infoTemp.department = person.department
      this.infoTemp.speciality = person.speciality

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    showTask(text){
      this.content = text;
      this.contentVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteTask(id){
      var vm = this;
      deleteTaskById(id).then(response => {
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
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
