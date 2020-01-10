

<template>
    <el-dialog title="Competitor SPD"
        class="competitor-zoom-in"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="true"
        width="450px"
        @close="handle_close">

        <div class="table-wrap">
            <!-- total  table -->
            <div class="total-table">
                <el-table v-if="totalTableData && totalTableData.length>0"
                    :data="totalTableData"
                    stripe
                    :style="tableStyle"
                    header-row-class-name="blue">
                    <el-table-column label="Brand"
                        align="center">
                        <el-table-column label="Total"
                            align="center"
                            width="180">
                            <el-table-column prop="name"
                                align="center"
                                :show-overflow-tooltip="true"
                                label="Brand"
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
                <!-- 小众品牌  table -->
                <el-table v-if="otherTableData && otherTableData.length>0"
                    :data="otherTableData"
                    stripe
                    :style="tableStyle"
                    header-row-class-name="blue">
                    <el-table-column label="Brand"
                        align="center">
                        <el-table-column label="Total"
                            align="center"
                            width="180">
                            <el-table-column prop="brand_name"
                                align="center"
                                :show-overflow-tooltip="true"
                                label="小众Brand"
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

        <span slot="footer">
            <el-button size="mini"
                @click="handle_close">Close</el-button>
        </span>
    </el-dialog>

</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "Competitor-Zoom-In",
  components: {},
  props: {
    totalTableData: {
      type: [Object, Array],
      required: true
    },
    otherTableData: {
      type: [Object, Array],
      required: true
    },
    colsList: {
      type: [Object, Array],
      required: true
    }
  },
  data() {
    return {
      tableStyle: {
        width: "",
        "max-width": ""
      }
    };
  },

  methods: {
    isSpd(name) {
      return name.toUpperCase() == "SPD";
    },

    getCurrentYearName() {
      return this.colsList.current_year[0].substring(0, 4);
    },

    handle_close() {
      this.$emit("close");
    },

    setTableStyle() {
      this.$nextTick(() => {
        let width = jquery(".competitor-zoom-in .el-table__body").width();
        this.tableStyle = {
          width: width + 1 + "px",
          "max-width": width + 1 + "px"
        };
      });
    }
  },
  computed: {},

  mounted() {
    this.setTableStyle();
  }
};
</script>
<style lang="scss" scoped>
.competitor-zoom-in {
  overflow: visible;
  /deep/ .el-dialog {
    display: flex;
    flex-direction: column;
    margin-top: 2vh !important;
    width: 97vw !important;
    height: 96vh !important;

    .el-dialog__body {
      flex: 1;
      display: flex;
      padding: 0;
      overflow: auto;

      .table-wrap {
        flex: 1;
        overflow: auto;
        contain: strict;

        .el-table {
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
    .el-dialog__footer {
      display: none;
    }
  }
}
</style>