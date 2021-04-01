<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },

    setOptions({ expectedData, actualData } = {}) {
      console.log(expectedData)
      this.chart.setOption({
        title: {
          text: '信息统计',
          left: 'left',
        },
        // 工具箱
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true
            },
            restore: {
              show: true
            },
            dataView: {
              show: true
            },
            dataZoom: {
              show: true
            },
            magicType: {
              type: ['line', 'bar']
            }

          }
        },
        tooltip: {
          trigger: 'axis'
        },
        // 图例
        legend: {
          data: ['信息统计']
        },
        // x轴
        xAxis: {
          data: ['签到人数', '未签人数', '任务完成数', '任务总数']
        },
        yAxis: {},
        // 数据
        series: [{
          name: '信息统计',
          type: 'bar',
          data: expectedData,
        }]
      })
    }
  }
}
</script>
