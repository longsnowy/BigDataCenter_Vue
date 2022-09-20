<template>

  <div>

    <el-table-column label="选项" align="center" width="260" class-name="small-padding fixed-width">
      <el-button type="primary" style="float:right;margin-right: 50px" @click="handleAdd()">新增字段</el-button>
    </el-table-column>

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
          <el-button type="danger" size="mini" @click="deleteField(row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>


    <el-dialog :title="字典修改" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="personRules" :model="createTemp" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="字段名称" prop="field">
          <el-input v-model="updateTemp.field"/>
        </el-form-item>
<!--        <el-form-item label="数据类型" prop="type">-->
<!--          <el-input v-model="updateTemp.type"/>-->
<!--        </el-form-item>-->
        <el-form-item label="数据类型" prop="type">
          <el-select v-model="updateTemp.type" placeholder="字段类型">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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

    <el-dialog :title="添加字段" :visible.sync="adddialogFormVisible">
      <el-form ref="dataForm" :rules="personRules" :model="addTemp" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="字段名称" prop="field">
          <el-input v-model="addTemp.field"/>
        </el-form-item>
        <!--        <el-form-item label="数据类型" prop="type">-->
        <!--          <el-input v-model="addTemp.type"/>-->
        <!--        </el-form-item>-->

        <el-form-item label="数据类型" prop="type">
          <el-select v-model="addTemp.type" placeholder="字段类型">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="含义" prop="comment">
          <el-input v-model="addTemp.comment"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addTempSubmit()">
          提交
        </el-button>
        <el-button @click="adddialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getTableData, getDictionary, addOneData, updateDic, changeDic, deleteField, addField } from '@/api/datasource'

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
      adddialogFormVisible: false,
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
      tempData: {
        id: 0,
        oldfield: '',
        field: '',
        oldtype: '',
        type: '',
        comment: ''
      },

      addTemp: {
        id: 0,
        field: '',
        type: '',
        comment: ''
      },

      types: [{
        value: 'int',
        label: '整数'
      }, {
        value: 'double',
        label: '小数'
      }, {
        value: 'varchar(64)',
        label: '短字符串'
      }, {
        value: 'varchar(128)',
        label: '长字符串'
      }, {
        value: 'text',
        label: '文本'
      }, {
        value: 'longtext',
        label: '长文本'
      }]

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
        console.log("vm.dictionary.length" + vm.dictionary.length)
      })

    },
    updateData() {
      var vm = this
      this.tempData.id = this.$route.params.id
      this.tempData.field = this.updateTemp.field
      this.tempData.type = this.updateTemp.type
      this.tempData.comment = this.updateTemp.comment
      changeDic(this.tempData).then(response => {

        vm.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })

        vm.getDic()
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

      this.tempData.oldfield = row.field
      this.tempData.oldtype = row.type

      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteField(row) {
      var vm = this
      deleteField(this.$route.params.id, row.field).then(response => {

        vm.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })

        vm.getDic()

      })
    },
    addTempSubmit() {
      var vm = this
      this.addTemp.id = this.$route.params.id
      addField(this.addTemp).then(response => {

        vm.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })

        vm.getDic()

        vm.adddialogFormVisible = false
      })

    },

    handleAdd() {
      this.addTemp.field = ''
      this.addTemp.type = 'varchar(64)'
      this.addTemp.comment = ''

      this.adddialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }

  }
}
</script>

<style scoped>
</style>
