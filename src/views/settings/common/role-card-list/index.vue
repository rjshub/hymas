<template>
    <div class="card-list">
        <card-row v-for="(item,index) in cardData"
            :is-read-only="isReadOnly"
            :key="index+'level1'"
            :values="item"></card-row>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import cardRow from "./card-row";

export default {
  name: "Card-List",
  components: { cardRow },
  componentName: "CardList",
  props: {
    values: {
      type: [Object, Array],
      require: true
    },
    isReadOnly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isSpreadLevelOne: false, //是否全部展开 level -1
      cardData: []
    };
  },
  computed: {},

  watch: {
    values: {
      handler: function(val) {
        if (this.isSpreadLevelOne) {
          this.spreadMore();
        } else {
          this.justShowFour();
        }
      },
      deep: true
    }
  },

  methods: {
    //只展示4个
    justShowFour() {
      if (this.values.length <= 4) {
        //小于4个
        this.cardData = this.values;
      } else {
        //大于4个
        this.cardData = this.values.filter((item, index) => {
          return index < 3;
        });

        this.cardData[this.cardData.length] = { operate: "down" };
        this.isSpreadLevelOne = false;
      }
    },

    //展开更多
    spreadMore() {
      let values = _.cloneDeep(this.values);
      this.cardData = values;
      this.cardData[this.cardData.length] = { operate: "up" };
      this.isSpreadLevelOne = true;
    }
  },

  mounted() {
    this.justShowFour();

    //点击显示更多的事件监听
    this.$on("show-more", () => {
      this.spreadMore();
    });
    this.$on("hide-more", () => {
      this.justShowFour();
    });

    this.$on("edit-card", data => {
      this.$emit("edit", data);
    });
    this.$on("detail-card", data => {
      this.$emit("detail", data);
    });
    this.$on("turn-on-card", data => {
      this.$emit("turn-on", data);
    });
    this.$on("turn-off-card", data => {
      this.$emit("turn-off", data);
    });
    this.$on("add-card", data => {
      this.$emit("add", data);
    });
  },

  destroyed() {
    this.$off("show-more");
    this.$off("hide-more");
    this.$off("edit-card");
    this.$off("detail-card");
    this.$off("turn-on-card");
    this.$off("turn-off-card");
    this.$off("add-card");
  }
};
</script>

<style lang="scss" scoped>
.card-list {
  contain: paint;
}
</style>
