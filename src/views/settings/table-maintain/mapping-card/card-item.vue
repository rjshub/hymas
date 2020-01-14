<template>
    <div class="card-item">
        <div class="info">
            <div class="time">{{value.serial}}</div>
            <div v-hover
                class="text">
                <span>{{value.name}}</span>
            </div>
            <div class="time">Updated on {{value.update_time}}</div>
        </div>
        <span class="more">
            <el-popover v-model="popver"
                placement="right"
                width="100"
                popper-class="operate-popver"
                trigger="click">
                <div>
                    <div class="popver-item"
                        @click="handle_edit(value)">
                        <i class="iconfont mas-edit"></i> Edit
                    </div>
                    <div class="popver-item"
                        @click="handle_download(value)">
                        <i class="iconfont mas-download"></i> Download
                    </div>
                    <div class="popver-item"
                        @click="handle_upload(value)">
                        <span><i class="iconfont mas-upload"></i> Upload</span>
                        <el-upload ref="upload"
                            :action="value.upload_url"
                            :data="{id: value.id}"
                            :show-file-list="false"
                            :before-upload="handleBeforeUpload"
                            :on-success="handleSuccess(value)"
                            :on-error="handleError"
                            :http-request="$uploadHttpRequest">
                        </el-upload>
                    </div>
                </div>

                <i slot="reference"
                    class="iconfont mas-more1-vertical"></i>
            </el-popover>
        </span>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "CardItem",
  components: {},

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      popver: false
    };
  },
  computed: {},

  methods: {
    ...mapActions("settings", ["fetch_code_table_download"]),
    handleBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        if (file.type != "application/vnd.ms-excel" && file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          //xls 和 xlsx
          this.$message.warning({
            message: "The uploaded file must be in xls format."
          });
          reject();
        } else {
          resolve();
        }
      });
    },

    handleSuccess(value) {
      return function(response) {
        //  todo  更改 value的值
        this.$message.success("Uploaded successfully.");
      };
    },

    handleError(err, file, fileList) {
      this.$message.error(err.message);
    },

    handle_download(item) {
      this.popver = false;
      this.$downloadFile({ url: item.download_url });
    },

    /**通过这个触发的目的是为了在点击 upload的同时，直接将popper隐藏掉。而在el-upload中 的trigger中触发 upload时，不能绑定其他事件，让popper消失 */
    handle_upload(item) {
      this.popver = false;

      //模拟点击el-upload内部的 input type=file
      jquery(this.$refs["upload"].$el)
        .find("input")[0]
        .click();
    },
    handle_edit(item) {
      this.$router.push({
        path: "table-maintain/mapping-edit",
        query: { id: item.id, name: item.name, update_time: item.update_time, upload_url: item.upload_url, download_url: item.download_url }
      });
    }
  },

  mounted() {}
};
</script>
<style lang="scss" scoped>
.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  width: 250px;
  height: 120px;
  box-sizing: border-box;
  background-color: #768696;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 10px;

  .info {
    display: flex;
    flex: 1;
    flex-direction: column;
    box-sizing: border-box;
    justify-content: space-around;
    height: 100%;
    background-color: #768696;

    .text {
      font-size: 27px;
      color: white;
      margin-bottom: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .time {
      font-size: 12px;
      color: white;
    }
  }

  .more {
    align-self: flex-start;
    cursor: pointer;
    color: white;
  }
}
</style>