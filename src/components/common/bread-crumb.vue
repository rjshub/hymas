

<template>
    <div class="breadcrumb">
        <div class="prefix"></div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <template v-for="(item,index) in values">
                <el-breadcrumb-item v-if="item.path"
                    :key="index"
                    :to="{ path: item.path }">{{item.name}}</el-breadcrumb-item>
                <el-breadcrumb-item v-else
                    :key="index+'kong'">{{item.name}}</el-breadcrumb-item>
            </template>
        </el-breadcrumb>
    </div>

</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
export default {
  name: "Bread-Crumb",
  components: {},
  props: {
    values: {
      type: [Object, Array],
      required: true
    }
  },

  // watch: {
  //   values: {
  //     handler: function(val) {
  //       //TODO
  //     },
  //     deep: true, //监听深度层次的数据结构
  //   }
  // },

  data() {
    return {};
  },
  computed: {},

  mounted() {}
};
</script>
<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .prefix {
    background-color: #04407c;
    width: 2px;
    height: 15px;
    margin-right: 10px;
  }
}
</style>
