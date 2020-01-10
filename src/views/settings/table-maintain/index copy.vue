<template>
    <div class="table-maintain">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div class="main"
            v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading">
            321321
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import breadCrumb from "@/components/common/bread-crumb";
import fetch from "@/services/fetch";
export default {
  name: "Table-maintain",
  components: { breadCrumb },

  data() {
    return {
      isLoading: false,
      breadCrumbList: [{ path: "/settings", name: "Settings" }, { path: "", name: "Table Maintenance" }]
    };
  },
  computed: {},

  methods: {},

  mounted() {}
};
</script>
<style lang="scss" scoped>
.table-maintain {
  flex: 1;
  display: flex;
  flex-direction: column;
  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: auto;
  }
}
</style>