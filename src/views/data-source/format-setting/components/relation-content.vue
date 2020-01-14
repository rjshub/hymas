<template>
  <div class="relation-item">
    <el-input 
      style="width: 150px;margin-right: 15px" 
      :class="relation_vilidate? '':'error-relation'"
      v-model="data.label" 
      clearable 
      placeholder="Name" 
      @blur="handle_blur">
    </el-input>
    <el-input
      style="width:330px;"
      v-model="data.value"
      clearable
      :class="relation_vilidate? '':'error-relation'"
      placeholder="linkage relation eg: A>B>C"
      @blur="handle_blur"
      @clear="clear_relation"
    ></el-input>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  components: {},
  props: ["data"],
  data() {
    return {
      relation_vilidate: true
    };
  },
  watch: {
    data(val) {
      this.relation_vilidate = true;
    }
  },
  computed: {
    ...mapState("dataSource/formatSetting", ["form_fields_list"])
  },
  methods: {
    handle_blur() {
      if (this.validate()) {
        this.relation_vilidate = true;
        let tmpRelation = this.data.value.split(">");
        let result = [];
        tmpRelation.forEach(item => {
          this.form_fields_list.forEach(field => {
            if (field.location === item) {
              result.push(field.label);
            }
          });
        });

        this.data.result = result;
        this.$emit("update_relation", this.data);
      } else {
        if (this.data.value.length === 0) {
          this.relation_vilidate = true;
        } else {
          this.relation_vilidate = false;
        }

        this.$message.error("Linkage relation is error!");
      }
    },
    clear_relation() {
      this.relation_vilidate = true;
    },
    validate() {
      const reg = /^[A-Z]+[A-Z\>]+[A-Z]+$/;
      return reg.test(this.data.value);
    }
  }
};
</script>
<style lang='scss'>
.relation-item {
  float: left;
  .error-relation {
    .el-input__inner {
      color: #f56c6c;
      border-color: #f56c6c;
    }
  }
}

</style>