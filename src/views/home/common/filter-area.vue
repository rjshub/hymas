<template>
    <div class="filter">
        <div style="display:inline-block;line-height:2;margin-right:5px;">
            <filter-select v-model="yearTypeValue"
                width="70px"
                :options="yearTypeList"
                @change="handle_change_year_type"></filter-select>

            <filter-select v-model="yearValue"
                width="160px"
                :options="yearOptions"
                multiple
                filterable
                placeholder="Select Year"
                @change="handle_change_year"></filter-select>

            <filter-select v-model="quarterValue"
                width="135px"
                :options="quarterOptions"
                multiple
                filterable
                placeholder="Select Quarter"
                @change="handle_change_quarter"></filter-select>

            <filter-select v-model="monthValue"
                width="140px"
                :options="monthOptions"
                multiple
                filterable
                placeholder="Select Month"
                @change="handle_change_month"></filter-select>
        </div>

        <div style="display:inline-block;line-height:2;">
            <filter-select v-model="clientValue"
                style="margin-left:0"
                width="100px"
                :options="clientOptions"
                filterable
                :is-overlap-placeholder-color="true"
                placeholder="All Client"
                @change="handle_change_client">
            </filter-select>

            <filter-select v-model="categoryValue"
                width="160px"
                :options="categoryOptions"
                multiple
                filterable
                :is-overlap-placeholder-color="true"
                placeholder="All Categories"
                @change="handle_change_category">
            </filter-select>
            <filter-select v-model="groupValue"
                width="200px"
                :options="groupOptions"
                multiple
                :is-overlap-placeholder-color="true"
                filterable
                placeholder="All Groups"
                @change="handle_change_group"></filter-select>
            <filter-select v-model="brandValue"
                width="220px"
                :options="brandOptions"
                multiple
                filterable
                :is-overlap-placeholder-color="true"
                placeholder="All Brands"
                @change="handle_change_brand"></filter-select>

            <filter-select v-model="dtValue"
                width="160px"
                :options="dtOptions"
                multiple
                filterable
                placeholder="Select Digital&amp;Traditional"
                @change="handle_change_dt"></filter-select>
            <filter-select v-model="mediaTypeValue"
                width="150px"
                :options="mediaTypeOptions"
                multiple
                filterable
                :is-overlap-placeholder-color="true"
                placeholder="All Media Types"
                @change="handle_change_mediaType"></filter-select>

        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import filterSelect from "@/components/common/filter-select";

export default {
  name: "Filter-Area",
  components: { filterSelect },

  props: {
    defaultYearLength: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      yearTypeValue: "1", //自然年，还是财年
      yearValue: [],
      cloneYearValue: [], //保留上一次的值
      quarterValue: [],
      monthValue: [],

      categoryValue: [],
      clientValue: "", //默认ELC
      groupValue: [],
      brandValue: [],

      dtValue: [], //Digital&Traditional
      mediaTypeValue: [], //Digital&Traditional

      yearOptions: [],
      quarterOptions: [],
      monthOptions: [],
      clientOptions: [],
      categoryOptions: [],
      groupOptions: [],
      brandOptions: [],
      dtOptions: [],
      mediaTypeOptions: []
    };
  },
  computed: {
    ...mapState("common", ["yearTypeList"])
  },

  methods: {
    ...mapActions("home", ["fetch_filter_list"]),

    //当 year type改变时
    async handle_change_year_type(value) {
      try {
        this.yearOptions = await this.fetch_filter_list({ type: "year", value });
        if (this.yearOptions && this.yearOptions.length > 0) {
          let prevFive = this.yearOptions.slice(0, this.defaultYearLength);
          this.yearValue = prevFive.map(item => item.value);
          this.cloneYearValue = [...this.yearValue];
        }
        this.$emit("change", { value: this.getParams() });
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    //当 year改变时
    async handle_change_year(value) {
      try {
        if (value.length <= 0) {
          //一个都没选
          this.yearValue = [...this.cloneYearValue];
          this.$message.warning("At least one Year is selected");
          return;
        }
        this.cloneYearValue = [...value];
        this.quarterValue = [];
        this.monthValue = [];

        this.$emit("change", { value: this.getParams() });

        let res_quarters = await this.fetch_filter_list({ type: "quarter", value });
        this.quarterOptions = res_quarters.options;
        this.quarterValue = res_quarters.select.map(item => item.value); //返回 季度的默认值
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    //当 quarter 改变时
    async handle_change_quarter(value) {
      try {
        this.monthValue = [];

        this.$emit("change", { value: this.getParams() });

        if (value && value.length > 0) {
          this.monthOptions = await this.fetch_filter_list({ type: "month", value });
        } else {
          this.monthOptions = [];
        }
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    //当 month 改变时
    async handle_change_month(value) {
      this.$emit("change", { value: this.getParams() });
    },

    //当 client 改变时
    async handle_change_client(value) {
      this.categoryValue = [];
      this.groupValue = [];
      this.brandValue = [];

      this.$emit("change", { value: this.getParams() });

      this.categoryOptions = await this.fetch_filter_list({ type: "category", value: this.clientValue });
    },

    //当 category 改变时
    async handle_change_category(value) {
      try {
        this.groupValue = [];
        this.brandValue = [];

        this.$emit("change", { value: this.getParams() });

        this.groupOptions = await this.fetch_filter_list({ type: "group", value });
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    //当 group 改变时
    async handle_change_group(value) {
      try {
        this.brandValue = [];

        this.$emit("change", { value: this.getParams() });

        this.brandOptions = await this.fetch_filter_list({ type: "brand", value });
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    //当 brand 改变时
    async handle_change_brand(value) {
      this.$emit("change", { value: this.getParams() });
    },

    //当 digital & tranditional 改变时
    async handle_change_dt(value) {
      try {
        this.mediaTypeValue = [];

        this.$emit("change", { value: this.getParams() });

        this.mediaTypeOptions = await this.fetch_filter_list({ type: "type", value });
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    async handle_change_mediaType(value) {
      this.$emit("change", { value: this.getParams() });
    },

    getParams() {
      return {
        yearType: this.yearTypeValue,
        year: this.yearValue,
        quarter: this.quarterValue,
        month: this.monthValue,
        client: this.clientValue,
        category: this.categoryValue,
        group: this.groupValue,
        brand: this.brandValue,
        digital: this.dtValue,
        type: this.mediaTypeValue
      };
    },

    async init() {
      try {
        let [res_year, res_client, res_category, res_group, res_brand, res_digital, res_type] = await Promise.all([
          this.fetch_filter_list({ type: "year", value: "1" }),
          this.fetch_filter_list({ type: "client", value: "" }),
          this.fetch_filter_list({ type: "category", value: this.clientValue }),
          this.fetch_filter_list({ type: "group", value: "" }),
          this.fetch_filter_list({ type: "brand", value: "" }),
          this.fetch_filter_list({ type: "digital", value: "" }),
          this.fetch_filter_list({ type: "type", value: "" })
        ]);

        this.yearOptions = res_year;
        this.clientOptions = res_client;
        this.clientValue = "1";
        this.categoryOptions = res_category;
        this.groupOptions = res_group;
        this.brandOptions = res_brand;
        this.dtOptions = res_digital;
        this.mediaTypeOptions = res_type;

        if (this.yearOptions && this.yearOptions.length > 0) {
          let prevFive = this.yearOptions.slice(0, this.defaultYearLength);
          this.yearValue = prevFive.map(item => item.value);
          this.cloneYearValue = [...this.yearValue];

          if (this.yearValue) {
            let res_quarters = await this.fetch_filter_list({ type: "quarter", value: this.yearValue });
            this.quarterOptions = res_quarters.options;
            this.quarterValue = res_quarters.select.map(item => item.value); //返回 季度的默认值

            this.$emit("change", { type: "year", value: this.getParams() });

            //放在后面不阻止页面的加载
            this.monthOptions = await this.fetch_filter_list({ type: "month", value: this.quarterValue });
          } else {
            this.$emit("change", { type: "yearType", value: this.getParams() });
          }
        } else {
          this.$emit("change", { type: "yearType", value: this.getParams() });
        }
      } catch (err) {
        this.$message.error(err.message);
      }
    }
  },

  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.filter {
  background-color: white;
}
</style>
