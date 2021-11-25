<template>

  <div v-if="show">
    <el-button type="primary" size="mini" @click="getData()">获取数据</el-button>
    <el-button type="primary" size="mini" @click="addData()">增加数据</el-button>
    <el-button type="primary" size="mini" @click="addFromExcel()">从excel导入数据</el-button>
    <el-button type="primary" size="mini" @click="getdic()">查看数据字典</el-button>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item"/>
    </el-table>


    <el-dialog title="绩效" :visible.sync="dialogVisible">
<!--      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px"-->
<!--               style="width: 400px; margin-left:50px;">-->
<!--        <el-form-item v-for="item in tableHeader" label="item" prop="item">-->
<!--          <el-input v-model="temp" readonly/>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <input v-for="(item, index) in tableHeader" :key="index" v-model="temp[index]" @change="print" />-->

      <el-form :model="temp" label-width="120px" ref="temp">
        <el-form-item :key="item.field"
                      :label="item.comment"
                      :prop="item.field"
                      v-for="item in dictionary" >
          <el-input type="text" v-model="item.default" ></el-input>
        </el-form-item>
        <el-button type="primary" size="mini" @click="submitData()">提交</el-button>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { getTableData, getDictionary ,addOneData} from '@/api/datasource'

export default {
  name: 'tableData',
  data() {
    return {
      tableData: [],
      tableHeader: [],
      tableHeaderName: [],
      id: undefined,
      dictionary: [],
      show:false,
      dataForm:undefined,
      dialogVisible:false,
      temp:undefined

    }
  },
  mounted() {
    this.getDic()

  },
  created() {
    this.getData()
  },
  methods: {

    getdic(){
      this.$router.push("/tabledic/" +  this.$route.params.id);
    },
    addData(){
      this.dialogVisible = true
    },
    getData(){
      this.getDic()
      this.getList()
      this.setHeaders()
    },

    addFromExcel(){
      this.$router.push("/addfromexcel/" + this.$route.params.id)
    },

    submitData(){
      var vm = this
      addOneData(this.dictionary,this.$route.params.id).then(response => {

        this.dialogVisible = false

        vm.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })

      console.log(this.dictionary)
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

      this.show = true;
      this.getList()

    },

    getList() {
      this.listLoading = false
      var vm = this
      getTableData(this.$route.params.id).then(response => {

        vm.tableData = response.data.items
        console.log('vm tabledata' + vm.tableData)
        // this.list = response.data.items
        // console.log(this.list)
        // this.total = response.data.total
        // console.log(response.data)

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }

  }
}
</script>

<style scoped>
</style>
