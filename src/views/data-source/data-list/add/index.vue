<template>
    <div class="data-list-add">
        <bread-crumb :values="breadCrumbList"></bread-crumb>
        <div class="main">
            <div class="position_center">
                <div class="performance-area"
                    v-if="permissionPerformance">
                    <div class="performance"
                        v-if="uploadType=='performance'"
                        @click="change_to_performance">
                        <div class="upload">
                            <div class="title">ELC Performance</div>
                            <div class="btn">
                                <el-upload class="upload-demo"
                                    size="mini"
                                    :disabled="disabledUploadBtn"
                                    ref="performanceUpload"
                                    action="/source/performance_upload"
                                    :data="{client_id: $route.query.client}"
                                    :on-progress='handleProgress'
                                    :before-upload="handleBeforeUpload"
                                    :on-success="handleSuccess"
                                    :on-error="handleError"
                                    :http-request="$uploadHttpRequest"
                                    :file-list="fileList">
                                    <el-button size="small"
                                        :disabled="isReadOnlyPerformance"
                                        type="primary">{{isUploaded?'Re-Upload':'Upload'}}</el-button>
                                </el-upload>
                            </div>
                        </div>
                        <div class="detail"
                            v-if="isUploaded">
                            <!-- <div class="client">
                            <span class="title">Client:</span>
                            <span class="text2">{{fileData.client}}</span>
                        </div> -->
                            <div class="campaign-name">
                                <span class="title">Campaign Name:</span>
                                <div class="text1">{{fileData.campaign}}</div>
                            </div>
                            <div class="cycle">
                                <span class="title">Cycle:</span>
                                <span class="text2">{{fileData.cycle}}</span>
                            </div>
                            <div class="name">
                                <span class="title">Name:</span>
                                <span class="text2">{{fileData.name}}</span>
                            </div>
                            <div class="btn">
                                <el-button v-if="isCovered"
                                    type="primary"
                                    size="mini"
                                    @click.stop="handle_save">Save</el-button>
                                <el-button size="mini"
                                    @click.stop="handle_cancel">Cancel</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="performance-show"
                        v-else
                        @click="change_to_performance">
                        ELC Performance
                    </div>
                </div>

                <div class="competitors-area"
                    v-if="permissionCompetitorsSpending">
                    <div class="competitors"
                        v-if="uploadType=='competitors'"
                        @click="change_to_competitors">
                        <div class="upload">
                            <div class="title">ELC&amp;Competitors Spending</div>
                            <div class="btn">
                                <el-upload class="upload-demo"
                                    :disabled="disabledUploadBtn"
                                    size="mini"
                                    ref="spendingUpload"
                                    action="/source/competitors_spending_upload"
                                    :data="{client_id: $route.query.client}"
                                    :on-progress='handleProgress'
                                    :before-upload="handleBeforeUpload"
                                    :on-success="handleSuccess"
                                    :on-error="handleError"
                                    :http-request="$uploadHttpRequest"
                                    :file-list="fileList">
                                    <el-button size="small"
                                        :disabled="isReadOnlyCompetitorsSpending"
                                        type="primary">{{isUploaded?'Re-Upload':'Upload'}}</el-button>

                                </el-upload>
                            </div>
                            <el-tooltip class="tips"
                                effect="dark"
                                content="Please upload datasheet by year"
                                placement="top-start">
                                <i class="iconfont mas-question-circle"></i>
                            </el-tooltip>
                        </div>
                        <div class="detail"
                            v-if="isUploaded">
                            <div class="client">
                                <span class="title">Client:</span>
                                <span class="text2">{{fileData.client}}</span>
                            </div>

                            <div class="cycle">
                                <span class="title">Year:</span>
                                <span class="text2">{{fileData.year}}</span>
                            </div>
                            <div class="quarter">
                                <span class="title">Quarter:</span>
                                <span class="text2">
                                    <el-select size="mini"
                                        style="width:90px;"
                                        v-model="fileData.quarter"
                                        filterable
                                        @change="handle_quarter_change"
                                        placeholder="Quarter">
                                        <el-option v-for="(item,index) in quarterOptions"
                                            :key="index"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                    ({{quarterInfo||"Select Quarter"}})
                                </span>
                            </div>
                            <div class="name">
                                <span class="title">Name:</span>
                                <span class="text2">{{fileData.name}}</span>
                            </div>
                            <div class="btn">
                                <el-button v-if="isCovered"
                                    type="primary"
                                    size="mini"
                                    @click.stop="handle_save">Save</el-button>
                                <el-button size="mini"
                                    @click.stop="handle_cancel">Cancel</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="competitors-show"
                        v-else
                        @click="change_to_competitors">
                        <div class="text">ELC&amp;Competitors Spending</div>

                        <el-tooltip class="tips"
                            effect="dark"
                            content="Please upload datasheet by year"
                            placement="top-start">
                            <i class="iconfont mas-question-circle"></i>
                        </el-tooltip>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import breadCrumb from "@/components/common/bread-crumb";
import fetch from "@/services/fetch";
export default {
  name: "Data-List-Add",
  components: { breadCrumb },

  data() {
    return {
      breadCrumbList: [
        { path: "/data-source/data-list", name: "Data Source" },
        { path: "/data-source/data-list", name: "Data List" },
        { path: "", name: "Add Source Data" }
      ],

      uploadType: "",
      isUploaded: false,

      isCovered: false,
      quarterOptions: [],
      quarterInfo: "", //选择对应的季度后，在后面显示对应的财年

      cacheUploadRes: {},

      fileData: { client: "", name: "", campaign: "", cycle: "", year: "", quarter: "" },
      timer: null,
      disabledUploadBtn: false,

      fileList: [],
      clientOptions: []
    };
  },
  computed: {
    ...mapGetters("dataSource/dataList", ["permissionPerformance", "permissionCompetitorsSpending"]),

    isReadOnlyPerformance() {
      if (this.permissionPerformance) {
        return this.permissionPerformance.isRead || false;
      } else {
        return false;
      }
    },

    isReadOnlyCompetitorsSpending() {
      if (this.permissionCompetitorsSpending) {
        return this.permissionCompetitorsSpending.isRead || false;
      } else {
        return false;
      }
    }
  },

  methods: {
    ...mapActions("dataSource/dataList", ["fetch_save_source_data", "fetch_quarter_info_source_data"]),
    ...mapActions("home", ["fetch_filter_list"]),

    handleBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        if (file.type != "application/vnd.ms-excel" && file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          this.$message.warning({
            message: "The uploaded file must be in xls format."
          });
          reject();
        }

        if (!this.isUploaded) {
          resolve();
        } else {
          this.$confirm("Are you sure to re-upload the content?", "Tips", {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            closeOnClickModal: false,
            type: "warning",
            callback: action => {
              if (action == "confirm") {
                resolve();
              } else {
                reject();
              }
            }
          });
        }
      });
    },
    handleProgress(progress) {
      this.disabledUploadBtn = true;
    },

    handleSuccess(response, file, fileList) {
      this.disabledUploadBtn = false;

      this.fileList = [{ name: response.name, url: response.path }];
      this.cacheUploadRes = { ...response };

      if (this.uploadType != "performance") {
        this.quarterOptions = response.quarter.map(item => {
          return { id: item, name: item };
        });
      }

      if (response.isexist == 1) {
        this.$confirm("Duplicate data be found. Do you want it to be covered?", "Tips", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
          closeOnClickModal: false,
          type: "warning",
          callback: action => {
            if (action == "confirm") {
              this.isCovered = true;

              this.$message.success("Uploaded successfully");
            }
            if (action == "cancel") {
              this.isCovered = false;
            }
          }
        });
      } else {
        this.isCovered = true;
        this.$message.success("Uploaded successfully");
      }

      let client_name = this.clientOptions.find(item => {
        return item.value == this.$route.query.client;
      }).label;

      this.updateInfo({ ...response, client: client_name });
    },

    handleError(err, file, fileList) {
      this.disabledUploadBtn = false;
      this.$message.error(err.message);
    },

    handle_quarter_change() {
      this.fetch_quarter_info_source_data({ year: this.fileData.year, quarter: this.fileData.quarter }).then(res => {
        this.quarterInfo = "FY " + res.data.year + " " + res.data.quarter;
      });
    },

    updateInfo(data) {
      this.isUploaded = true;

      this.fileData.client = data.client;
      this.fileData.name = data.name;
      this.fileData.campaign = data.campaign;
      this.fileData.cycle = data.cycle;
      this.fileData.year = data.year;
    },

    handle_save() {
      let url = "";
      let params = {};
      if (this.uploadType == "performance") {
        url = "/source/performance_save";
        params = {
          ...this.cacheUploadRes,
          isCovered: this.isCovered,
          brand_id: this.cacheUploadRes.brand,
          product_id: this.cacheUploadRes.product,
          client_id: this.$route.query.client
        };
      } else {
        url = "/source/competitors_spending_save";

        if (!this.fileData.quarter) {
          this.$message.warning("Please Select Quarter");
          return;
        }
        params = { ...this.cacheUploadRes, isCovered: this.isCovered, quarter: this.fileData.quarter, client_id: this.$route.query.client };
      }

      this.fetch_save_source_data({
        url,
        params: params
      })
        .then(res => {
          this.$router.push({
            name: "dataList",
            params: { type: this.uploadType }
          });
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },

    handle_cancel() {
      this.$router.push({
        name: "dataList",
        params: { type: this.uploadType }
      });
    },

    change_to_competitors() {
      if (this.$route.query.type == "performance" && this.disabledUploadBtn) {
        this.$message.warning("Uploading, no switch allowed");
        return;
      }
      this.$router.push({
        path: "data-list-add",
        query: { ...this.$route.query, type: "competitors" }
      });
    },
    change_to_performance() {
      if (this.$route.query.type == "competitors" && this.disabledUploadBtn) {
        this.$message.warning("Uploading, no switch allowed");
        return;
      }

      this.$router.push({
        path: "data-list-add",
        query: { ...this.$route.query, type: "performance" }
      });
    },

    reset() {
      this.uploadType = "";
      this.isUploaded = false;
      this.isCovered = false;
      this.cacheUploadRes = {};
      this.fileData = { name: "", campaign: "", cycle: "", year: "", quarter: "" };
    }
  },

  mounted() {
    this.uploadType = this.$route.query.type;

    this.fetch_filter_list({ type: "client", value: "" })
      .then(res => {
        this.clientOptions = res;
      })
      .catch(err => {
        this.$message.err(err.message);
      });
  },

  beforeRouteUpdate(to, from, next) {
    this.reset();
    this.uploadType = to.query.type;
    next();
  }
};
</script>
<style lang="scss" scoped>
.data-list-add {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 10px 10px 0 10px;

  .main {
    position: relative;
    display: flex;
    flex: 1;
    justify-content: center;
    // padding-top: 100px;

    .position_center {
      position: absolute;
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%);
      display: flex;

      .performance,
      .performance-show {
        display: inline-block;
        width: 400px;
        margin-right: 20px;
        border-radius: 10px;
        background-color: #ffffff;

        &:hover {
          box-shadow: 0 0 14px 0px #cecece;
        }
      }

      .performance-show {
        height: 200px;
        line-height: 200px;
        text-align: center;
        font-size: 25px;
        font-weight: bold;
        color: #333333;
      }

      .competitors,
      .competitors-show {
        display: inline-block;
        width: 400px;
        background-color: #ffffff;
        border-radius: 10px;

        &:hover {
          box-shadow: 0 0 14px 0px #cecece;
        }
      }

      .competitors-show {
        position: relative;
        height: 200px;

        .text {
          height: 100%;
          line-height: 200px;
          text-align: center;
          font-size: 25px;
          font-weight: bold;
          color: #333333;
        }
      }

      .upload {
        position: relative;
        width: 100%;
        height: 200px;
        background-color: transparent;

        .title {
          height: 100px;
          line-height: 100px;
          text-align: center;
          font-size: 25px;
          font-weight: bold;
          color: #333333;
        }

        .name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 20px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-weight: bold;
          color: #333333;
        }

        .btn {
          text-align: center;
        }
      }
      .detail {
        box-sizing: border-box;
        padding: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 210px;
        background-color: #768696;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;

        .title {
          font-size: 12px;
          color: white;
          margin-right: 10px;
        }

        .quarter {
          ::v-deep .el-select {
            .el-input__inner {
              background-color: transparent;
              border: 0;
              padding-left: 10px;
              color: white;
            }
          }
        }

        .text1 {
          font-size: 20px;
          color: white;
        }
        .text2 {
          font-size: 13px;
          color: white;
        }
      }

      .tips {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 18px;
        color: gray;
      }
    }
  }
}
</style>