<template>
    <div class="visual-management-chart">
        <span class="chart-wrap__icon"
            :class="{active: chartType==chartMap.collect}"
            @click.stop="select_chart_type(chartMap.collect)">
            <img src="~@/assets/images/home/collect.png"
                title="Summary">
        </span>
        <span class="chart-wrap__icon"
            :class="{active: chartType==chartMap.cluster}"
            @click.stop="select_chart_type(chartMap.cluster)">
            <img src="~@/assets/images/home/cluster.png"
                title="Cluster bar chart">
        </span>
        <span class="chart-wrap__icon"
            :class="{active: chartType==chartMap.stack}"
            @click.stop="select_chart_type(chartMap.stack)">
            <img src="~@/assets/images/home/stack.png"
                title="Stack bar chart">
        </span>
        <span class="chart-wrap__icon"
            :class="{active: chartType==chartMap.pie}"
            @click.stop="select_chart_type(chartMap.pie)">
            <img src="~@/assets/images/home/pie.png"
                title="Doughnut chart">
        </span>
        <span class="chart-wrap__icon"
            :class="{active: chartType==chartMap.line}"
            @click.stop="select_chart_type(chartMap.line)">
            <img src="~@/assets/images/home/line.png"
                title=" Line chart">
        </span>
        <span class="chart-wrap__icon"
            :class="{active: chartType==chartMap.table}"
            @click.stop="select_chart_type(chartMap.table)">
            <img src="~@/assets/images/home/table.png"
                title="Table">
        </span>
        <span class="chart-wrap__icon"
            :class="{active: chartType==chartMap.filter}"
            @click.stop="select_chart_type(chartMap.filter)">
            <img src="~@/assets/images/home/select.png"
                title="Drop List">
        </span>
    </div>
</template> 
   
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";

export default {
  name: "VisualManagement",
  components: {},

  props: {
    value: {
      type: [Number, String],
      required: true
    }
  },

  data() {
    return {
      chartType: "",
      chartTypeOld: ""
    };
  },

  computed: {
    ...mapState("home", ["chartMap"])
  },

  watch: {
    value() {
      this.init();
    }
  },

  methods: {
    init() {
      this.chartType = _.cloneDeep(this.value);
      this.chartTypeOld = _.cloneDeep(this.value);
    },

    select_chart_type(type) {
      if (this.chartTypeOld == "") {
        this.chartType = type;
        this.$emit("add", type);
      } else {
        if ((this.value != 7 && type == 7) || (this.value == 7 && type != 7)) {
          this.$message.warning("不能将drop list和其他切换");
          return;
        }

        this.chartType = type;
        if (this.chartTypeOld != this.chartType) {
          this.$emit("change", type);
        }
      }

      this.chartTypeOld = type;
    }
  },

  created() {},
  mounted() {
    this.init();
  }
};
</script> 
  
<style lang="scss" scoped>
.visual-management-chart {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;

  .chart-wrap__icon {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 30px;
    height: 45px;
    width: 45px;
    border: 1px solid #d5d5d5;
    border-radius: 5px;
    background-color: #f6f6f6;
    margin-right: 10px;
    margin-top: 10px;
    cursor: pointer;

    &.active {
      background-color: #d6ebff;
      border: 1px solid #8bb9e6;
    }

    i {
      font-size: 30px;
    }
  }
}
</style> 