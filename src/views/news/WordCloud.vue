<template>
  <div id="Home">
    <div class="filter-container">

      <el-select v-model="kind" placeholder="新闻种类" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in newsKinds" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>


      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getdata()">
        查询
      </el-button>

    </div>

    <wordcloud
      :data="keywords"
      nameKey="keyword"
      valueKey="num"
      :showTooltip="true"
      :wordClick="wordClickHandler">
    </wordcloud>

    <el-table :data="choosen_keyword" align="center" border  >
      <el-table-column
        type="index"
        width="100"
        label="序号">
      </el-table-column>
      <el-table-column prop="keyword" label="关键词">
      </el-table-column>
      <el-table-column prop="num" label="出现次数">
      </el-table-column>
    </el-table>


    <el-table :data="keywords" align="center" style="margin-top: 30px;" border :stripe="true">
      <el-table-column
        type="index"
        width="100"
        label="序号">
      </el-table-column>
      <el-table-column prop="keyword" label="关键词">
      </el-table-column>
      <el-table-column prop="num" label="出现次数">
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import wordcloud from 'vue-wordcloud'

export default {
  name: 'Home',
  components: {
    wordcloud
  },
  data() {
    return {
      myColors: ['#1f77b4', '#629fc9', '#94bedb', '#c9e0ef'],
      keywords: [],
      choosen_keyword: [{
        keyword: '发展',
        num: '28879'
      }],
      kind:'fangchan_counts',
      newsKinds: [{
        value: 'news_counts',
        label: '全部'
      }, {
        value: 'caijing_counts',
        label: '财经'
      }, {
        value: 'fangchan_counts',
        label: '房产'
      }, {
        value: 'jiaoyu_counts',
        label: '教育'
      }, {
        value: 'keji_counts',
        label: '科技'
      },{
        value: 'junshi_counts',
        label: '军事'
      },{
        value: 'qiche_counts',
        label: '汽车'
      },{
        value: 'tiyu_counts',
        label: '体育'
      },{
        value: 'youxi_counts',
        label: '游戏'
      },{
        value: 'yule_counts',
        label: '娱乐'
      },

      ],
    }
  },
  mounted() {
    this.getdata()
  },
  methods: {
    wordClickHandler(name, value, vm) {
      vm.$message({
        message: '关键词:' + name + '出现次数:' + value
      });
      this.choosen_keyword = [{keyword: name, count: value}]
      console.log(this.choosen_keyword)
      console.log('wordClickHandler', name, value, vm);
    },
    getdata: function () {
      var vm = this;
      this.axios({
        method: 'get',
        url: '/api/keywords/' + vm.kind
      }).then(function (response) {
        vm.keywords = response.data.data.items
        console.log(response.data.data.items)
        console.log(vm.keywords)
      });
    },
  }
}
</script>

<style scoped>
div.tooltip {
  position: absolute;
  width: 200px;
  height: 50px;
  padding: 8px;
  font: 18px Arial;
  line-height: 24px;
  color: white;
  background: black;
  border: 0px;
  border-radius: 2px;
  pointer-events: none;
}
</style>
