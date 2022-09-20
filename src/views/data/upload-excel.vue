<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item"/>
    </el-table>

    <el-dialog :title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="infoRules" :model="createTemp" label-position="left" label-width="150px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="字段名称所在行数" prop="field">
          <el-input v-model="nameIndex"/>
        </el-form-item>
        <el-form-item label="单位所在行数" prop="type">
          <el-input v-model="unitIndex"/>
        </el-form-item>
        <el-form-item label="中文含义所在行数" prop="collation">
          <el-input v-model="meansIndex"/>
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

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      file: undefined,
      dialogFormVisible:false,
      nameIndex:1,
      unitIndex:-1,
      meansIndex:-1
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 100
      this.file = file

      this.dialogFormVisible = true

      // this.test(file)
      //
      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 100M in size.',
        type: 'warning'
      })
      return false
    },
    submitTable(){
      this.test(this.file)
      this.dialogFormVisible = false
    },
    test(file) {
      let formdata = new FormData()
      formdata.append('file', file)
      formdata.append('title', '')
      formdata.append('url', '')
      console.log(file)
      var vm = this
      this.axios.post('api/createtable/' + this.nameIndex + '/' + this.unitIndex + '/' + this.meansIndex, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(function(response) {
          console.log(response)

          if (response.data.code == 20000) {
            vm.$notify({
              title: '成功',
              message: '导入成功',
              type: 'success',
              duration: 2000
            })
          }else {
            vm.$notify.error({
              title: '错误',
              message: '文件格式错误'
            });
          }

        })
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    }
  }
}
</script>
