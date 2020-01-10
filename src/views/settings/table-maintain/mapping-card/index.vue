<template>
    <div class="mapping-card">
        <CardItem v-for="(item,index) in values"
            :key="index"
            :value="item"></CardItem>

        <div class="add-card">
            <div class="add-icon">
                <i class="el-icon-plus"></i>
            </div>
            <div>
                Add Mapping table
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import CardItem from "./card-item";

export default {
  name: "MappingCard",
  components: { CardItem },

  props: {
    values: {
      type: Array,
      required: true
    }
  },

  data() {
    return {};
  },

  mounted() {}
};
</script>
<style lang="scss" scoped>
.mapping-card {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-content: flex-start;
  box-sizing: border-box;
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