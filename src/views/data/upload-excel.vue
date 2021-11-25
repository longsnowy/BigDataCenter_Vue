<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item"/>
    </el-table>
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
      file: undefined
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 100
      this.file = file
      this.test(file)
      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 100M in size.',
        type: 'warning'
      })
      return false
    },
    test(file) {
      let formdata = new FormData()
      formdata.append('file', file)
      formdata.append('title', '')
      formdata.append('url', '')
      console.log(file)
      var vm = this
      this.axios.post('api/createtable', formdata, {
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
