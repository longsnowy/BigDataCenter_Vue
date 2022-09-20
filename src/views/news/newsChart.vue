<template>
  <div id="myChart" :style="{width: '800px', height: '500px'}"></div>
</template>

<script>
export default {
  name: 'newsChart',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: { text: '新闻数量' },
        tooltip: {},
        xAxis: {
          data: ['财经', '房产', '教育', '科技', '军事', '汽车', '体育', '游戏', '娱乐']
        },
        yAxis: {},
        series: [{
          name: '数量',
          type: 'bar',
          data: [8597, 200, 500, 830, 158, 647, 1200, 1300, 1200]
        }]
      })
    }
  }
}
</script>

<style scoped>

</style>
