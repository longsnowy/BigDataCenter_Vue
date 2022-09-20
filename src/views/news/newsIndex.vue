<template>
  <div>
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
  </div>
</template>

<script>
import { getTableData, getDictionary, addOneData } from '@/api/datasource'

export default {
  name: 'NewsIndex',
  data() {
    return {
      data: [{
        label: '新闻',
        value: 'news',
        children: [
          {
            label: '财经(8597)',
            value: 'caijing'
          },
          {
            label: '房产(200)',
            value: 'fangchan'
          },
          {
            label: '教育(500)',
            value: 'jiaoyu'
          },
          {
            label: '科技(830)',
            value: 'keji'
          },
          {
            label: '军事(158)',
            value: 'junshi'
          },
          {
            label: '汽车(647)',
            value: 'qiche'
          },
          {
            label: '体育(1200)',
            value: 'tiyu'
          },
          {
            label: '游戏(1300)',
            value: 'youxi'
          },
          {
            label: '娱乐(1200)',
            value: 'yule'
          }
        ]
      }, ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }

    }
  },
  mounted() {

  },
  created() {

  },
  methods: {

    handleNodeClick(data) {
      console.log(data.value)
      this.$router.push('/newslist/' + data.value)
    }

  }
}
</script>

<style scoped>
</style>
