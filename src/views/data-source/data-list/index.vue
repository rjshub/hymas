<template>
    <div class="data-list">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div class="main">
            <div class="tools">
                <hy-box>
                    <el-button :disabled="isReadOnly || (otherTab.length === 0 && !isELC)"
                        type="primary"
                        size="mini"
                        icon="el-icon-plus"
                        @click="handle_add_data">Add Data</el-button>
                </hy-box>

                <hy-box>
                    <el-select v-model="client"
                        size="mini"
                        filterable
                        placeholder="Select Client"
                        style="width:150px;"
                        @change="handle_change_client">
                        <el-option v-for="(item,index) in clientOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </hy-box>

                <hy-box>
                    <el-button size="mini"
                        :disabled="!hasChecked"
                        title="Download"
                        icon="iconfont mas-download"
                        @click="handle_download"></el-button>
                </hy-box>

                <hy-box>
                    <el-button size="mini"
                        :disabled="isReadOnly || !hasChecked"
                        title="Delete"
                        icon="el-icon-delete"
                        @click="handle_delete"></el-button>
                </hy-box>

            </div>
            <el-tabs v-model="activeName"
                @tab-click="handle_tab_change"
                class="tab-table">
                <el-tab-pane v-if="permissionPerformance && isELC"
                    label="ELC Performance"
                    name="performance">
                    <performance ref="performance"
                        :client="client"
                        @section-change="handle_section_change"></performance>
                </el-tab-pane>
                <el-tab-pane v-if="permissionCompetitorsSpending && isELC"
                    label="ELC&amp;competitors Spending"
                    name="competitors">
                    <competitors ref="competitors"
                        :client="client"
                        @section-change="handle_section_change"></competitors>
                </el-tab-pane>
                <el-tab-pane v-for="(tabItem, index) in otherTab" :key="index" 
                  :label="tabItem.label" :name="tabItem.name">
                  <formatTable :client="client"></formatTable>
                </el-tab-pane>

                <div class="empty-message" v-show="otherTab.length === 0 && !isELC">
                  <span>No Results Found.  {{otherTab.length === 0}}{{isELC}}</span>
                  <span>Please go to " <a @click="toFormatSetting">Format Setting</a> " to create a data source template.</span>
                </div>
            </el-tabs>
        </div>

    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import breadCrumb from "@/components/common/bread-crumb";
import performance from "./performance";
import competitors from "./competitors";
import formatTable from './formatTable'

export default {
  name: "Data-List",
  components: { breadCrumb, performance, competitors, formatTable },

  data() {
    return {
      activeName: "",
      breadCrumbList: [{ path: "/data-source", name: "Data Source" }, { path: "", name: "Data List" }],

      hasChecked: false, //勾选行数
      client: "1", //客户
      clientOptions: [],
      otherTab: [
        // {
        //   label: 'tab1',
        //   name: 'tab1'
        // },
        // {
        //   label: 'tab2',
        //   name: 'tab2'
        // }
      ]
    };
  },
  computed: {
    ...mapGetters("dataSource/dataList", ["permissionPerformance", "permissionCompetitorsSpending"]),

    isReadOnly() {
      if (this.activeName == "performance") {
        if (this.permissionPerformance) {
          return this.permissionPerformance.isRead || false;
        } else {
          return false;
        }
      } else {
        if (this.permissionCompetitorsSpending) {
          return this.permissionCompetitorsSpending.isRead || false;
        } else {
          return false;
        }
      }
    },
    isELC () {
      let state = true
      if (this.clientOptions.length > 0) {
        let index = this.clientOptions.findIndex(obj => {
          return obj.value === this.client
        })
        if (this.clientOptions[index].label === 'ELC') {
          state = true
        } else {
          state = false
        }
      } else {
        state = false
      }
      return state
    }
  },

  methods: {
    ...mapActions("home", ["fetch_filter_list"]),

    toFormatSetting() {
      this.$router.push({path: '/data-source/format-setting'})
    },
    handle_add_data() {
      this.$router.push({
        path: "data-list-add",
        query: { type: this.activeName, client: this.client }
      });
    },
    handle_download() {
      if (this.activeName == "performance") {
        this.$refs.performance.handle_download_batch(null, "batch");
      } else {
        this.$refs.competitors.handle_download_batch(null, "batch");
      }
    },
    handle_delete() {
      if (this.activeName == "performance") {
        this.$refs.performance.handle_delete(null, "batch");
      } else {
        this.$refs.competitors.handle_delete(null, "batch");
      }
    },

    handle_tab_change(item) {
      if (this.activeName == "performance") {
        this.hasChecked = this.$refs.performance.checkedRows.length > 0;
      } else {
        this.hasChecked = this.$refs.competitors.checkedRows.length > 0;
      }
    },

    handle_section_change(ids) {
      this.hasChecked = ids.length > 0;
    },

    handle_change_client(param) {}
  },

  mounted() {
    if (!this.permissionPerformance) {
      this.activeName = this.$route.params.type || "competitors";
    } else {
      this.activeName = this.$route.params.type || "performance";
    }

    this.fetch_filter_list({ type: "client", value: "" })
      .then(res => {
        this.clientOptions = res;
      })
      .catch(err => {});
  }
};
</script>
<style lang="scss" scoped>
.data-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 10px 10px 0 10px;

  .main {
    display: flex;
    flex-direction: column;
    flex: 1;

    .tools {
      margin-bottom: 10px;
      // margin-top: 10px;
    }

    .tab-table {
      display: flex;
      flex-direction: column;
      flex: 1;

      /deep/ .el-tabs__header {
        background-color: #e5e6eb;
        margin: 0;

        .el-tabs__nav {
          .el-tabs__item {
            &#tab-performance {
              width: 170px;
              text-align: center;
            }
            &#tab-competitors {
              width: 230px;
              text-align: center;
            }
          }
        }
      }

      /deep/ .el-tabs__content {
        flex: 1;
        background-color: white;

        .el-tab-pane {
          height: 100%;
        }
      }

      .empty-message {
        width: 100%;
        height: 60px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        span:nth-child(1) {
          font-weight: 700;
          color: #7F7F7F;
        }
        span {
          width: 100%;
          display: block;
          text-align: center;
          a {
            cursor: pointer;
            font-weight: 700;
            text-decoration: underline;
            color: #0000FF;
          }
        }
      }
    }
  }
}
</style>