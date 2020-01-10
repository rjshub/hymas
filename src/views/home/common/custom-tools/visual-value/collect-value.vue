<template>
    <div class="collect-value">
        <div class="legend-type">
            <label>Legend</label>
            <filter-select v-model="legendType"
                width="100%"
                :options="legendTypeOptions"
                filterable
                placeholder="Select"
                @change="handle_legend_type_change"></filter-select>
        </div>
        <div class="legend-value">
            <filter-select v-model="legendValue"
                width="100%"
                :options="legendValueOptions"
                multiple
                filterable
                placeholder="Select "
                @change="handle_legend_value_change">
            </filter-select>
        </div>
        <div class="target-type">
            <label style="display:block">Value</label>
            <div style="margin-bottom: 5px;">
                <el-radio-group v-model="targetType"
                    size="mini"
                    @change="handle_target_type_change">
                    <el-radio label="sum">SUM</el-radio>
                    <el-radio label="avg">AVG</el-radio>
                </el-radio-group>
            </div>

            <filter-select v-model="targetValue"
                width="100%"
                :options="targetOptions[targetType]"
                filterable
                placeholder="Select "
                @change="handle_legend_value_change"></filter-select>
        </div>
    </div>
</template> 
   
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import filterSelect from "@/components/common/filter-select";

export default {
  name: "CollectValue",
  components: { filterSelect },

  props: {
    value: {
      type: [Object, Array],
      required: false
    }
  },

  data() {
    return {
      legendType: "",
      legendValue: [],
      targetType: "sum",
      targetValue: "",

      legendTypeOptions: [],
      legendValueOptions: [],
      targetOptions: {
        sum: [],
        avg: []
      }
    };
  },

  watch: {
    value: {
      handler: function(val) {
        this.init();
      },
      deep: true
    }
  },

  methods: {
    ...mapActions("home", ["fetch_basic_visual_options", "fetch_legend_options"]),

    init() {
      this.legendType = this.value.chartValue.legendType;
      this.legendValue = this.value.chartValue.legendValue;
      this.targetType = this.value.chartValue.targetType || "sum";
      this.targetValue = this.value.chartValue.targetValue;

      this.getBasicVisualOptions().then(res => {
        this.legendTypeOptions = res.legend;
        this.targetOptions.sum = res.target.sum;
        this.targetOptions.avg = res.target.avg;
      });

      if (this.legendType) {
        this.getLegendValueOption().then(res => {
          this.legendValueOptions = res;
        });
      }
    },

    //获取legend和sum/avg options
    async getBasicVisualOptions() {
      let params = { data_source: this.value.dataSource, type: 1 };
      let result = {
        legend: [{ value: "1", label: "abcd" }],
        target: {
          sum: [{ value: "1", label: "cost" }],
          avg: [{ value: "1", label: "ctr" }]
        }
      };

      // let result = await this.fetch_basic_visual_options(params);
      return result;
    },

    //获取legendValue options，通过 legend type
    async getLegendValueOption() {
      let params = { legend_type: this.legendType };
      let result = [{ value: "1", label: "2019" }, { value: "2", label: "2018" }, { value: "3", label: "2017" }, { value: "4", label: "2016" }];

      // let result = await fetch_legend_options(params);
      return result;
    },

    handle_legend_type_change() {
      this.getLegendValueOption().then(res => {
        this.legendValueOptions = res;
      });

      this.$emit("change", {
        legendType: this.legendType,
        legendValue: this.legendValue,
        targetType: this.targetType,
        targetValue: this.targetValue
      });
    },

    handle_legend_value_change() {
      this.$emit("change", {
        legendType: this.legendType,
        legendValue: this.legendValue,
        targetType: this.targetType,
        targetValue: this.targetValue
      });
    },

    handle_target_type_change() {
      this.targetValue = "";
      this.$emit("change", {
        legendType: this.legendType,
        legendValue: this.legendValue,
        targetType: this.targetType,
        targetValue: this.targetValue
      });
    }
  },

  created() {},
  mounted() {
    this.init();
  }
};
</script> 
  
<style lang="scss" scoped>
.collect-value {
  flex: 1;

  .legend-type {
    margin-bottom: 5px;

    label {
      font-size: 14px;
      color: #484848;
    }
  }

  .legend-value {
    margin-bottom: 15px;
    label {
      font-size: 14px;
      color: #484848;
    }
  }

  .target-type {
    label {
      font-size: 14px;
      color: #484848;
    }
  }
}
</style> 