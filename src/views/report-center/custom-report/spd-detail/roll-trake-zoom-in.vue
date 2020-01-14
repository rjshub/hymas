

<template>
    <el-dialog title="CY&amp;FY Rolling Traking"
        class="roll-trake-zoom-in"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="true"
        width="450px"
        @close="handle_close">
        <div class="table-wrap">
            <!-- total  table -->
            <el-table v-if="tableData.total.row && tableData.total.row.length>0"
                :data="tableData.total.row"
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
                <el-table-column :label="tableData.total.header.name"
                    align="center">
                    <el-table-column label="Total"
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
                        {{formatColumnData(tableData.total.header.percent,1,'%')}}
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
            <el-table v-if="tableData.skincare.row && tableData.skincare.row.length>0"
                :data="tableData.skincare.row"
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
                <el-table-column :label="tableData.skincare.header.name"
                    align="center">
                    <el-table-column label="Skincare"
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
                        {{formatColumnData(tableData.skincare.header.percent,1,'%')}}
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
            <el-table v-if="tableData.makeup.row && tableData.makeup.row.length>0"
                :data="tableData.makeup.row"
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
                <el-table-column :label="tableData.makeup.header.name"
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
                        {{formatColumnData(tableData.makeup.header.percent,1,'%')}}
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
            <el-table v-if="tableData.fragrance.row && tableData.fragrance.row.length>0"
                :data="tableData.fragrance.row"
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
                <el-table-column :label="tableData.fragrance.header.name"
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
                        {{formatColumnData(tableData.fragrance.header.percent,1,'%')}}
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
  name: "Roll-Trake-Zoom-In",
  components: {},
  props: {
    tableData: {
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
    formatColumnData(data, decimal = 0, percent_flag = "") {
      if (data === null || data === "" || data === false || data === undefined) {
        return "";
      } else if (data == "-") {
        return "-";
      } else {
        return this.$formatMoney(data, decimal, "") + percent_flag;
      }
    },

    handle_close() {
      this.$emit("close");
    },

    setTableStyle() {
      this.$nextTick(() => {
        let width = jquery(".roll-trake-zoom-in .el-table__body").width();
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
.roll-trake-zoom-in {
  overflow: visible;
  ::v-deep .el-dialog {
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

    .el-dialog__footer {
      display: none;
    }
  }
}
</style>