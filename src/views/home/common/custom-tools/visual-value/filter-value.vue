<template>
    <div class="table-value">
        <div class="field-name">
            <label>Value</label>
            <filter-select v-model="filterName"
                width="100%"
                :options="filterNameOptions"
                filterable
                multiple
                placeholder="Select"
                @change="handle_filter_name_change"></filter-select>
        </div>
    </div>
</template> 

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import filterSelect from "@/components/common/filter-select";

export default {
  name: "TableValue",
  components: { filterSelect },

  props: {
    value: {
      type: [Object, Array],
      required: true
    }
  },

  data() {
    return {
      filterName: "",
      filterNameOptions: []
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
      this.filterName = this.value.chartValue.filterName;

      this.getBasicVisualOptions().then(res => {
        this.filterNameOptions = res.filters;
      });
    },

    async getBasicVisualOptions() {
      let params = { data_source: this.value.dataSource, type: 7 };
      let result = {
        filters: [{ value: "1", label: "category" }, { value: "2", label: "brand" }, { value: "3", label: "group" }, { value: "4", label: "media" }]
      };

      // let result = await this.fetch_basic_visual_options(params);
      return result;
    },

    handle_filter_name_change() {
      this.$emit("change", { filterName: this.filterName });
    }
  },

  mounted() {
    this.init();
  }
};
</script> 
  
<style lang="scss" scoped>
.table-value {
  flex: 1;

  .field-name {
    margin-bottom: 5px;
    label {
      font-size: 14px;
      color: #484848;
    }
  }
}
</style> 