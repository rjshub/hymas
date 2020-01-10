<template>
    <div class="table-value">
        <div class="field-name">
            <label>Field Name</label>
            <filter-select v-model="fieldName"
                width="100%"
                :options="fieldNameOptions"
                filterable
                multiple
                placeholder="Select"
                @change="handle_field_name_change"></filter-select>
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
      fieldName: "",
      fieldNameOptions: []
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
    ...mapActions("home", ["fetch_basic_visual_options"]),

    init() {
      this.fieldName = this.value.chartValue.fieldName;

      //获取 fieldName 的option
      this.getBasicVisualOptions().then(res => {
        this.fieldNameOptions = res.fields;
      });
    },
    async getBasicVisualOptions() {
      let params = { data_source: this.value.dataSource, type: 6 };
      let result = {
        fields: [{ value: "1", label: "category" }, { value: "2", label: "brand" }, { value: "3", label: "group" }, { value: "4", label: "media" }]
      };

      // let result = await this.fetch_basic_visual_options(params);
      return result;
    },

    handle_field_name_change() {
      this.$emit("change", { fieldName: this.fieldName });
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