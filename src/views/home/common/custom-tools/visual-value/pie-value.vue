<template>
    <div class="pie-value">
        <div class="chart-name">
            <label>Name</label>
            <el-form ref="nameForm"
                :model="$data"
                :rules="rules">
                <el-form-item prop="name">
                    <el-input v-model="name"
                        size="mini"
                        @blur="handle_name_blur"></el-input>
                </el-form-item>
            </el-form>
        </div>
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
                @change="handle_legend_value_change"></filter-select>
        </div>
        <div class="target-type">
            <label style="display:block">Value</label>
            <el-radio-group v-model="targetType"
                @change="handle_value_type_change">
                <el-radio label="sum">SUM</el-radio>
                <el-radio label="avg">AVG</el-radio>
            </el-radio-group>
        </div>
    </div>
</template> 
   
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import filterSelect from "@/components/common/filter-select";

export default {
  name: "PieValue",
  components: { filterSelect },

  props: {
    value: {
      type: [Object, Array],
      required: true
    }
  },

  data() {
    let validateName = (rule, value, callback) => {
      let nameRegx = this.$REGXMAP.name;
      if (!value) {
        callback(new Error("Name is required."));
      } else {
        if (!nameRegx.firstPlace.regx.test(value)) {
          callback(new Error(nameRegx.firstPlace.message));
        } else if (!nameRegx.character.regx.test(value)) {
          callback(new Error(nameRegx.character.message));
        } else if (value.length < nameRegx.length.min || value.length > nameRegx.length.max) {
          callback(new Error(nameRegx.length.message));
        } else {
          callback();
        }
      }
    };
    return {
      name: "",
      oldName: "",

      legendType: "",
      legendValue: [],
      targetType: "",

      legendTypeOptions: [],
      legendValueOptions: [],
      rules: {
        name: [{ required: true, validator: validateName, trigger: "blur" }]
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
      this.name = this.value.chartValue.name;
      this.oldName = this.value.chartValue.name;
      
      this.legendType = this.value.chartValue.legendType;
      this.legendValue = this.value.chartValue.legendValue;
      this.targetType = this.value.chartValue.targetType || "sum";

      this.getBasicVisualOptions().then(res => {
        this.legendTypeOptions = res.legend;
      });

      if (this.legendType) {
        this.getLegendValueOption().then(res => {
          this.legendValueOptions = res;
        });
      }
    },
    handle_legend_type_change() {
      this.getLegendValueOption().then(res => {
        this.legendValueOptions = res;
      });

      this.$emit("change", { legendType: this.legendType, legendValue: this.legendValue, targetType: this.targetType });
    },

    async getBasicVisualOptions() {
      let params = { data_source: this.value.dataSource, type: 4 };
      let result = {
        legend: [{ value: "1", label: "category" }, { value: "2", label: "brand" }, { value: "3", label: "group" }, { value: "4", label: "media" }]
      };

      // let result = await this.fetch_basic_visual_options(params);
      return result;
    },

    async getLegendValueOption() {
      let params = { legend_type: this.legendType };
      let result = [{ value: "1", label: "2019" }, { value: "2", label: "2018" }, { value: "3", label: "2017" }, { value: "4", label: "2016" }];

      // let result = await fetch_legend_options(params);
      return result;
    },

    handle_name_blur() {
      this.$refs["nameForm"].validate(valid => {
        if (valid) {
          this.oldName = this.name;
          this.$emit("change", this.getParams());
        }
      });
    },

    handle_legend_value_change() {
      this.$emit("change", this.getParams());
    },

    handle_value_type_change() {
      this.$emit("change", this.getParams());
    },

    getParams() {
      return { name: this.oldName, legendType: this.legendType, legendValue: this.legendValue, targetType: this.targetType };
    }
  },

  created() {},
  mounted() {
    this.init();
  }
};
</script> 
  
<style lang="scss" scoped>
.pie-value {
  flex: 1;

  .chart-name {
    margin-bottom: 25px;
    label {
      font-size: 14px;
      color: #484848;
    }

    /deep/ .el-form {
      .el-form-item__content {
        line-height: 1;
      }
    }
  }

  .legend-type {
    margin-bottom: 5px;
    label {
      font-size: 14px;
      color: #484848;
    }
  }

  .legend-value {
    margin-bottom: 10px;
  }

  .target-type {
    label {
      font-size: 14px;
      color: #484848;
    }
  }
}
</style> 