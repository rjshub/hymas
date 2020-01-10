<template>
    <div class="card"
        :class="{active: isActive}"
        :style="{'background-color':color}"
        @click="handle_click_card">
        <div class="label">{{value.name}}</div>
        <div class="value">{{value.value}}</div>

        <div v-if="status!='view'"
            class="close-btn"
            @click.stop="handle_close_card">
            <i class="el-icon-delete-solid"></i>
        </div>
    </div>
</template> 
   
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";

export default {
  name: "Card",
  components: {},

  props: {
    value: {
      type: [Object, Array],
      required: false
    },
    color: {
      type: String
    },
    activeId: {
      type: [String, Number]
    },
    status: {
      type: [String, Number]
    }
  },

  data() {
    return {
      number: "Welcome to Your Vue.js App"
    };
  },

  computed: {
    isActive() {
      return this.value.id == this.activeId;
    }
  },

  watch: {
    value: {
      handler: function(val) {},
      deep: true
    }
  },

  methods: {
    handle_close_card() {
      this.$emit("delete", this.value.id);
    },

    handle_click_card() {
      this.$emit("click", this.value.id);
    }
  },

  created() {},
  mounted() {}
};
</script> 
  
<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;

  .label {
    font-size: 15px;
    color: white;
    margin: 5px;
  }

  .value {
    font-size: 20px;
    color: white;
    font-weight: bold;
  }

  .close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      cursor: pointer !important;
    }

    i {
      font-size: 18px;
      color: gray;
    }
  }
}
</style> 