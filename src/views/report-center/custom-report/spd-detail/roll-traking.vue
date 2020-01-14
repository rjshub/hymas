<template>
    <div class="roll-traking"
        v-loading="isLoading"
        element-loading-spinner="iconfont mas-loading">

        <div class="filter">
            <div class="select-area">
                <hy-box>
                    <el-select size="mini"
                        style="width:150px;"
                        v-model="filter.type"
                        filterable
                        placeholder="Select Type"
                        @change="handle_type_change">
                        <el-option v-for="item in typeOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>

                </hy-box>

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
                    <el-select v-if="filter.type==1"
                        v-model="filter.month"
                        size="mini"
                        style="width:150px;"
                        filterable
                        placeholder="Select Month"
                        @change="fetch_table_data">
                        <el-option v-for="item in monthOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>

                </hy-box>

                <hy-box>
                    <el-select v-if="filter.type==2"
                        size="mini"
                        style="width:150px;"
                        v-model="filter.quarter"
                        filterable
                        placeholder="Select Quarter"
                        @change="fetch_table_data">
                        <el-option v-for="item in quarterOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </hy-box>

            </div>
            <div class="tools">
                <checkbox-popover v-if="pid==0 || pid==1"
                    :items="allColumns"
                    :disabled="isReadOnly"
                    :values="filter.selectedColumns"
                    @change="handle_dropdown_change"></checkbox-popover>

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
            <el-table v-if="totalTableData.row && totalTableData.row.length>0"
                :data="totalTableData.row"
                stripe
                :style="tableStyle"
                header-row-class-name="green">
                <el-table-column label="Ranking"
                    prop="rank"
                    align="center"
                    width="100">
                    <template v-slot="scope">
                        <div>
                            {{scope.row.rank}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="totalTableData.header.name"
                    align="center">
                    <el-table-column label="Total"
                        align="center"
                        width="180">
                        <el-table-column prop="brand"
                            :show-overflow-tooltip="true"
                            align="center"
                            label="Brand"
                            width="180">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{scope.row.brand}}</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>

                <el-table-column align="center">
                    <template v-slot:header>
                        {{formatColumnData(totalTableData.header.percent,1,'%')}}
                    </template>
                    <el-table-column label="Total"
                        align="center"
                        width="150">
                        <el-table-column prop="spd"
                            align="center"
                            label="SPD'Mil"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{formatColumnData(scope.row.spd,1)}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="evl"
                            align="center"
                            label="Evl.%"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <!-- 1为升，-1为降 -->
                                    <span v-if="scope.row.evlstatus==-1"
                                        style="color:#42a996">{{formatColumnData(scope.row.evl,2,"%") }}</span>
                                    <span v-else-if="scope.row.evlstatus==1"
                                        style="color:red">{{formatColumnData(scope.row.evl,2,"%") }}</span>
                                    <span v-else>{{formatColumnData(scope.row.evl,2,"%")}}</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column class-name="seperate"
                    width="10"></el-table-column>

                <template v-for="(item,index) in colsList">
                    <el-table-column :key="index">
                        <el-table-column width="150"
                            align="center">
                            <template v-slot:header>
                                {{item}}
                            </template>
                            <el-table-column label="SPD'Mil"
                                align="center"
                                width="150">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span>{{formatColumnData(scope.row.media_type[index].spd,1) }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="SOS"
                                align="center"
                                width="150">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span>{{formatColumnData(scope.row.media_type[index].sos,0,'%') }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Evl.%"
                                align="center"
                                width="150">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span v-if="scope.row.media_type[index].evlstatus==-1"
                                            style="color:#42a996">{{formatColumnData(scope.row.media_type[index].evl,1,'%') }}</span>
                                        <span v-else-if="scope.row.media_type[index].evlstatus==1"
                                            style="color:red">{{formatColumnData(scope.row.media_type[index].evl,1,'%') }}</span>
                                        <span v-else>
                                            {{formatColumnData(scope.row.media_type[index].evl,1,'%') }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column class-name="seperate"
                        :key="index+'seperate'"
                        width="10"></el-table-column>
                </template>
            </el-table>
            <div v-else
                class="table-empty">
                No Total Data
            </div>

            <!-- Skincare -->
            <el-table v-if="skinCareTableData.row && skinCareTableData.row.length>0"
                :data="skinCareTableData.row"
                stripe
                :style="tableStyle"
                header-row-class-name="green">
                <el-table-column label="Ranking"
                    prop="rank"
                    align="center"
                    width="100">
                    <template v-slot="scope">
                        <div>
                            {{scope.row.rank}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="skinCareTableData.header.name"
                    align="center">
                    <el-table-column label="Skincare"
                        align="center"
                        width="180">
                        <el-table-column prop="brand"
                            align="center"
                            :show-overflow-tooltip="true"
                            label="Brand"
                            width="180">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{scope.row.brand}}</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>

                <el-table-column align="center">
                    <template v-slot:header>
                        {{formatColumnData(skinCareTableData.header.percent,1,'%')}}
                    </template>
                    <el-table-column label="Total"
                        align="center"
                        width="150">
                        <el-table-column prop="spd"
                            align="center"
                            label="SPD'Mil"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{formatColumnData(scope.row.spd,1)}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="evl"
                            align="center"
                            label="Evl.%"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <!-- 1为升，-1为降 -->
                                    <span v-if="scope.row.evlstatus==-1"
                                        style="color:#42a996">{{formatColumnData(scope.row.evl,2,"%") }}</span>
                                    <span v-else-if="scope.row.evlstatus==1"
                                        style="color:red">{{formatColumnData(scope.row.evl,2,"%") }}</span>
                                    <span v-else>{{formatColumnData(scope.row.evl,2,"%")}}</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column class-name="seperate"
                    width="10"></el-table-column>

                <template v-for="(item,index) in colsList">
                    <el-table-column :key="index">
                        <el-table-column width="150"
                            align="center">
                            <template v-slot:header>
                                {{item}}
                            </template>
                            <el-table-column label="SPD'Mil"
                                align="center"
                                width="150">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span> {{formatColumnData(scope.row.media_type[index].spd,1) }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="SOS"
                                align="center"
                                width="150">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span>{{formatColumnData(scope.row.media_type[index].sos,0,'%') }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Evl.%"
                                align="center"
                                width="150">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span v-if="scope.row.media_type[index].evlstatus==-1"
                                            style="color:#42a996">{{formatColumnData(scope.row.media_type[index].evl,1,'%') }}</span>
                                        <span v-else-if="scope.row.media_type[index].evlstatus==1"
                                            style="color:red">{{formatColumnData(scope.row.media_type[index].evl,1,'%') }}</span>
                                        <span v-else>
                                            {{formatColumnData(scope.row.media_type[index].evl,1,'%') }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column class-name="seperate"
                        :key="index+'seperate'"
                        width="10"></el-table-column>
                </template>
            </el-table>
            <div v-else
                class="table-empty">
                No Skincare Data
            </div>

            <!-- Make Up -->
            <el-table v-if="makeUpTableData.row && makeUpTableData.row.length>0"
                :data="makeUpTableData.row"
                stripe
                :style="tableStyle"
                header-row-class-name="green">
                <el-table-column label="Ranking"
                    prop="rank"
                    align="center"
                    width="100">
                    <template v-slot="scope">
                        <div>
                            {{scope.row.rank}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="makeUpTableData.header.name"
                    align="center">
                    <el-table-column label="Make Up"
                        align="center"
                        width="180">
                        <el-table-column prop="brand"
                            align="center"
                            label="Brand"
                            :show-overflow-tooltip="true"
                            width="180">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{scope.row.brand}}</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>

                <el-table-column align="center">
                    <template v-slot:header>
                        {{formatColumnData(makeUpTableData.header.percent,1,'%')}}
                    </template>
                    <el-table-column label="Total"
                        align="center"
                        width="150">
                        <el-table-column prop="spd"
                            align="center"
                            label="SPD'Mil"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{formatColumnData(scope.row.spd,1)}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="evl"
                            align="center"
                            label="Evl.%"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <!-- 1为升，-1为降 -->
                                    <span v-if="scope.row.evlstatus==-1"
                                        style="color:#42a996">{{formatColumnData(scope.row.evl,2,"%") }}</span>
                                    <span v-else-if="scope.row.evlstatus==1"
                                        style="color:red">{{formatColumnData(scope.row.evl,2,"%") }}</span>
                                    <span v-else>{{formatColumnData(scope.row.evl,2,"%")}}</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column class-name="seperate"
                    width="10"></el-table-column>

                <template v-for="(item,index) in colsList">
                    <el-table-column :key="index">
                        <el-table-column width="150"
                            align="center">
                            <template v-slot:header>
                                {{item}}
                            </template>
                            <el-table-column label="SPD'Mil"
                                align="center"
                                width="150">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span>{{formatColumnData(scope.row.media_type[index].spd,1) }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="SOS"
                                align="center"
                                width="150">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span>{{formatColumnData(scope.row.media_type[index].sos,0,'%') }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Evl.%"
                                align="center"
                                width="150">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span v-if="scope.row.media_type[index].evlstatus==-1"
                                            style="color:#42a996">{{formatColumnData(scope.row.media_type[index].evl,1,'%') }}</span>
                                        <span v-else-if="scope.row.media_type[index].evlstatus==1"
                                            style="color:red">{{formatColumnData(scope.row.media_type[index].evl,1,'%') }}</span>
                                        <span v-else>
                                            {{formatColumnData(scope.row.media_type[index].evl,1,'%') }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column class-name="seperate"
                        :key="index+'seperate'"
                        width="10"></el-table-column>
                </template>
            </el-table>
            <div v-else
                class="table-empty">
                No Make-Up Data
            </div>

            <!-- Fragrance -->
            <el-table v-if="fragranceTableData.row && fragranceTableData.row.length>0"
                :data="fragranceTableData.row"
                stripe
                :style="tableStyle"
                header-row-class-name="green">
                <el-table-column label="Ranking"
                    prop="rank"
                    align="center"
                    width="100">
                    <template v-slot="scope">
                        <div>
                            {{scope.row.rank}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="fragranceTableData.header.name"
                    align="center">
                    <el-table-column label="Fragrance"
                        align="center"
                        width="180">
                        <el-table-column prop="brand"
                            align="center"
                            label="Brand"
                            :show-overflow-tooltip="true"
                            width="180">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{scope.row.brand}}</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>

                <el-table-column align="center">
                    <template v-slot:header>
                        {{formatColumnData(fragranceTableData.header.percent,1,'%')}}
                    </template>
                    <el-table-column label="Total"
                        align="center"
                        width="150">
                        <el-table-column prop="spd"
                            align="center"
                            label="SPD'Mil"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <span>{{formatColumnData(scope.row.spd,1)}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="evl"
                            align="center"
                            label="Evl.%"
                            width="150">
                            <template v-slot="scope">
                                <div :class="{summary: scope.row.summary}">
                                    <!-- 1为升，-1为降 -->
                                    <span v-if="scope.row.evlstatus==-1"
                                        style="color:#42a996">{{formatColumnData(scope.row.evl,2,"%") }}</span>
                                    <span v-else-if="scope.row.evlstatus==1"
                                        style="color:red">{{formatColumnData(scope.row.evl,2,"%") }}</span>
                                    <span v-else>{{formatColumnData(scope.row.evl,2,"%")}}</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column class-name="seperate"
                    width="10"></el-table-column>

                <template v-for="(item,index) in colsList">
                    <el-table-column :key="index">
                        <el-table-column width="150"
                            align="center">
                            <template v-slot:header>
                                {{item}}
                            </template>
                            <el-table-column label="SPD'Mil"
                                align="center"
                                width="150">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span>{{formatColumnData(scope.row.media_type[index].spd,1) }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="SOS"
                                align="center"
                                width="150">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span> {{formatColumnData(scope.row.media_type[index].sos,0,'%') }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Evl.%"
                                align="center"
                                width="150">
                                <template v-slot="scope">
                                    <div :class="{summary: scope.row.summary}">
                                        <span v-if="scope.row.media_type[index].evlstatus==-1"
                                            style="color:#42a996">{{formatColumnData(scope.row.media_type[index].evl,1,'%') }}</span>
                                        <span v-else-if="scope.row.media_type[index].evlstatus==1"
                                            style="color:red">{{formatColumnData(scope.row.media_type[index].evl,1,'%') }}</span>
                                        <span v-else>
                                            {{formatColumnData(scope.row.media_type[index].evl,1,'%') }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column class-name="seperate"
                        :key="index+'seperate'"
                        width="10"></el-table-column>
                </template>
            </el-table>
            <div v-else
                class="table-empty">
                No Fragrance Data
            </div>
        </div>

        <transition mode="out-in"
            enter-active-class="animated zoomIn"
            leave-active-class="animated zoomOut">
            <roll-trake-zoom-in v-if="isShowZoomIn"
                :table-data="{total:totalTableData,skincare:skinCareTableData,makeup:makeUpTableData,fragrance:fragranceTableData}"
                :cols-list="colsList"
                @close="isShowZoomIn=false"></roll-trake-zoom-in>
        </transition>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import checkboxPopover from "@/components/common/checkbox-popover";
import rollTrakeZoomIn from "./roll-trake-zoom-in";

export default {
  name: "Roll-Traking",
  components: { checkboxPopover, rollTrakeZoomIn },

  data() {
    return {
      isLoading: false,
      isShowZoomIn: false,
      tableStyle: {
        width: "",
        "max-width": ""
      },

      filter: {
        type: 1,
        year: "",
        month: "",
        quarter: "",
        selectedColumns: []
      },
      typeOptions: [],
      yearOptions: [],
      monthOptions: [],
      quarterOptions: [],

      colsList: [], //   colsList: ["Display", "MG", "NP"], //需要循环的列为3个, 即brands的内容
      totalTableData: {},
      skinCareTableData: {},
      makeUpTableData: {},
      fragranceTableData: {},

      allColumns: []
    };
  },
  computed: {
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
    ...mapActions("reportCenter", ["fetch_roll_traking_table", "fetch_roll_traking_download", "fetch_save_hidden_brands"]),
    async handle_dropdown_change(values) {
      let selectValues = values.filter(item => item != null);

      let noChecked = this.allColumns.filter(item => {
        let has = selectValues.find(i => i == item.id);
        return !has;
      });

      let names = noChecked.map(item => item.id);

      try {
        this.isLoading = true;
        await this.fetch_save_hidden_brands({ type: "green", names });
        await this.fetch_table_data();
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
      }
    },

    formatColumnData(data, decimal = 0, percent_flag = "") {
      if (data === null || data === "" || data === false || data === undefined) {
        return "";
      } else if (data == "-") {
        return "-";
      } else {
        return this.$formatMoney(data, decimal, "") + percent_flag;
      }
    },

    handle_download() {
      this.fetch_roll_traking_download(this.getParams())
        .then(data => {
          this.$downloadFile(data);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    set_cols_list(data) {
      if (data.row && data.row[0] && data.row[0].media_type && data.row[0].media_type.length > 0) {
        return data.row[0].media_type.map(item => item.name);
      } else {
        return [];
      }
    },

    async handle_type_change() {
      await this.fetch_filter_data();
      await this.fetch_table_data();
    },

    async handle_year_change() {
      await this.fetch_filter_data_by_year();
      await this.fetch_table_data();
    },

    getParams() {
      let param = {
        type: this.filter.type,
        year: this.filter.year
      };

      if (this.filter.type == "1") {
        param.per = this.filter.month;
      }
      if (this.filter.type == "2") {
        param.per = this.filter.quarter;
      }

      return param;
    },

    //获取类型和年份
    async fetch_filter_data() {
      try {
        this.isLoading = true;

        /*获取 类型和 年的 options */
        let res = await fetch.get("/report/custom_rollingtraking_filter");
        if (res.ret == 0) {
          let data = res.data;
          this.typeOptions = data.types;
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

        let res = await fetch.post("/report/custom_rollingtraking_per_filter", {
          type: this.filter.type,
          year: this.filter.year
        });

        if (res.ret == 0) {
          let pers = res.data.pers;
          if (this.filter.type == 1) {
            //月份
            this.monthOptions = pers;
          } else {
            //季度
            this.quarterOptions = pers;
          }

          //设置 月份和 季度的默认值
          if (this.filter.type == 1) {
            if (pers && pers.length > 0) {
              this.filter.month = pers[pers.length - 1].id;
            } else {
              this.filter.month = "";
            }
          } else {
            //设置季度
            if (pers && pers.length > 0) {
              this.filter.quarter = pers[pers.length - 1].id;
            } else {
              this.filter.quarter = "";
            }
          }
        } else {
          this.$message.error(res.msg);
        }
      } catch (err) {
        this.$message.error(err.message);
        this.isLoading = false;
      }
    },

    async fetch_table_data() {
      try {
        this.isLoading = true;

        //获取表数据
        let res_table = await this.fetch_roll_traking_table(this.getParams());

        this.allColumns = res_table.brands.map((item, index) => {
          return { id: item.name, name: item.name, disabled: item.disabled };
        });

        this.filter.selectedColumns = res_table.brands
          .filter((item, index) => {
            return item.value == true;
          })
          .map(item => item.name);

        this.totalTableData = res_table["Total"];
        this.skinCareTableData = res_table["Skincare"];
        this.makeUpTableData = res_table["Make-up"];
        this.fragranceTableData = res_table["Fragrances"];

        this.colsList = this.set_cols_list(this.totalTableData);

        setTimeout(() => {
          this.setTableStyle();
          this.isLoading = false;
        }, 0);
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
    },

    //放大 全屏查看
    handle_zoom() {
      this.isShowZoomIn = true;
    }
  },

  async mounted() {
    console.log("1111111111");

    await this.fetch_filter_data();
    await this.fetch_table_data();
  }
};
</script>
<style lang="scss" scoped>
.roll-traking {
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
            background-color: #42a996;
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