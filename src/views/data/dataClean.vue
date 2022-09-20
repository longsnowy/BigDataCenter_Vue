<template>

  <div v-if="show">

    <div style="margin-bottom: 5px;margin-top: 10px">
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in dictionary"
          :key="item.field"
          :label=" item.comment +'(' + item.field + ')' "
          :value="item.field"
          :disabled="item.disabled">
        </el-option>
      </el-select>

      <el-button type="primary" size="mini" @click="getList()">空值查询</el-button>
      <el-button type="primary" size="mini" @click="jsonChange()">Json数据转换</el-button>
      <el-button type="primary" size="mini" @click="getdic()">查看数据字典</el-button>
      <el-badge :value="repenum" class="item" style="margin-left: 10px">
        <el-button type="primary" size="mini" @click="handleDeleteRepo()">清除重复数据</el-button>
      </el-badge>
    </div>


    <br>
    <span>删除表中字段</span>
    <el-select v-model="value2" placeholder="请选择字段">
      <el-option
        v-for="item in dictionary"
        :key="item.field"
        :label=" item.comment +'(' + item.field + ')' "
        :value="item.field"
        :disabled="item.disabled">
      </el-option>
    </el-select>
    <el-select v-model="type" placeholder="请选择运算符">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label=" item.label "
        :value="item.value"
        :disabled="item.disabled">
      </el-option>
    </el-select>
    <el-input style="width: 100px" v-model="numsize"/>
    <span>的数据 </span>
    <el-button type="danger" size="mini" @click="handleDelete()">确认</el-button>

    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column :show-overflow-tooltip="true" v-for="item of tableHeader" :key="item" :prop="item"
                       :label="item"/>
      <el-table-column label="选项" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    <el-dialog title="填充空值" :visible.sync="dialogVisible">-->
    <!--      <el-form :model="temp" label-width="120px" ref="temp">-->
    <!--        <el-form-item :key="item.field"-->
    <!--                      :label="item.comment"-->
    <!--                      :prop="item.field"-->
    <!--                      v-for="item in dictionary" >-->
    <!--          <el-input type="text" v-model="item.default" ></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-button type="primary" size="mini" @click="submitData()">提交</el-button>-->
    <!--      </el-form>-->
    <!--    </el-dialog>-->

    <el-dialog title="编辑" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="150px"
               style="width: 400px; margin-left:50px;">
        <el-form-item :label="value" :prop="value">
          <el-input v-model="temp"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitData()">
          提交
        </el-button>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {
  getTableData,
  getDictionary,
  addOneData,
  nullSearch,
  nullUpdate,
  jsonUpdate,
  deleteByNum, deleteRepe
} from '@/api/datasource'

export default {
  name: 'tableData',
  data() {
    return {
      tableData: [],
      tableHeader: [],
      tableHeaderName: [],
      id: undefined,
      dictionary: [],
      show: false,
      dataForm: undefined,
      dialogVisible: false,
      temp: '',
      total: 0,
      key: false,
      value: '',
      rowid: '',
      options: [{
        value: '=',
        label: '等于'
      }, {
        value: '>',
        label: '大于'
      }, {
        value: '<',
        label: '小于'
      }],
      type: '',
      value2: '',
      numsize: '',
      repenum: 0

    }
  },
  mounted() {
    this.getDic()
  },
  created() {
    // this.getData()
  },
  methods: {

    getdic() {
      this.$router.push('/tabledic/' + this.$route.params.id)
    },

    getData() {
      this.getDic()
      this.getList()
      this.setHeaders()
    },

    setHeaders() {
      console.log('+++' + this.dictionary)
      console.log('---' + this.tableData)

      for (let i = 0; i < this.dictionary.length; i++) {
        this.tableHeaderName[i] = (this.dictionary[i].comment)
        this.tableHeader[i] = (this.dictionary[i].field)
      }
      console.log(this.tableHeader.toString())
      console.log(this.tableHeaderName.toString())

      console.log(this.$route.params.id)
    },

    getDic() {
      var vm = this
      getDictionary(this.$route.params.id).then(response => {

        vm.dictionary = response.data.items
        console.log('vm dic' + vm.dictionary)

        for (let i = 0; i < vm.dictionary.length; i++) {
          vm.tableHeaderName[i] = (vm.dictionary[i].comment)
          vm.tableHeader[i] = (vm.dictionary[i].field)
        }
        console.log(vm.tableHeader.toString())
        console.log(vm.tableHeaderName.toString())

        console.log(vm.$route.params.id)

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })

      this.show = true
      // this.getList()

    },

    getList() {
      // this.value = vm.dictionary[0].field
      this.listLoading = false
      var vm = this
      nullSearch(this.$route.params.id, this.value).then(response => {

        vm.tableData = response.data.items
        // vm.total = response.data.total
        console.log('vm tabledata' + vm.tableData)
        // console.log('vm total' + vm.total)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })

      this.key = !this.key
    },
    handleUpdate(row) {
      console.log(row)
      this.rowid = row.id
      this.dialogVisible = true

    },
    submitData() {
      var vm = this
      nullUpdate(this.$route.params.id, this.value, this.temp, this.rowid).then(response => {

        this.dialogVisible = false

        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })

      this.getList()
    },

    jsonChange() {
      jsonUpdate(this.$route.params.id, this.value).then(response => {

        this.dialogVisible = false

        this.$notify({
          title: '成功',
          message: '转换成功',
          type: 'success',
          duration: 2000
        })

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 150000 * 1000)
      })

    },

    handleDelete() {
      deleteByNum(this.$route.params.id, this.value2, this.numsize, this.type).then(response => {

        this.dialogVisible = false

        this.$notify({
          title: '成功',
          message: '清洗成功',
          type: 'success',
          duration: 2000
        })

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 150000 * 1000)
      })
    },

    handleDeleteRepo() {
      var vm = this
      deleteRepe(this.$route.params.id).then(response => {

        this.dialogVisible = false

        if (response.data.num > 0) {
          vm.$notify({
            title: '成功',
            message: '清洗成功!',
            type: 'success',
            duration: 2000
          })
        } else {
          vm.$notify({
            title: '成功',
            message: '无重复数据!',
            type: 'success',
            duration: 2000
          })
        }

        vm.repenum = response.data.num
        console.log("response.data.num" + response.data.num)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 150000 * 1000)
      })
    }

  }
}
</script>

<style scoped>
</style>
