<template>
    <div v-if="!$isObjectNull(value)"
        class="verified-card">

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
                width="120"
                popper-class="operate-popver"
                trigger="click">
                <div>
                    <div v-if="!isTableMaintanceReadable && value.isEdit"
                        class="popver-item"
                        @click="handle_edit(value)">
                        <i class="iconfont mas-edit"></i> Edit
                    </div>
                    <div class="popver-item"
                        @click="handle_download(value)">
                        <i class="iconfont mas-download"></i> Download
                    </div>
                </div>

                <i slot="reference"
                    class="iconfont mas-more1-vertical"></i>
            </el-popover>
        </span>
    </div>
    <div v-else
        class="add-card">
        <div class="add-icon">
            <i class="el-icon-plus"></i>
        </div>
        <div>
            Add Verified Fields
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "VerifiedCard",
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
  computed: {
    ...mapGetters("settings", ["isTableMaintanceReadable"])
  },

  methods: {
    ...mapActions("settings", ["fetch_code_table_download"]),

    handle_download(item) {
      this.popver = false;
      this.$downloadFile({ url: item.download_url });
    },

    handle_edit(item) {
      this.$router.push({
        path: "table-maintain/verified-edit",
        query: { id: item.id, name: item.name, update_time: item.update_time, download_url: item.download_url }
      });
    }
  },

  mounted() {}
};
</script>
<style lang="scss" scoped>
.verified-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  width: 250px;
  height: 120px;
  box-sizing: border-box;
  background-color: #768696;
  border-radius: 5px;

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

.add-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  width: 250px;
  height: 120px;
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  color: #909399;
  cursor: pointer;

  .add-icon {
    i {
      font-size: 30px;
      color: #909399;
    }
  }
}
</style>