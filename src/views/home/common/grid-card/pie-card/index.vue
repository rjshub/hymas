<template>
    <div class="pie-card"
        @click.stop="handle_click">
        <div class="title">Chart</div>
        <div class="cards-grid">
            <doughnut-pie v-if="!$isObjectNull(chartData)"
                ref="doughnutPieRef"
                :values="chartData"
                :title="toolData.chartValue.name"></doughnut-pie>
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
import doughnutPie from "../doughnut-pie";

export default {
  name: "PieCard",
  components: { doughnutPie },

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
      // layout: []
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
      console.log("pie.init", this.value.childLayout);

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
      let params = { type: toolData.chartType, data_source: toolData.dataSource, value: toolData.chartValue };

      let result = { Display: "651.50", MG: "207.19", NP: "0.05", OOH: "560.46", OTV: "2172.12", Search: "327.75", Social: "1599.99", TV: "425.60" };

      // let result = await this.fetch_card_data(params);
      return result;
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
.pie-card {
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
    height: 30px;
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