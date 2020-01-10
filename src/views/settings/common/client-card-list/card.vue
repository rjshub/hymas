<template>
    <div class="card">
        <div class="level-1-warp">
            <level-first :values="values"
                :is-read-only="isReadOnly"></level-first>
        </div>
        <div class="level-2-wrap"
            ref="level2Ref">
            <card-row v-for="(item,index) in cardData"
                :is-read-only="isReadOnly"
                :key="index+'level2'"
                :values="item"></card-row>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import levelFirst from "./level-first";
import cardRow from "./card-row";

export default {
  name: "Card",
  components: { levelFirst, cardRow },
  componentName: "Card",
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
      isSpreadLevelSecond: false, //是否全部展开 level -1
      cardData: []
    };
  },

  watch: {
    values: {
      handler: function(val) {
        if (this.isSpreadLevelSecond) {
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
      if (this.values.operate == undefined) {
        if (this.values.children && this.values.children.length > 0) {
          if (this.values.children.length <= 4) {
            //小于4个
            this.cardData = this.values.children;
          } else {
            //大于4个
            this.cardData = this.values.children.filter((item, index) => {
              return index < 3;
            });

            this.cardData[this.cardData.length] = { operate: "down" };
            this.isSpreadLevelSecond = false;

            // this.$forceUpdate();
          }
        } else {
          if (!this.isReadOnly) {
            this.cardData = [{ operate: "add", id: this.values.id }];
          }
        }
      } else {
        this.cardData = [];
      }
    },

    //展开更多
    spreadMore() {
      if (this.values.operate == undefined) {
        if (this.values.children && this.values.children.length > 0) {
          let values = _.cloneDeep(this.values);
          this.cardData = values.children;
          this.cardData[this.cardData.length] = { operate: "up" };
          this.isSpreadLevelSecond = true;
          this.$forceUpdate();
        } else {
          if (!this.isReadOnly) {
            this.cardData = [{ operate: "add", id: this.values.id }];
          }
        }
      }else{
        this.cardData = [];
      }
    }
  },

  mounted() {
    this.justShowFour();

    //点击显示更多的事件监听
    this.$on("show-card-more", () => {
      this.spreadMore();
    });
    this.$on("hide-card-more", () => {
      this.justShowFour();
    });
  },
  destroyed() {
    this.$off("show-card-more");
    this.$off("hide-card-more");
  }
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;

  .level-2-wrap {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    flex: 1;
  }
}
</style>