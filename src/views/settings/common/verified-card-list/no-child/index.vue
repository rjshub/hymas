<template>
    <div class="Card-List">
        <div ref="level2Ref"
            class="level-2-wrap">
            <level-first v-for="(item,index) in cardData"
                :key="index+'level2'"
                :is-read-only="isReadOnly"
                :values="item"></level-first>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import levelFirst from "./level-first";

export default {
  name: "Card-List",
  componentName: "CardList",
  components: { levelFirst },
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
      isSpreadLevelTwo: false, ////是否全部展开 level -2
      cardData: []
    };
  },
  computed: {},

  watch: {
    values: {
      handler: function(val) {
        if (this.isSpreadLevelTwo) {
          this.spreadMore();
        } else {
          this.justOneLine();
        }
      },
      deep: true
    }
  },

  methods: {
    justOneLine() {
      if (this.values.operate == undefined) {
        //表示不是展开，合并标识的那一项
        if (this.values && this.values.length > 0) {
          if (this.getNum() > this.values.length) {
            //一行可以完全放下cards
            this.cardData = _.cloneDeep(this.values);
          } else {
            //一行放不下
            let num = this.getNum();
            this.cardData = this.values.filter((item, index) => {
              return index < num;
            });

            this.cardData[this.cardData.length - 1] = { ...this.cardData[this.cardData.length - 1], operate: "down" }; //给一行的最末位设置 展开标识
            this.isSpreadLevelTwo = false;
          }
        } else {
          this.cardData = [];
        }
      } else {
        this.cardData = [];
      }
    },

    getNum() {
      let level2Width = jquery(this.$refs.level2Ref).width();

      if (!this.isReadOnly) {
        return Math.floor(level2Width / 210);
      } else {
        return Math.floor(level2Width / 210);
      }
    },

    /**
     * 展开，显示更多
     */
    spreadMore() {
      if (this.values.operate == undefined) {
        if (this.values && this.values.length > 0) {
          let values = _.cloneDeep(this.values);
          this.cardData = values;

          this.cardData[this.cardData.length] = { operate: "up" };
          this.isSpreadLevelTwo = true;
        } else {
          if (!this.isReadOnly) {
            this.cardData = [];
          }
        }
      } else {
        this.cardData = [];
      }
    }
  },

  mounted() {
    //点击显示更多的事件监听
    this.$on("show-item-more", () => {
      this.spreadMore();
    });
    this.$on("hide-item-more", () => {
      this.justOneLine();
    });

    this.$on("delete-card", data => {
      this.$emit("delete", data);
    });

    this.$detectDomResize(this.$refs.level2Ref, element => {
      if (!this.isSpreadLevelTwo) {
        this.justOneLine();
      }
    });

    this.justOneLine();
  },
  destroyed() {
    this.$off("show-item-more");
    this.$off("hide-item-more");
    this.$off("delete-card");
  }
};
</script>

<style lang="scss" scoped>
.Card-List {
  display: flex;

  .level-2-wrap {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
  }
}
</style>
