<template>
    <div class="chart-wrap">
        <div class="tools">
            <el-button icon="iconfont mas-download"
                style="padding: 5px 10px;"
                title="Download"
                size="mini"
                @click.stop="handle_download_chart"></el-button>
        </div>
        <div ref="chart"
            class="pie">
        </div>

    </div>
</template>

<script>
//柱状图
import echarts from "echarts";
import masTheme from "@/assets/chart/theme.json";
import colors from "@/assets/chart/color-config";
export default {
  name: "DoughnutPie",
  components: {},

  props: {
    values: {
      type: [Object, Array],
      required: true
    },
    title: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      $chart: null,
      radius: ["50%", "65%"]
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
      let keys = Object.keys(values);

      let results = keys.map(item => {
        return { name: item, icon: "rect" }; //icon: "rect"定义legend的形状
      });
      return results;
    },

    getSeries(values) {
      let total = 0;
      let keys = Object.keys(values);

      for (let key of keys) {
        total += Number(values[key]);
      }

      let series = keys.map(item => {
        return { value: values[item], icon: "rect", name: item, total }; //icon: "rect"定义legend的形状
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

    createChart() {
      let piePostionCenter = "";
      let postionLegend = "";

      let chartWrapWidth = jquery(this.$refs.chart).width();
      let chartWrapHeight = jquery(this.$refs.chart).height();

      //pie直径
      let pieDiameter = (chartWrapHeight * Number(this.radius[1].replace("%", ""))) / 100;
      let legend = 400; // ?测量出的，宽度为400，后面可能会变

      let resetWidth = chartWrapWidth - pieDiameter - legend;

      piePostionCenter = ((resetWidth / 3 + pieDiameter / 2) / chartWrapWidth) * 100 + "%";
      postionLegend = (resetWidth / 3 / chartWrapWidth) * 100 + "%";

      let self = this;

      let option = {
        backgroundColor: "#fff",
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
        //   top: -5,
        //   feature: {
        //     saveAsImage: {
        //       show: true,
        //       title: "Save to image"
        //     }
        //   }
        // },

        tooltip: {
          trigger: "item", //可以单独浮动到对应的条目上，而不是展示x轴上所有的y选项
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "none" // 默认为直线，可选为：'pie' | 'shadow'
          },

          formatter: function(param, ticket) {
            let dom = jquery(self.stringToDom(param.marker)).find("span");
            let domAfter = dom.css("border-radius", 0);
            let markerAfter = self.domToString(domAfter);

            let total = markerAfter + "Total: " + self.$formatMoney(param.data.total, 2);
            let display = markerAfter + param.name + ": " + self.$formatMoney(param.value, 2);
            let percent = markerAfter + "Percent: " + self.$formatMoney(param.percent, 2, "") + "%";

            return total + "<br/>" + display + "<br/>" + percent;
          }
        },
        legend: {
          // type: "scroll",
          right: postionLegend,
          top: "25%",
          // bottom: "60%",
          orient: "vertical",
          data: self.getLegendData(this.values),
          height: 100,
          // width: 400,
          formatter: function(name, ticket) {
            let total = 0;
            let value = 0;

            let keys = Object.keys(self.values);

            for (let key of keys) {
              total += Number(self.values[key]);
              if (key == name) {
                value = self.values[name];
              }
            }
            return name + "    " + self.$formatMoney(value, 2) + "    " + self.$formatMoney((value / total) * 100, 2, "") + "%";
          }
        },

        // grid: {
        //   top: 100,
        //   left: 15,
        //   right: 15,
        //   bottom: 15,
        //   containLabel: true
        // },

        color: colors.eight, //5色系颜色

        series: [
          {
            type: "pie",
            radius: this.radius,
            center: [piePostionCenter, "50%"], //圆心
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.getSeries(this.values)
          }
        ]
      };
      this.$chart.setOption(option, true);
    },

    handle_download_chart() {
      let canvasElement = jquery(this.$refs.chart).find("canvas")[0];
      let imgURL = canvasElement.toDataURL("image/png");
      saveAs(imgURL, this.title);
    }
  },

  mounted() {
    this.$chart = echarts.init(this.$refs.chart);
    this.createChart();

    //监听chart div尺寸的变化
    this.$detectDomResize(this.$refs.chart, element => {
      this.createChart();
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
  height: 100%;
  justify-content: center;

  .tools {
    position: absolute;
    top: 5px;
    right: 15px;
    z-index: 100;
    color: gray;
  }

  .pie {
    position: relative;
    height: 80%;
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>