<template>
    <el-dialog title="Add Mapping table"
        class="add-mapping"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="true"
        width="500px"
        @close="handle_close">
        <div class="upload-area">
            <el-upload ref="performanceUpload"
                class="upload-demo"
                size="mini"
                action="/source/performance_upload"
                :on-progress="handleProgress"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
                :on-error="handleError"
                :http-request="$uploadHttpRequest"
                :file-list="fileList">
                <el-button size="small"
                    type="primary">{{isUploaded?'Re-Upload':'Upload'}}</el-button>
            </el-upload>
        </div>

        <template v-slot:footer>
            <span class="dialog-footer">
                <el-button size="mini"
                    @click="handle_close">Cancel</el-button>
                <el-button size="mini"
                    type="primary"
                    @click="handle_submit">Save</el-button>
            </span>
        </template>
    </el-dialog>
</template> 
   
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";

export default {
  name: "AddMapping",
  components: {},

  /* 在组件设置 v-model时修改默认value和input */

  model: {
    prop: "checked", //注意当自定义v-mode的prop后，在下面 props中还要显式声明 类型等
    event: "change"
  },

  props: {
    //如果id存在，则表示对已经上传成功的重新上传
    id: {
      type: [Number, String],
      required: false,
      default: ""
    }
  },

  data() {
    return {
      disabledUploadBtn: false,
      isUploaded: false,
      isCovered: false,
      fileList: [],

      form: {}
    };
  },

  //   watch: {
  //     msg() {
  //       console.log("msg is changed");
  //     },
  //     values: {
  //       handler: function(val) {},
  //       deep: true
  //     }
  //   },

  mounted() {},

  methods: {
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
      console.log("31");
    },

    handleSuccess(response, file, fileList) {
      this.disabledUploadBtn = false;
      this.isUploaded = true;

      this.fileList = [{ name: response.name, url: response.path }];

      this.form = { ...response };

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
    },

    handleError(err, file, fileList) {
      this.disabledUploadBtn = false;
      this.$message.error(err.message);
    },

    handle_close() {
      this.$emit("close");
    },
    async handle_submit() {
      if (this.fileList.length == 0) {
        this.$message.warning("You haven't uploaded the file yet.");
        return;
      }

      try {
        await fetch.post("/maintenance/mapping_table_add", { params: this.form, id: this.id });
        this.$emit("save");
      } catch (err) {
        this.$message.error(err.message);
      }
    }
  }
};
</script> 
  
<style lang="scss" scoped>
.add-mapping {
  ::v-deep .el-dialog__body {
    display: flex;
    height: 80px;

    .upload-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .upload-demo {
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style> 