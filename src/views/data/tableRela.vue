<template>
  <div>
    <br>
    <br>
    <el-table
      v-loading="listLoading"
      :data="this.dictionary"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="字段名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.field }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.collation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可否为空" align="center">
        <template slot-scope="{row}">
          <span>{{ row.null }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Privileges" align="center">
        <template slot-scope="{row}">
          <span>{{ row.privileges }}</span>
        </template>
      </el-table-column>
      <el-table-column label="含义" align="center">
        <template slot-scope="{row}">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>
    </el-table>

<br>
<br>
<br>

    <el-table
      v-loading="listLoading"
      :data="this.dictionary2"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="字段名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.field }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.collation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可否为空" align="center">
        <template slot-scope="{row}">
          <span>{{ row.null }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Privileges" align="center">
        <template slot-scope="{row}">
          <span>{{ row.privileges }}</span>
        </template>
      </el-table-column>
      <el-table-column label="含义" align="center">
        <template slot-scope="{row}">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>
    </el-table>

    <br>
    <br>
    <br>

    <div style="margin-left: 900px">
    <h2>{{result}}</h2>
    </div>
  </div>
</template>

<script>
import { getTableData, getDictionary, addOneData ,updateDic} from '@/api/datasource'

export default {
  name: 'tableDic',
  data() {
    return {
      tableData: [],
      tableHeader: [],
      tableHeaderName: [],
      id: undefined,
      dictionary: [],
      dictionary2: [],
      show: false,
      dataForm: undefined,
      temp: undefined,
      listLoading: false,
      dialogFormVisible: false,
      updateTemp: {
        null: 'YES',
        collation: 'utf8_general_ci',
        privileges: 'select,insert,update,references',
        type: 'varchar(64)',
        field: 'id',
        key: '',
        default: null,
        comment: '学号',
        extra: ''
      },
      result:'分析结果:表1中 id 与 表2 中的 id 关联'
    }
  },
  mounted() {
    this.getDic()
  },
  created() {
    // this.getDic()
  },
  methods: {

    getDic(id) {
      var vm = this
      getDictionary(this.$route.params.id).then(response => {

        vm.dictionary = response.data.items
        console.log('vm dic   ' + vm.dictionary[0].type)

      })

      getDictionary(this.$route.params.id2).then(response => {

        vm.dictionary2 = response.data.items
        console.log('vm dic   ' + vm.dictionary2[0].type)

      })

    },
    updateData(){
      var vm = this
      updateDic(this.$route.params.id,this.updateTemp.field,this.updateTemp.type,this.updateTemp.comment).then(response => {

        vm.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })

        vm.getDic();
      })
    },
    handleUpdate(row) {
      this.updateTemp.null = row.null
      this.updateTemp.collation = row.collation
      this.updateTemp.privileges = row.privileges
      this.updateTemp.type = row.type
      this.updateTemp.field = row.field
      this.updateTemp.key = row.key
      this.updateTemp.default = row.default
      this.updateTemp.comment = row.comment
      this.updateTemp.extra = row.extra

      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

  }
}
</script>

<style scoped>
</style>
