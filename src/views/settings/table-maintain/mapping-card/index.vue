<template>
    <div class="mapping-card">
        <CardItem v-for="(item,index) in values"
            :key="index"
            :value="item"></CardItem>

        <div class="add-card"
            @click="handle_add_mapping_table">
            <div class="add-icon">
                <i class="el-icon-plus"></i>
            </div>
            <div>
                Add Mapping table
            </div>
        </div>

        <AddMapping v-if="isShowAddMappping"
            @close="isShowAddMappping=false"
            @save="handle_save_mapping"></AddMapping>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import CardItem from "./card-item";
import AddMapping from "./add-mapping";

export default {
  name: "MappingCard",
  components: { CardItem, AddMapping },

  props: {
    values: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      isShowAddMappping: false
    };
  },

  methods: {
    handle_add_mapping_table() {
      this.isShowAddMappping = true;
    },
    handle_save_mapping() {
      this.isShowAddMappping = false;
      this.$emit("refresh");
    }
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