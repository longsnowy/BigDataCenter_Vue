<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="title">
        <template slot-scope="scope">
<!--          <span>{{ scope.row.title }}</span>-->
          <el-link type="primary" @click="showNewsInfo(scope.row.content)">{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="1" :total="total" :page.sync="page" :limit.sync="num" @pagination="getList"/>

    <el-dialog title="新闻详情" width="70%" :visible.sync="contentVisible">
      <div class="editor-content" v-html="this.content" />
    </el-dialog>

    <el-dialog title="新闻详情" width="70%" :visible.sync="dialogFormVisible">
      <div class="editor-content" v-html="this.content" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/user-admin'
import { getNews } from '@/api/news'
import { getTasks, deleteTaskById } from '@/api/task-admin'
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
    // this.getRemoteUserList()
  },
  methods: {
    getList() {
      this.listLoading = false
      var vm  = this
      getNews(vm.$route.params.tablename, this.page, this.num).then(response => {
        this.list = response.data.items
        this.total = response.data.totals
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
    showNewsInfo(data) {
      this.content = data;
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    showNews(text){
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
