<template>
    <div style="height:100%"
        class="chart-wrap">
        <div class="tools">
            <el-button v-if="values.back"
                icon="el-icon-back"
                style="padding: 5px 10px;"
                title="Back"
                size="mini"
                @click.stop="handle_back_chart"></el-button>
            <el-button v-if="values.forward"
                icon="el-icon-right"
                style="padding: 5px 10px;"
                title="forward"
                size="mini"
                @click.stop="handle_forward_chart"></el-button>
            <el-button icon="iconfont mas-download"
                style="padding: 5px 10px;"
                title="Download"
                size="mini"
                @click.stop="handle_download_chart"></el-button>

        </div>
        <div ref="chart"
            class="histogram">
        </div>
    </div>
</template>

<script>
//柱状图
import echarts from "echarts";
import { saveAs } from "file-saver";
import masTheme from "@/assets/chart/theme.json";
import colors from "@/assets/chart/color-config";
export default {
  name: "HistogramBar",
  components: {},

  props: {
    values: {
      type: [Object, Array],
      required: true
    },
    title: {
      type: String,
      required: false
    },
    isHeap: {
      //是否堆叠
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      $chart: null
    };
  },

  computed: {
    getTitle() {
      if (this.title) {
        return this.title + "图表";
      } else {
        return "";
      }
    }
  },

  watch: {
    values: {
      handler: function(val, oldVal) {
        this.createChart();
      },
      deep: true
    }
  },

  methods: {
    getLegendData(values) {
      debugger;
      let item = values.rows[0];
      let keys = Object.keys(item);
      let legends = keys.filter(item => item != values.xAxis);
      let results = legends.map(item => {
        return { name: item, icon: "rect" }; //icon: "rect"定义legend的形状
      });
      return results;
    },
    getxAxisData(values) {
      let rows = values.rows;
      return rows.map(item => {
        return item[values.xAxis];
      });
    },

    getSeries(values) {
      let LegendData = this.getLegendData(values).map(item => item.name);
      let rows = values.rows;
      let series = LegendData.map(item => {
        let data = rows.map(row => row[item]);
        if (this.isHeap) {
          //堆叠时
          return { name: item, type: "bar", stack: "广告", data, barCategoryGap: "50%" };
        } else {
          //非堆叠时
          return { name: item, type: "bar", data, barCategoryGap: "50%" };
        }
      });
      return series;
    },

    stringToDom(str) {
      let dom = document.createElement("div");
      dom.innerHTML = str;
      return dom;
    },

    domToString(dom) {
      return dom[0].outerHTML;
    },

    getTotal(name) {
      let row = this.values.rows.find(item => {
        return item[this.values.xAxis] == name;
      });

      let total = 0;
      for (let item in row) {
        if (item != this.values.xAxis) {
          total += Number(row[item]);
        }
      }
      return total;
    },

    createChart() {
      let self = this;

      let option = {
        backgroundColor: "#ffffff", //默认无背景
        title: {
          show: true,
          text: this.getTitle,
          textStyle: {
            fontSize: 20,
            fontWeight: "normal",
            color: "#4d4d4d"
          },
          top: 5,
          left: "center"
        },
        // toolbox: {
        //   show: true,
        //   itemSize: 20,
        //   right: 30,
        //   top: 10,
        //   feature: {
        //     saveAsImage: {
        //       show: true,
        //       title: "Save to image",
        //     }
        //   }
        // },
        tooltip: {
          trigger: "item", //可以单独浮动到对应的条目上，而不是展示x轴上所有的y选项
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "none" // 默认为直线，可选为：'line' | 'shadow'
          },

          formatter: function(param, ticket) {
            let dom = jquery(self.stringToDom(param.marker)).find("span");
            let domAfter = dom.css("border-radius", 0);
            let markerAfter = self.domToString(domAfter);

            let total = self.getTotal(param.name);

            let totalLine = markerAfter + "Total: " + self.$formatMoney(total, 2);
            let itemLine = markerAfter + param.seriesName + ":" + self.$formatMoney(param.value, 2);
            let ratioLine = markerAfter + "Ratio: " + self.$formatMoney((param.value / total) * 100, 2, "") + "%";
            return totalLine + "<br/>" + itemLine + "<br/>" + ratioLine;
          }
        },
        legend: {
          type: "scroll",
          right: "15px",
          borderRadius: "",
          itemWidth: 20,
          itemHeight: 20,
          height: 15,
          top: 30,
          data: this.getLegendData(this.values)
        },
        //上下左右的间隔
        grid: {
          top: 100,
          left: 15,
          right: 15,
          bottom: 15,
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.getxAxisData(this.values),
            boundaryGap: true
            // splitLine: {
            //   show: false
            // },
            // axisLabel: {
            //   // rotate:50,  //文字旋转60度
            //   interval: 0 //0则全部显示，不会有任何的隐藏
            // }
          }
        ],
        color: colors.reverse_five, //5色系颜色
        yAxis: [
          {
            name: self.values.unit,
            type: "value",
            nameLocation: "end",
            nameTextStyle: {
              color: "#ACADB5",
              padding: [0, 0, -10, 20]
            }
            // axisLabel: {
            //   formatter(value, index) {
            //     return {value,index}
            //   }
            // }
          }
        ],
        dataZoom: [
          {
            type: "slider", // slider  inside
            xAxisIndex: 0,
            filterMode: "filter",
            rangeMode: ["value", "value"],
            // start: 0,
            // end: 60,
            showDetail: false //是否显示两头的 详情名称
            // handleSize: 30,//滑动条的 左右2个滑动条的大小
            // height: 20,//组件高度
          },
          {
            type: "inside", // slider  inside
            xAxisIndex: 0,
            filterMode: "filter",
            rangeMode: ["value", "value"],
            // start: 0,
            // end: 60,
            showDetail: false //是否显示两头的 详情名称
            // handleSize: 30,//滑动条的 左右2个滑动条的大小
            // height: 20,//组件高度
          }
        ],

        series: this.getSeries(this.values)
        // animationEasing: "elasticOut" //延迟动画
      };
      this.$chart.setOption(option, true); //设置true，重新绘制
    },

    handle_download_chart() {
      let canvasElement = jquery(this.$refs.chart).find("canvas")[0];
      let imgURL = canvasElement.toDataURL("image/png");
      saveAs(imgURL, this.title);
    },

    //下钻后，返回
    handle_back_chart() {
      this.$emit("back", this.values.back);
    },
    //下钻，前进
    handle_forward_chart() {
      this.$emit("forward", this.values.forward);
    }
  },

  mounted() {
    //注册主题
    // echarts.registerTheme("masTheme", masTheme);
    //使用主题创建
    // this.$chart = echarts.init(this.$refs.chart, "masTheme");

    this.$chart = echarts.init(this.$refs.chart);
    this.createChart();

    //监听chart div尺寸的变化
    this.$detectDomResize(this.$refs.chart, element => {
      this.$chart.resize();
    });
  }
};
</script>
<style lang="scss" scoped>
.chart-wrap {
  position: relative;
  display: flex;
  flex-direction: column;

  .tools {
    position: absolute;
    top: 5px;
    right: 15px;
    z-index: 100;
    color: gray;
  }

  .histogram {
    flex: 1;
    width: inherit;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>