<template>
    <div class="add-report">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading"
            class="main">

            <el-tabs v-model="activeName"
                type="border-card"
                @tab-remove="handle_remove_tab">

                <el-tab-pane v-for="(item) in editableTabs"
                    :key="item.name"
                    :label="item.title"
                    :disabled="item.disabled"
                    :name="item.name"
                    :closable="item.closable">
                    <template v-if="item.name=='configuration'">
                        <add-step @preview="handle_add_tab"></add-step>
                    </template>

                    <template v-else>
                        <preview :values="previewValues"></preview>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import breadCrumb from "@/components/common/bread-crumb";
import fetch from "@/services/fetch";

import addStep from "./add-step";
import preview from "./preview/index";
export default {
  name: "AddReport",
  components: { breadCrumb, addStep, preview },

  data() {
    return {
      isLoading: false,
      breadCrumbList: [],

      activeName: "configuration",
      tabIndex: 1,
      editableTabs: [
        {
          title: "Configuration",
          name: "configuration",
          closable: false,
          disabled: false
        }
      ],
      previewValues: {}
    };
  },
  computed: {},

  methods: {
    handle_add_tab(data) {
      let index = this.editableTabs.length + 1 - this.tabIndex;

      this.editableTabs.push({
        title: "Preview" + index,
        name: "preview_" + index,
        closable: true
      });
      this.activeName = "preview_" + index;
      this.previewValues = data;
    },

    handle_remove_tab(targetName) {
      this.editableTabs = this.editableTabs.filter(item => {
        return item.name != targetName;
      });

      this.activeName = "configuration";
    }
  },

  mounted() {
    let query = this.$route.query;
    if (query.type == "add") {
      this.breadCrumbList = [
        { path: "/report-center/custom-report", name: "Report Center" },
        { path: "/report-center/custom-report", name: "Custom Report" },
        { path: "", name: "Add Report" }
      ];
    }

    if (query.type == "edit") {
      this.breadCrumbList = [
        { path: "/report-center/custom-report", name: "Report Center" },
        { path: "/report-center/custom-report", name: "Custom Report" },
        { path: "", name: query.name }
      ];
    }
  }
};
</script>
<style lang="scss" scoped>
.add-report {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 10px 10px 0 10px;

  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: auto;
    background-color: white;

    ::v-deep .el-tabs {
      display: flex;
      flex-direction: column;
      flex: 1;

      .el-tabs__header {
        background-color: #e5e6eb;
        margin-bottom: 0;

        .el-tabs__nav {
          .el-tabs__item {
            &#tab-configuration {
              // width: 130px;
              text-align: center;
            }
          }
          // div[id^="tab-preview"] {
          //   width: 100px;
          //   text-align: center;
          // }
        }
      }
      .el-tabs__content {
        display: flex;
        flex: 1;
        overflow: auto;
        padding: 10px;

        .el-tab-pane {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
      }
    }
  }
}
</style>