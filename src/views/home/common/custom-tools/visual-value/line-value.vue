<template>
    <div class="line-value">
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
        <div class="horizontal-axis">
            <label>Horizontal axis</label>
            <filter-select v-model="xAxis"
                width="100%"
                :options="xAxisOptions"
                filterable
                multiple
                placeholder="Select"
                @change="handle_x_axis_change"></filter-select>
        </div>
        <div class="vertical-axis">
            <label>Vertical axis</label>
            <filter-select v-model="yAxis"
                width="100%"
                :options="yAxisOptions"
                filterable
                placeholder="Select "
                @change="handle_y_axis_change"></filter-select>
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
            <label style="display:block">Sorting</label>
            <filter-select v-model="sortingField"
                width="100%"
                :options="sortingFieldOptions"
                filterable
                placeholder="Select "
                @change="handle_sorting_field_change"></filter-select>

            <div style="margin-top:5px;">
                <el-radio-group v-model="sortingType"
                    size="mini"
                    @change="handle_sorting_type_change">
                    <el-radio-button label="asc">
                        <i class="iconfont mas-up"></i>
                    </el-radio-button>
                    <el-radio-button label="desc">
                        <i class="iconfont mas-down"></i>
                    </el-radio-button>
                </el-radio-group>
            </div>

        </div>
    </div>
</template> 
   
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import filterSelect from "@/components/common/filter-select";

export default {
  name: "LineValue",
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

      xAxis: [],
      yAxis: "",
      legendType: "",
      legendValue: [],
      sortingField: "",
      sortingType: "",

      xAxisOptions: [],
      yAxisOptions: [],
      legendTypeOptions: [],
      legendValueOptions: [],
      sortingFieldOptions: [],

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

      this.xAxis = this.value.chartValue.xAxis;
      this.yAxis = this.value.chartValue.yAxis;
      this.legendType = this.value.chartValue.legendType;
      this.legendValue = this.value.chartValue.legendValue;
      this.sortingField = this.value.chartValue.sortingField;
      this.sortingType = this.value.chartValue.sortingType || "asc";

      this.getBasicVisualOptions().then(res => {
        this.xAxisOptions = res.xAxis;
        this.yAxisOptions = res.yAxis;
        this.legendTypeOptions = res.legend;

        if (this.xAxis && this.xAxis.length > 0) {
          this.getSortingOptions();
        }
      });

      if (this.legendType) {
        this.getLegendValueOption().then(res => {
          this.legendValueOptions = res;
        });
      }
    },

    async getBasicVisualOptions() {
      let params = { data_source: this.value.dataSource, type: 5 };
      let result = {
        xAxis: [{ value: "1", label: "category" }, { value: "2", label: "brand" }, { value: "3", label: "group" }, { value: "4", label: "media" }],
        yAxis: [{ value: "1", label: "category" }, { value: "2", label: "brand" }, { value: "3", label: "group" }, { value: "4", label: "media" }],
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
    getSortingOptions() {
      this.sortingFieldOptions = this.xAxisOptions.filter(item => {
        let has = this.xAxis.find(jtem => {
          return jtem == item.value;
        });

        return has || false;
      });
    },

    handle_name_blur() {
      this.$refs["nameForm"].validate(valid => {
        if (valid) {
          this.oldName = this.name;
          this.$emit("change", this.getParams());
        }
      });
    },

    handle_x_axis_change() {
      this.getSortingOptions();
      this.$emit("change", this.getParams());
    },

    handle_y_axis_change() {
      this.$emit("change", this.getParams());
    },

    handle_legend_type_change() {
      this.getLegendValueOption().then(res => {
        this.legendValueOptions = res;
      });

      this.$emit("change", this.getParams());
    },

    handle_legend_value_change() {
      this.$emit("change", this.getParams());
    },

    handle_value_type_change() {
      this.$emit("change", this.getParams());
    },

    handle_sorting_field_change() {
      this.$emit("change", this.getParams());
    },
    handle_sorting_type_change() {
      this.$emit("change", this.getParams());
    },

    getParams() {
      return {
        name: this.oldName,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        legendType: this.legendType,
        legendValue: this.legendValue,
        sortingField: this.sortingField,
        sortingType: this.sortingType
      };
    }
  },

  created() {},
  mounted() {
    this.init();
  }
};
</script> 
  
<style lang="scss" scoped>
.line-value {
  flex: 1;
  .chart-name {
    margin-bottom: 25px;
    label {
      font-size: 14px;
      color: #484848;
    }

    ::v-deep .el-form {
      .el-form-item__content {
        line-height: 1;
      }
    }
  }

  .horizontal-axis {
    margin-bottom: 10px;
    label {
      font-size: 14px;
      color: #484848;
    }
  }

  .vertical-axis {
    margin-bottom: 10px;
    label {
      font-size: 14px;
      color: #484848;
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