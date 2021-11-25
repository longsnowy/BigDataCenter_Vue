<template>
  <div>
    <div class="filter-container">
      <el-input v-model="table1_id" placeholder="table1_id" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="table2_id" placeholder="table2_id" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="push()">
        表关联分析
      </el-button>
    </div>
  </div>
</template>

<script>


export default {
  name: 'tableRelaSearch',
  data() {
    return {
      table1_id:'',
      table2_id:'',
    }
  },
  mounted() {
    this.getDic()
  },
  created() {
    // this.getDic()
  },
  methods: {

    push(){
      this.$router.push("/tablerela/" +  this.table1_id + '/' + this.table2_id);
    }

  }

}
</script>

<style scoped>
</style>
