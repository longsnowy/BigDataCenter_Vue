<template>
  <div class="app-container">


    <el-button style="margin-right:16px;float: right" size="mini" type="primary" @click="download()">
      下载模板
    </el-button>

    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item"/>
    </el-table>

    <el-dialog :title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="infoRules" :model="beginIndex" label-position="left" label-width="150px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="数据开始行数" prop="field">
          <el-input v-model="beginIndex"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTable()">
          提交
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel'
import { getFileUrl } from '@/api/datasource'

export default {
  name: 'AddFromExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      file: undefined,
      filrurl: '',
      dictionary: [],
      beginIndex:1,
      dialogFormVisible:false
    }
  },
  mounted() {
    this.getDic()
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 100
      this.file = file

      this.dialogFormVisible = true

      // this.test(file)

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 100M in size.',
        type: 'warning'
      })
      return false
    },
    getDic() {
      var vm = this
      getFileUrl(this.$route.params.id).then(response => {
        vm.filrurl = response.data.fileurl
        console.log('vm dic   ' + vm.filrurl)
      })
      console.log(this.filrurl)
    },
    download() {
      window.open(this.filrurl)
    },
    test(file) {
      var vm = this
      let formdata = new FormData()
      formdata.append('file', file)
      formdata.append('title', '')
      formdata.append('url', '')
      console.log(file)
      this.axios.post('api/addfromexcel/' + vm.$route.params.id + '/' + vm.beginIndex, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(function(response) {
          if (response.data.code == 20000) {
            vm.$notify({
              title: '成功',
              message: '导入成功',
              type: 'success',
              duration: 2000
            })
          } else {
            vm.$notify.error({
              title: '错误',
              message: '文件格式错误'
            })
          }

          vm.dialogFormVisible = false
        })
      console.log(response)
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    },
    submitTable(){
      this.test(this.file)
      this.dialogFormVisible = false
    }
  }
}
</script>
