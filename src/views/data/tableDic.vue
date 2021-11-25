<template>

  <div>
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

      <!--      <el-table-column label="Key" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.key }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <!--      <el-table-column label="默认值" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.default }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <!--      <el-table-column label="Extra" align="center">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{ row.extra }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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

      <el-table-column label="选项" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" @click="">删除</el-button>
        </template>
      </el-table-column>

    </el-table>


    <el-dialog :title="字典修改" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="personRules" :model="createTemp" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="字段名称" prop="field">
          <el-input v-model="updateTemp.field"/>
        </el-form-item>
        <el-form-item label="数据类型" prop="type">
          <el-input v-model="updateTemp.type"/>
        </el-form-item>
        <el-form-item label="编码" prop="collation">
          <el-input v-model="updateTemp.collation"/>
        </el-form-item>

        <el-form-item label="可否为空" prop="null">
          <el-input v-model="updateTemp.null"/>
        </el-form-item>
        <el-form-item label="Privileges" prop="privileges">
          <el-input v-model="updateTemp.privileges"/>
        </el-form-item>
        <el-form-item label="含义" prop="comment">
          <el-input v-model="updateTemp.comment"/>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateData()">
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
      }
    }
  },
  mounted() {
    this.getDic()
  },
  created() {
    // this.getDic()
  },
  methods: {

    getDic() {
      var vm = this
      getDictionary(this.$route.params.id).then(response => {

        vm.dictionary = response.data.items
        console.log('vm dic   ' + vm.dictionary[0].type)

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
