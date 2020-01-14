<template>
  <div class="popover-container">
    <el-popover
      placement="left"
      width="140"
      v-model="visible"
      popper-class="operate-popver"
      trigger="click"
    >
      <div class="popver-item" @click="handle_download_format(data.number)">
        <i class="iconfont mas-download" style="margin-right: 20px"></i>
        <span>Download</span>
      </div>
      <div class="popver-item" @click="handle_edit_format(data.number)">
        <i class="iconfont mas-edit" style="margin-right: 20px"></i>
        <span>Edit</span>
      </div>
      <div
        class="popver-item"
        v-show="data.status === 1"
        @click="handle_turn_off_format(data.number)"
      >
        <i class="iconfont mas-pause" style="margin-right: 20px"></i>
        <span>Turn Off</span>
      </div>
      <div
        class="popver-item"
        v-show="data.status === 0"
        @click="handle_turn_on_format(data.number)"
      >
        <i class="iconfont mas-open" style="margin-right: 20px"></i>
        <span>Turn On</span>
      </div>
      <span slot="reference" class="iconfont mas-more1-vertical"></span>
    </el-popover>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["data"],
  data() {
    return {
      visible: false
    };
  },
  methods: {
    handle_download_format(id) {
      console.log("download");
      this.popover_close();
    },
    handle_edit_format(id) {
      console.log("edit");
      this.$router.push({ path: "create" });
      this.popover_close();
    },
    handle_turn_off_format(id) {
      console.log("turn off");
      this.popover_close();
    },
    handle_turn_on_format(id) {
      console.log("turn on");
      this.popover_close();
    },
    popover_close() {
      this.visible = false;
    }
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
.popover-container {
}
</style>