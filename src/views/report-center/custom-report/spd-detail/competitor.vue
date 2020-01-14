<template>
    <div class="competitor"
        v-loading="isLoading"
        element-loading-spinner="iconfont mas-loading">
        <div class="filter">
            <div class="select-are">
                <hy-box>
                    <el-select size="mini"
                        style="width:150px;"
                        v-model="filter.year"
                        filterable
                        placeholder="Select Year"
                        @change="handle_year_change">
                        <el-option v-for="item in yearOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </hy-box>
                <hy-box>
                    <el-select size="mini"
                        style="width:150px;"
                        v-model="filter.month"
                        filterable
                        placeholder="Select Month"
                        @change="handle_month_change">
                        <el-option v-for="item in monthOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </hy-box>
                <hy-box>
                    <el-select size="mini"
                        style="width:150px;"
                        v-model="filter.category"
                        filterable
                        placeholder="Select Category"
                        @change="fetch_table_data">
                        <el-option v-for="item in categoryList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </hy-box>

            </div>
            <div class="tools">
                <hy-box>
                    <el-button size="mini"
                        icon="iconfont mas-zoom-in"
                        title="Full screen view"
                        @click="handle_zoom"></el-button>
                </hy-box>

                <hy-box>
                    <el-button size="mini"
                        icon="iconfont mas-download"
                        title="Download"
                        @click="handle_download"></el-button>
                </hy-box>
            </div>
        </div>
        <div class="table-wrap">
            <!-- total  table -->
            <div class="total-table">
                <div class="table-select-dropdown">
                    <checkbox-popover v-if="pid==0 || pid==1"
                        :items="totalAllColumns"
                        :disabled="isReadOnly"
                        :values="filter.totalSelectedColumns"
                        @change="handle_total_dropdown_change"></checkbox-popover>
                </div>
                <el-table v-if="totalTableData && totalTableData.length>0"
                    :data="totalTableData"
                    stripe
                    :style="tableStyle"
                    header-row-class-name="blue">
                    <el-table-column label="Brand"
                        align="center">
                        <el-table-column :label="totalTitle"
                            align="center"
                            width="180">
                            <el-table-column prop="name"
                                align="center"
                                label="Brand"
                                :show-overflow-tooltip="true"
                                width="180">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span>{{scope.row.name}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column align="center">
                        <template v-slot:header>
                            当月数据
                        </template>
                        <el-table-column prop="spd"
                            align="center"
                            label="SPD"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{$formatMoney(scope.row.current_month.spd,1,'') }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sos"
                            align="center"
                            label="SOS"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{$formatMoney(scope.row.current_month.sos,0,'')}}%</span>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="spdya"
                            align="center"
                            label="SPD YA"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{$formatMoney(scope.row.current_month.spdya,1,'') }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="spd_vs_ya"
                            align="center"
                            label="SPD VS YA"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{$formatMoney(scope.row.current_month.spd_vs_ya,0,'')}}%</span>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="sos_vs_ya"
                            align="center"
                            label="SOS VS YA"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{$formatMoney(scope.row.current_month.sos_vs_ya,0,'')}}%</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column prop="2019"
                        align="center"
                        width="150">
                        <template v-slot:header>
                            {{getCurrentYearName()}}
                        </template>

                        <!-- 开始循环  start-->
                        <template v-for="(item,index) in colsList.current_year">
                            <el-table-column prop=""
                                :key="index+'s'"
                                align="center"
                                width="150">
                                <template v-slot:header>
                                    {{colsList.current_year[index]}}
                                </template>

                                <el-table-column prop=""
                                    align="center"
                                    label="SPD"
                                    width="150">
                                    <template v-slot="scope">
                                        <div :class="{summary: scope.row.summary}">
                                            <span>{{$formatMoney(scope.row.current_year[index].spd,1,'') }}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop=""
                                    align="center"
                                    label="SOS"
                                    width="150">
                                    <template v-slot="scope">
                                        <div :class="{summary: scope.row.summary}">
                                            <span>{{$formatMoney(scope.row.current_year[index].sos,0,'')}}%</span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column prop=""
                                :key="index+'p'"
                                align="center"
                                label="SPD"
                                width="150">
                                <el-table-column prop=""
                                    align="center"
                                    label="VS YA"
                                    width="150">
                                    <template v-slot="scope">
                                        <div :class="{summary: scope.row.summary}">
                                            <span>{{$formatMoney(scope.row.current_year[index].spd_vs_ya,0,'')}}%</span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column prop=""
                                :key="index+'d'"
                                align="center"
                                label="SOS"
                                width="150">
                                <el-table-column prop=""
                                    align="center"
                                    label="VS YA"
                                    width="150">
                                    <template v-slot="scope">
                                        <div :class="{summary: scope.row.summary}">
                                            <span>{{$formatMoney(scope.row.current_year[index].sos_vs_ya,0,'')}}%</span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                        </template>
                        <!-- 开始循环  end-->
                    </el-table-column>

                    <el-table-column prop=""
                        align="center"
                        label="同期数据对比"
                        width="150">
                        <!-- 开始循环 start-->
                        <template v-for="(item,index) in colsList.same_perid">
                            <el-table-column prop=""
                                :key="index"
                                align="center"
                                width="150">
                                <template v-slot:header>
                                    {{colsList.same_perid[index].name1}}
                                </template>
                                <el-table-column prop=""
                                    align="center"
                                    label="VS YA"
                                    width="150">
                                    <template v-slot:header>
                                        {{colsList.same_perid[index].name2}}
                                    </template>
                                    <template v-slot="scope">
                                        <div v-if="isSpd(colsList.same_perid[index].name2)"
                                            :class="{summary: scope.row.summary}">
                                            <span>{{$formatMoney(scope.row.same_perid[index].value,1,'')}}</span>
                                        </div>
                                        <div v-else
                                            :class="{summary: scope.row.summary}">
                                            <span>{{$formatMoney(scope.row.same_perid[index].value,0,'')}}%</span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                        </template>
                        <!-- 开始循环 end-->
                    </el-table-column>
                </el-table>
                <div v-else
                    class="table-empty">
                    No Total Data
                </div>
            </div>

            <div class="other-table"
                v-if="otherTableData && otherTableData.length>0">
                <div class="table-select-dropdown">
                    <checkbox-popover v-if="pid==0 || pid==1"
                        :items="otherAllColumns"
                        :disabled="isReadOnly"
                        :values="filter.othersSelectedColumns"
                        @change="handle_other_dropdown_change"></checkbox-popover>
                </div>
                <!-- 小众品牌  table -->
                <el-table v-if="otherTableData && otherTableData.length>0"
                    :data="otherTableData"
                    stripe
                    :style="tableStyle"
                    header-row-class-name="blue">
                    <el-table-column label="Brand"
                        align="center">
                        <el-table-column :label="totalTitle"
                            align="center"
                            width="180">
                            <el-table-column prop="brand_name"
                                align="center"
                                label="小众Brand"
                                :show-overflow-tooltip="true"
                                width="180">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span>{{scope.row.name}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column align="center">
                        <template v-slot:header>
                            当月数据
                        </template>
                        <el-table-column prop="spd"
                            align="center"
                            label="SPD"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{$formatMoney(scope.row.current_month.spd,1,'') }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sos"
                            align="center"
                            label="SOS"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{$formatMoney(scope.row.current_month.sos,0,'')}}%</span>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="spdya"
                            align="center"
                            label="SPD YA"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{$formatMoney(scope.row.current_month.spdya,1,'') }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="spd_vs_ya"
                            align="center"
                            label="SPD VS YA"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{$formatMoney(scope.row.current_month.spd_vs_ya,0,'')}}%</span>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="sos_vs_ya"
                            align="center"
                            label="SOS VS YA"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{$formatMoney(scope.row.current_month.sos_vs_ya,0,'')}}%</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column prop="2019"
                        align="center"
                        width="150">
                        <template v-slot:header>
                            {{getCurrentYearName()}}
                        </template>

                        <!-- 开始循环  start-->
                        <template v-for="(item,index) in colsList.current_year">
                            <el-table-column prop=""
                                :key="index+'s'"
                                align="center"
                                width="150">
                                <template v-slot:header>
                                    {{colsList.current_year[index]}}
                                </template>

                                <el-table-column prop=""
                                    align="center"
                                    label="SPD"
                                    width="150">
                                    <template v-slot="scope">
                                        <div :class="{summary: scope.row.summary}">
                                            <span>{{$formatMoney(scope.row.current_year[index].spd,1,'') }}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop=""
                                    align="center"
                                    label="SOS"
                                    width="150">
                                    <template v-slot="scope">
                                        <div :class="{summary: scope.row.summary}">
                                            <span>{{$formatMoney(scope.row.current_year[index].sos,0,'')}}%</span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column prop=""
                                :key="index+'p'"
                                align="center"
                                label="SPD"
                                width="150">
                                <el-table-column prop=""
                                    align="center"
                                    label="VS YA"
                                    width="150">
                                    <template v-slot="scope">
                                        <div :class="{summary: scope.row.summary}">
                                            <span>{{$formatMoney(scope.row.current_year[index].spd_vs_ya,0,'')}}%</span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                            <el-table-column prop=""
                                :key="index+'d'"
                                align="center"
                                label="SOS"
                                width="150">
                                <el-table-column prop=""
                                    align="center"
                                    label="VS YA"
                                    width="150">
                                    <template v-slot="scope">
                                        <div :class="{summary: scope.row.summary}">
                                            <span>{{$formatMoney(scope.row.current_year[index].sos_vs_ya,0,'')}}%</span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                        </template>
                        <!-- 开始循环  end-->
                    </el-table-column>

                    <el-table-column prop=""
                        align="center"
                        label="同期数据对比"
                        width="150">
                        <!-- 开始循环 start-->
                        <template v-for="(item,index) in colsList.same_perid">
                            <el-table-column prop=""
                                :key="index"
                                align="center"
                                width="150">
                                <template v-slot:header>
                                    {{colsList.same_perid[index].name1}}
                                </template>
                                <el-table-column prop=""
                                    align="center"
                                    label="VS YA"
                                    width="150">
                                    <template v-slot:header>
                                        {{colsList.same_perid[index].name2}}
                                    </template>
                                    <template v-slot="scope">
                                        <div v-if="isSpd(colsList.same_perid[index].name2)"
                                            :class="{summary: scope.row.summary}">
                                            <span>{{$formatMoney(scope.row.same_perid[index].value,1,'')}}</span>
                                        </div>
                                        <div v-else
                                            :class="{summary: scope.row.summary}">
                                            <span>{{$formatMoney(scope.row.same_perid[index].value,0,'')}}%</span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table-column>
                        </template>
                        <!-- 开始循环 end-->
                    </el-table-column>
                </el-table>
                <div v-else
                    class="table-empty">
                    No Others Data
                </div>
            </div>
        </div>

        <transition mode="out-in"
            enter-active-class="animated zoomIn"
            leave-active-class="animated zoomOut">
            <competitor-zoom-in v-if="isShowZoomIn"
                :total-table-data="totalTableData"
                :other-table-data="otherTableData"
                :cols-list="colsList"
                :label="totalTitle"
                @close="isShowZoomIn=false"></competitor-zoom-in>
        </transition>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import checkboxPopover from "@/components/common/checkbox-popover";
import competitorZoomIn from "./competitor-zoom-in";

export default {
  name: "Competitor",
  components: { checkboxPopover, competitorZoomIn },

  data() {
    return {
      isLoading: false,
      isShowZoomIn: false,
      tableStyle: {
        width: "100%",
        "max-width": "100%"
      },

      filter: {
        year: "",
        month: "",
        category: "0",
        totalSelectedColumns: [], //大品牌筛选
        othersSelectedColumns: [] //小众筛选
      },

      totalTitle: "Total",

      yearOptions: [],

      monthOptions: [],

      colsList: {},
      totalTableData: [],
      otherTableData: {},

      totalAllColumns: [],
      otherAllColumns: []
    };
  },

  computed: {
    ...mapState("common", ["categoryList"]),
    ...mapState("user", ["pid"]),

    ...mapGetters("reportCenter", ["permissionSpdReport"]),

    isReadOnly() {
      if (this.permissionSpdReport) {
        return this.permissionSpdReport.isRead || false;
      } else {
        return false;
      }
    }
  },

  methods: {
    ...mapActions("reportCenter", [
      "fetch_competitor_total_table",
      "fetch_competitor_other_table",
      "fetch_competitor_download",
      "fetch_save_hidden_brands"
    ]),

    isSpd(name) {
      return name.toUpperCase() == "SPD";
    },

    getCurrentYearName() {
      console.log("colsList", this.colsList);

      return this.colsList.current_year[0].substring(0, 4);
    },

    handle_zoom() {
      this.isShowZoomIn = true;
    },

    handle_download() {
      this.fetch_competitor_download(this.getParams("download"))
        .then(data => {
          this.$downloadFile(data);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    async handle_year_change() {
      await this.fetch_filter_data_by_year();
      await this.fetch_table_data();
    },

    async handle_month_change() {
      this.setTotalTitle();
      await this.fetch_table_data();
    },

    getParams(type) {
      let params = { year: this.filter.year, month: this.filter.month, category: this.filter.category };
      return params;
    },

    async handle_total_dropdown_change(values) {
      let selectValues = values.filter(item => item != null);

      let noChecked = this.totalAllColumns.filter(item => {
        let has = selectValues.find(i => i == item.id);
        return !has;
      });

      let names = noChecked.map(item => item.id);

      let type = "blueup";
      if (this.filter.category == 1) {
        type = "skincare";
      } else if (this.filter.category == 2) {
        type = "make-up";
      } else if (this.filter.category == 3) {
        type = "fragrances";
      }

      try {
        this.isLoading = true;
        await this.fetch_save_hidden_brands({ type, names });
        await this.fetch_table_data();
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
      }
    },
    async handle_other_dropdown_change(values) {
      let selectValues = values.filter(item => item != null);

      let noChecked = this.otherAllColumns.filter(item => {
        let has = selectValues.find(i => i == item.id);
        return !has;
      });

      let names = noChecked.map(item => item.id);

      let type = "bluedown";
      //   if (this.filter.category == 1) {
      //     type = "skincare";
      //   } else if (this.filter.category == 2) {
      //     type = "make-up";
      //   } else if (this.filter.category == 3) {
      //     type = "fragrances";
      //   }

      try {
        this.isLoading = true;
        await this.fetch_save_hidden_brands({ type, names });
        await this.fetch_table_data();
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
      }
    },

    set_cols_list(data) {
      let result = { current_year: [], same_perid: [] };

      if (data[0]) {
        if (data[0].current_year && data[0].current_year.length > 0) {
          result.current_year = data[0].current_year.map(item => item.name);
        }

        if (data[0].same_perid && data[0].same_perid.length > 0) {
          result.same_perid = data[0].same_perid.map(item => {
            return { name1: item.name1, name2: item.name2 };
          });
        }
      }

      return result;
    },

    async fetch_filter_data() {
      try {
        this.isLoading = true;

        let res = await fetch.get("/report/custom_competitor_spd_filter");
        if (res.ret == 0) {
          let data = res.data;
          this.yearOptions = data.years;

          //设置 年的默认值
          if (this.yearOptions && this.yearOptions.length > 0) {
            this.filter.year = this.yearOptions[0].value;
          } else {
            this.filter.year = "";
          }

          await this.fetch_filter_data_by_year();
        } else {
          this.$message.error(res.msg);
        }
      } catch (err) {
        this.$message.error(err.message);
        this.isLoading = false;
      }
    },

    //通过年份获取 月份和季度
    async fetch_filter_data_by_year() {
      try {
        this.isLoading = true;

        let res = await fetch.post("/report/custom_competitor_spd_per_filter", {
          year: this.filter.year
        });

        if (res.ret == 0) {
          let month = res.data.month;
          this.monthOptions = month;

          if (this.monthOptions && this.monthOptions.length > 0) {
            this.filter.month = this.monthOptions[this.monthOptions.length - 1].id;
          } else {
            this.filter.month = "";
          }

          this.setTotalTitle();
        } else {
          this.$message.error(res.msg);
        }
      } catch (err) {
        this.$message.error(err.message);
        this.isLoading = false;
      }
    },

    setTotalTitle() {
      let monthMap = {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec"
      };

      this.totalTitle = monthMap[this.filter.month];
    },

    async fetch_table_data() {
      try {
        this.isLoading = true;

        let [total_data] = await Promise.all([this.fetch_competitor_total_table(this.getParams("total"))]);

        //设置 brand
        this.totalTableData = total_data.up;
        this.totalAllColumns = total_data.upbrands.map((item, index) => {
          return { id: item.name, name: item.name, disabled: item.disabled };
        });
        this.filter.totalSelectedColumns = total_data.upbrands
          .filter((item, index) => {
            return item.value == true;
          })
          .map(item => item.name);

        //设置 other brand
        this.otherTableData = total_data.down;
        this.otherAllColumns = total_data.downbrands.map((item, index) => {
          return { id: item.name, name: item.name, disabled: item.disabled };
        });
        this.filter.othersSelectedColumns = total_data.downbrands
          .filter((item, index) => {
            return item.value == true;
          })
          .map(item => item.name);

        this.colsList = this.set_cols_list(this.totalTableData);

        this.$emit("competitor_fetch", "done");
        setTimeout(() => {
          //   this.setTableStyle();
          this.isLoading = false;
        }, 1000);
      } catch (err) {
        this.$message.error(err.message);
        this.isLoading = false;
      }
    },

    setTableStyle() {
      this.$nextTick(() => {
        let width = jquery(".el-table__body").width();
        this.tableStyle = {
          width: width + 1 + "px",
          "max-width": width + 1 + "px"
        };
      });
    }
  },

  async mounted() {
    await this.fetch_filter_data();
    await this.fetch_table_data();
  }
};
</script>
<style lang="scss" scoped>
.competitor {
  height: 100%;
  display: flex;
  flex-direction: column;
  .filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .table-wrap {
    flex: 1;
    overflow: auto;
    contain: strict;

    .table-select-dropdown {
      text-align: right;
      padding: 10px;
    }

    ::v-deep .el-table {
      margin-bottom: 50px;

      td,
      th {
        padding: 0;
      }

      td {
        padding: 0;
        .cell {
          padding: 0;

          div,
          span {
            padding: 2px;
          }

          .summary {
            background-color: #3895c5;
            color: white;
            div,
            span {
              color: inherit !important;
            }
          }
        }
      }
    }

    .table-empty {
      width: 99%;
      height: 100px;
      border: 1px solid #d8d8d8;
      margin-bottom: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #b8b8b8;
    }
  }
}
</style>