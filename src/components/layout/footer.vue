<template>
    <div class="footer">
        {{copyright}}
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Footer",
  components: {},

  data() {
    return {};
  },
  computed: {
...mapState("common", ["copyright"])
  },

  mounted() {}
};
</script>
<style lang="scss" scoped>
.footer {
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #adadad;
  font-size: 14px;
}
</style>
