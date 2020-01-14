<template>
    <div class="spd-detail">
        <bread-crumb :values="breadCrumbList"></bread-crumb>
        <div class="main">
            <div class="info">
                <div class="name">{{info.name}}</div>
                <div class="cycle-unit">
                    <span>Cycle: {{info.cycle.begin}}~{{info.cycle.end}}</span>
                    <span><i class="iconfont mas-earth"></i> {{formatPermission(info.permission)}}</span>
                    <span>Unit: RMB(&apos;{{getUnit}})</span>
                </div>
            </div>
            <el-tabs v-model="activeName"
                type="border-card"
                class="tab-table"
                @tab-click="handleClick">
                <el-tab-pane label="CY&amp;FY Rolling Traking"
                    name="rollTraking">
                    <roll-traking></roll-traking>
                </el-tab-pane>
                <el-tab-pane label="Competitor SPD"
                    name="competitor">
                    <competitor></competitor>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import breadCrumb from "@/components/common/bread-crumb";
import fetch from "@/services/fetch";
import rollTraking from "./roll-traking";
import competitor from "./competitor";
export default {
  name: "SPD-Detail",
  components: { breadCrumb, rollTraking, competitor },

  data() {
    return {
      breadCrumbList: [
        { path: "/report-center/custom-report", name: "Report Center" },
        { path: "/report-center/custom-report", name: "Custom Report" },
        { path: "", name: "SPD Report" }
      ],
      activeName: "rollTraking",

      info: {
        name: "",
        cycle: {},
        permission: 0
      }
    };
  },

  computed: {
    getUnit() {
      if (this.activeName == "rollTraking") {
        return "Mil";
      } else {
        return "000";
      }
    }
  },

  methods: {
    handleClick(tab, event) {},
    formatPermission(value) {
      if (value == 0) {
        return "Public";
      }
      if (value == 1) {
        return "No Public";
      }
      if (value == 2) {
        return "Private";
      }
    }
  },

  mounted() {
    this.info = this.$route.query;
  }
};
</script>
<style lang="scss" scoped>
.spd-detail {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 10px 10px 0 10px;

  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: auto;

    .info {
      display: flex;
      flex-direction: column;
      height: 100px;
      box-sizing: border-box;
      margin-bottom: 10px;
      padding: 15px;
      background-color: #ffffff;

      .name {
        display: flex;
        align-items: flex-end;
        flex: 1;
        font-size: 24px;
        color: #333333;
        font-weight: bold;
      }

      .cycle-unit {
        font-size: 12px;
        color: #666666;
        line-height: 30px;
        height: 30px;

        span {
          margin-right: 50px;
        }
      }
    }

    .tab-table {
      display: flex;
      flex-direction: column;
      flex: 1;

      ::v-deep .el-tabs__header {
        background-color: #e5e6eb;
        margin: 0;

        .el-tabs__nav {
          .el-tabs__item {
            &#tab-rollTraking {
              width: 200px;
              text-align: center;
            }
            &#tab-competitor {
              width: 160px;
              text-align: center;
            }
          }
        }
      }

      ::v-deep .el-tabs__content {
        flex: 1;
        background-color: white;

        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
}
</style>