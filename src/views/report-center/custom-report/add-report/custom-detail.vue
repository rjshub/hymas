<template>
    <div class="custom-detail">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div class="main">
            <detail></detail>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import breadCrumb from "@/components/common/bread-crumb";
import fetch from "@/services/fetch";

import detail from "./detail/index";
export default {
  name: "Custom-Detail",
  components: { breadCrumb, detail },

  data() {
    return {
      isLoading: false,
      breadCrumbList: [
        { path: "/report-center/custom-report", name: "Report Center" },
        { path: "/report-center/custom-report", name: "Custom Report" },
        { path: "", name: "Detail" }
      ]
    };
  },
  computed: {},

  methods: {},

  mounted() {}
};
</script>
<style lang="scss" scoped>
.custom-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: auto;
    background-color: white;
    padding: 10px;
  }
}
</style>