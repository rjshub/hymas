<template>
    <div class="collect-card"
        @click.stop="handle_click_grid">
        <div class="title">Summary</div>
        <div class="cards-grid">
            <grid-layout :layout.sync="value.childLayout"
                :col-num="24"
                :row-height="20"
                :is-draggable="true"
                :is-resizable="true"
                :vertical-compact="true"
                :margin="[5, 5]"
                :use-css-transforms="true">
                <grid-item v-for="(item,index) in value.childLayout"
                    :key="index"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :i="item.i"
                    :static="status=='view'">
                    <card v-if="chartData.length>0"
                        :status="status"
                        :color="getRandomColor(item.id)"
                        :value="getValue(item.id)"
                        :active-id="activeId"
                        @delete="handle_delete_card"
                        @click="handle_click_card"></card>
                </grid-item>
            </grid-layout>
        </div>

        <div v-if="status!='view'"
            class="close-btn"
            @click.stop="handle_close_grid">
            <i class="el-icon-delete-solid"></i>
        </div>
    </div>
</template> 
   
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import uuidv4 from "uuid/v4";
import colors from "@/assets/chart/color-config";
import card from "./card";

export default {
  name: "collect-card",
  components: { card },

  props: {
    value: {
      type: [Object, Array],
      required: false
    },
    status: {
      type: [String, Number],
      required: false
    }
  },

  data() {
    return {
      chartData: [],
      activeId: ""
    };
  },

  computed: {
    toolData() {
      return JSON.stringify(this.value.toolData);
    }
  },

  watch: {
    toolData(val, old) {
      this.reload();
    }
  },

  methods: {
    ...mapActions("home", ["fetch_card_data"]),
    
    async reload() {
      let result = await this.get_card_data();

      //一旦tooldata变化，需要对grid重新 生成。
      this.value.childLayout = this.getLayout(result);

      this.$nextTick(() => {
        let timer = setTimeout(() => {
          this.chartData = result;

          clearTimeout(timer);
          clearInterval(timer);
        }, 100);
      });
    },

    async init() {
      let result = await this.get_card_data();

      if (this.value.childLayout && this.value.childLayout.length == 0) {
        this.value.childLayout = this.getLayout(result);
      }

      this.$nextTick(() => {
        let timer = setTimeout(() => {
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

      let result = [
        { id: "1", name: "Lancome", value: "1600.96" },
        { id: "2", name: "vue", value: "1600.96" },
        { id: "3", name: "react", value: "1600.96" },
        { id: "4", name: "angular", value: "1600.96" },
        { id: "5", name: "es6", value: "1600.96" },
        { id: "6", name: "js1", value: "1600.96" },
        { id: "7", name: "js2", value: "1600.96" },
        { id: "8", name: "js3", value: "1600.96" },
        { id: "9", name: "js4", value: "1600.96" },
        { id: "10", name: "js5", value: "1600.96" },
        { id: "11", name: "js6", value: "1600.96" },
        { id: "12", name: "Lancome", value: "1600.96" },
        { id: "13", name: "vue", value: "1600.96" }
      ];

      // let result = await this.fetch_card_data(params);
      return result;
    },

    getRandomColor(id) {
      return colors.eight[id % 8];
    },

    getValue(id) {
      return this.chartData.find(item => item.id == id);
    },

    getXY(i) {
      let x = (i % 6) * 4;
      let y = Math.floor(i / 6) * 5;
      return { x, y };
    },

    getLayout(result) {
      let num = result.length;
      let layout = [];
      for (let i = 0; i < num; i++) {
        let grid = { w: 4, h: 5, maxH: 5, i: uuidv4() };
        let xy = this.getXY(i);
        layout.push({ ...grid, ...xy, id: result[i].id });
      }
      return layout;
    },

    handle_delete_card(id) {
      this.value.childLayout = this.value.childLayout.filter(item => {
        return item.id != id;
      });
    },

    handle_click_card(id) {
      this.activeId = id;
    },

    handle_click_grid() {
      this.$emit("select", this.value);
    },

    handle_close_grid() {
      this.$emit("delete", this.value);
    }
  },

  mounted() {
    this.init();
  }
};
</script> 
  
<style lang="scss" scoped>
.collect-card {
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