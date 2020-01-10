<template>
    <div class="cluster-card"
        @click.stop="handle_click">
        <div class="title">Chart</div>
        <div class="cards-grid">
            <histogram-bar v-if="chartData && chartData.rows && chartData.rows.length>0"
                ref="histogramBarRef"
                :values="chartData"
                :is-heap="false"
                :title="toolData.chartValue.name"
                @back="handle_back_chart"
                @forward="handle_forward_chart">
            </histogram-bar>
        </div>

        <div v-if="status!='view'"
            class="close-btn"
            @click.stop="handle_click_close">
            <i class="el-icon-delete-solid"></i>
        </div>
    </div>
</template> 
   
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import uuidv4 from "uuid/v4";
import histogramBar from "../histogram-bar";

export default {
  name: "ClusterCard",
  components: { histogramBar },
  props: {
    value: {
      type: [Object, Array],
      required: true
    },
    status: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      extra: {},
      chartData: {}
    };
  },

  computed: {
    toolData() {
      return this.value.toolData;
    }
  },

  watch: {
    toolData: {
      handler: function(val) {
        this.init();
      },
      deep: true
    }
  },

  methods: {
    ...mapActions("home", ["fetch_card_data"]),

    async init() {
      //根据value向后端发送请求
      console.log("cluster.init", this.value);

      this.value.childLayout = [];
      this.value.childLayout.push({ x: 0, y: 0, w: 24, h: 11, maxH: 11, i: uuidv4() });

      let result = await this.get_card_data();

      this.$nextTick(() => {
        let timer = "";
        timer = setTimeout(() => {
          this.chartData = result;
          clearTimeout(timer);
          clearInterval(timer);
        }, 100);
      });
    },

    //获取数据
    async get_card_data() {
      let toolData = this.value.toolData;
      let params = { type: toolData.chartType, data_source: toolData.dataSource, value: toolData.chartValue, ...this.extra };

      let result = {
        xAxis: "brand",
        unit: "Million",
        rows: [
          { brand: "Lancome", CY2018: "1600.96", CY2019: "1160.11", CY2017: "1065.51", CY2016: "788.25", CY2015: "485.24" },
          { brand: "Estee Lauder", CY2018: "1025.23", CY2019: "878.58", CY2017: "850.89", CY2016: "357.01", CY2015: "10.56" },
          { brand: "Christian Dior", CY2018: "738.93", CY2019: "553.12", CY2017: "491.23", CY2016: "446.49", CY2015: "176.07" },
          { brand: "Chanel", CY2018: "641.04", CY2019: "380.13", CY2017: "395.28", CY2016: "399.54", CY2015: "154.86" },
          { brand: "Giorgio Armani", CY2018: "402.36", CY2019: "365.26", CY2017: "201.33", CY2016: "93.89", CY2015: "52.56" },
          { brand: "Yves Saint Laurent", CY2018: "390.10", CY2019: "317.14", CY2017: "208.45", CY2016: "82.14", CY2015: "37.14" },
          { brand: "SK-II", CY2018: "371.34", CY2019: "299.46", CY2017: "328.17", CY2016: "239.25", CY2015: "149.74" },
          { brand: "Clarins", CY2018: "262.11", CY2019: "213.42", CY2017: "131.36", CY2016: "190.24", CY2015: "159.55" },
          { brand: "Olay", CY2018: "0.00", CY2019: "214.79", CY2017: "0.00", CY2016: "0.00", CY2015: "0.00" },
          { brand: "La Mer", CY2018: "173.70", CY2019: "177.73", CY2017: "88.87", CY2016: "17.63", CY2015: "3.39" }
        ],
        forward: "brand", //下钻的x轴
        back: "" //返回的x轴
      };

      // let result = await this.fetch_card_data(params);
      return result;
    },

    //返回
    handle_back_chart(xAxis) {
      this.extra = { back: xAxis };
      this.init();
    },

    //下钻
    handle_forward_chart(xAxis) {
      this.extra = { forward: xAxis };
      this.init();
    },

    handle_click() {
      this.$emit("select", this.value);
    },

    handle_click_close() {
      this.$emit("delete", this.value);
    }
  },

  created() {},
  mounted() {
    this.init();
  }
};
</script> 
  
<style lang="scss" scoped>
.cluster-card {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;

  ::-webkit-scrollbar {
    width: 5px !important;
    height: 5px !important;
  }

  .title {
    height: 30px;
    font-size: 20px;
    font-weight: 700;
    line-height: 30px;
  }

  .cards-grid {
    flex: 1;
    overflow: auto;
  }

  .close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      cursor: pointer !important;
    }

    i {
      font-size: 20px;
      color: gray;
    }
  }
}
</style> 