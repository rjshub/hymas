<template>
    <div class="custom-tools">
        <div class="visual-management">
            <label>Visual Management</label>
            <visual-management :value="chartType"
                @add="handle_add_chart"
                @change="handle_change_chart">
            </visual-management>
        </div>
        <div class="data-source">
            <label>Data Source</label>
            <div class="source-wrap">
                <filter-select v-model="dataSource"
                    width="100%"
                    :options="dataSourceOptions"
                    multiple
                    filterable
                    placeholder="Select Data Source"
                    @change="handle_data_source_change"></filter-select>
            </div>
        </div>
        <div class="value">
            <label>Value</label>

            <component :is="valueComponent"
                :value="{chartType, dataSource, chartValue }"
                @change="handle_change_chart_type_component"></component>
        </div>
    </div>
</template> 
   
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import filterSelect from "@/components/common/filter-select";

import visualManagement from "./visual-management";

import collectValue from "./visual-value/collect-value";
import heepValue from "./visual-value/stack-value";
import lineValue from "./visual-value/line-value";
import parallelValue from "./visual-value/cluster-value";
import pieValue from "./visual-value/pie-value";
import filterValue from "./visual-value/filter-value";
import tableValue from "./visual-value/table-value";

export default {
  name: "CustomTools",
  components: { filterSelect, visualManagement, collectValue, heepValue, lineValue, parallelValue, pieValue, filterValue, tableValue },

  props: {
    currentGrid: {
      type: [Object, Array],
      required: true
    }
  },

  data() {
    return {
      chartType: "",

      dataSource: [],
      chartValue: {},

      valueComponent: ""
    };
  },

  computed: {
    ...mapState("common", ["dataSourceOptions"]),
    currentGridString() {
      return JSON.stringify(this.currentGrid);
    }
  },

  watch: {
    currentGridString(val, old) {
      let grid = _.cloneDeep(this.currentGrid);
      this.init(grid);
    }
  },

  methods: {
    init(grid) {
      if (grid.toolData) {
        this.chartType = grid.toolData.chartType;
        this.setValueComponent(this.chartType);

        this.dataSource = grid.toolData.dataSource || [];
        this.chartValue = grid.toolData.chartValue;
      } else {
        this.chartType = "";
        this.valueComponent = "";

        this.dataSource = [];
        this.chartValue = {};
      }
    },

    setValueComponent(type) {
      if (type == 1) {
        this.valueComponent = "collectValue";
      } else if (type == 2) {
        this.valueComponent = "parallelValue";
      } else if (type == 3) {
        this.valueComponent = "heepValue";
      } else if (type == 4) {
        this.valueComponent = "pieValue";
      } else if (type == 5) {
        this.valueComponent = "lineValue";
      } else if (type == 6) {
        this.valueComponent = "tableValue";
      } else if (type == 7) {
        this.valueComponent = "filterValue";
      }
    },

    //新增chart
    handle_add_chart(type) {
      this.setValueComponent(type);
      this.$emit("add", type);
    },

    //改变chart
    handle_change_chart(type) {
      this.setValueComponent(type);
      this.dataSource = [];
      this.chartValue = {};

      this.$emit("change", { type });
    },

    handle_data_source_change() {
      this.$emit("change", { dataSource: this.dataSource });
    },

    handle_change_chart_type_component(chartValue) {
      this.$emit("change", { value: chartValue });
    }
  },

  created() {},
  mounted() {
    let grid = _.cloneDeep(this.currentGrid);
    this.init(grid);
  }
};
</script> 
  
<style lang="scss" scoped>
.custom-tools {
  display: flex;
  flex-direction: column;
  width: 250px;

  margin: 10px 0 0 0;
  box-sizing: border-box;

  .visual-management {
    box-sizing: border-box;
    height: 160px;
    background-color: white;
    margin-bottom: 10px;
    padding: 15px;

    label {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
  }
  .data-source {
    box-sizing: border-box;
    height: 100px;
    background-color: white;
    margin-bottom: 10px;
    padding: 15px;

    label {
      display: inline-block;
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
  }
  .value {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 15px;

    label {
      display: inline-block;
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
  }
}
</style> 