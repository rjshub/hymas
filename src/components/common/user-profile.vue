<template>
    <el-dialog title="Profile"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible="true"
        width="750px"
        @close="handle_close">
        <div class="user-profile">
            <div v-loading="isLoading"
                element-loading-spinner="iconfont mas-loading"
                class="main">
                <el-form ref="form"
                    :model="form"
                    :rules="rules"
                    size="mini"
                    autocomplete="off"
                    label-width="150px"
                    class="create-and-edit-form">
                    <el-form-item label="User Name:"
                        prop="nickName">
                        <el-input v-model="form.nickName"
                            :disabled="true"
                            style="width:450px"></el-input>
                    </el-form-item>

                    <el-form-item label="Role:"
                        prop="role">
                        <div>
                            <el-select v-show="form.roleId!=1"
                                v-model="form.roleId"
                                filterable
                                style="width:450px">
                                <el-option v-for="(item,index) in roleList"
                                    :key="index"
                                    :class="{level1: item.level==1, level2: item.level==2}"
                                    :label="item.role_name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                            <span v-show="form.roleId==1">
                                --
                            </span>
                        </div>
                        <div :class="{'hidden-select':isShowHiddenSelect}">
                            <el-select v-model="form.roleIdHidden"
                                filterable
                                style="width:450px">
                                <el-option label="hidden"
                                    value="999999999">
                                </el-option>
                            </el-select>
                        </div>
                    </el-form-item>

                    <el-form-item label="Password:"
                        prop="password">
                        <el-input v-model="form.password"
                            class="modify-password"
                            show-password
                            placeholder="Please skip this entry if you don't modify it."
                            autocomplete="new-password"
                            style="width:450px"></el-input>
                    </el-form-item>

                    <el-form-item label="Confirm Password:"
                        prop="confirmPassword">
                        <el-input v-model="form.confirmPassword"
                            class="modify-password"
                            show-password
                            placeholder="Please skip this entry if you don't modify it."
                            autocomplete="new-password"
                            style="width:450px"></el-input>
                    </el-form-item>
                    <el-form-item label="Real Name:"
                        prop="userName">
                        <el-input v-model="form.userName"
                            style="width:450px"></el-input>
                    </el-form-item>
                    <el-form-item label="Cellphone Number:"
                        prop="cellphone">
                        <el-input v-model="form.cellphone"
                            style="width:450px"></el-input>
                    </el-form-item>
                    <el-form-item label="E-Mail:"
                        prop="email">
                        <el-input v-model="form.email"
                            style="width:450px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="update-and-upload-time"
                            style="width:450px">
                            <span>Updated on {{form.updatedTime}}</span> <span>Uploaded on {{form.uploadedTime}}</span>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary"
                            @click="handle_submit">Submit</el-button>
                        <el-button @click="handle_close">Cancel</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import md5 from "md5";

export default {
  name: "UserProfile",
  components: {},

  data() {
    let validateNickName = (rule, value, callback) => {
      let nameRegx = this.$REGXMAP.name;
      if (!value) {
        callback(new Error("User Name is required."));
      } else {
        if (!nameRegx.firstPlace.regx.test(value)) {
          callback(new Error(nameRegx.firstPlace.message));
        } else if (!nameRegx.character.regx.test(value)) {
          callback(new Error(nameRegx.character.message));
        } else if (value.length < nameRegx.length.min || value.length > nameRegx.length.max) {
          callback(new Error(nameRegx.length.message));
        } else {
          callback();
        }
      }
    };
    let validateRole = (rule, value, callback) => {
      if (!value) {
        callback(new Error("Role is required."));
      } else {
        callback();
      }
    };
    let validatePassword = (rule, value, callback) => {
      let nameRegx = this.$REGXMAP.password;
      if (value == "") {
        callback();
      } else {
        if (!value) {
          callback(new Error("Password is required."));
        } else {
          if (nameRegx.number.regx.test(value)) {
            callback(new Error(nameRegx.number.message));
          } else if (nameRegx.alphabets.regx.test(value)) {
            callback(new Error(nameRegx.alphabets.message));
          } else if (nameRegx.special.regx.test(value)) {
            callback(new Error(nameRegx.special.message));
          } else if (!nameRegx.character.regx.test(value)) {
            callback(new Error(nameRegx.character.message));
          } else if (value.length < nameRegx.length.min || value.length > nameRegx.length.max) {
            callback(new Error(nameRegx.length.message));
          } else {
            callback();
          }
        }
      }
    };

    let validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error("Confirm Password is not same as Password."));
      } else {
        callback();
      }
    };

    let validateUserName = (rule, value, callback) => {
      let nameRegx = this.$REGXMAP.realName;
      if (!value) {
        callback(new Error("User Name is required."));
      } else {
        if (!nameRegx.character.regx.test(value)) {
          callback(new Error(nameRegx.character.message));
        } else if (value.length < nameRegx.length.min || value.length > nameRegx.length.max) {
          callback(new Error(nameRegx.length.message));
        } else {
          callback();
        }
      }
    };
    let validateCellphone = (rule, value, callback) => {
      let nameRegx = this.$REGXMAP.cellphone;
      if (!value) {
        callback(new Error("Cell Phone is required."));
      } else {
        if (!nameRegx.character.regx.test(value)) {
          callback(new Error(nameRegx.character.message));
        } else {
          callback();
        }
      }
    };
    let validateEmail = (rule, value, callback) => {
      let nameRegx = this.$REGXMAP.email;
      if (!value) {
        callback(new Error("Email is required."));
      } else {
        if (!nameRegx.character.regx.test(value)) {
          callback(new Error(nameRegx.character.message));
        } else {
          callback();
        }
      }
    };

    return {
      isShowHiddenSelect: false,
      isLoading: false,

      form: {
        nickName: "",
        roleId: "",
        password: "", //新建时默认里面有一个
        confirmPassword: "",
        userName: "",
        cellphone: "",
        email: "",
        updatedTime: "",
        uploadedTime: "",
        state: ""
      },
      rules: {
        nickName: [{ validator: validateNickName, trigger: "blur" }],
        roleId: [{ validator: validateRole, trigger: "change" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        confirmPassword: [{ validator: validateConfirmPassword, trigger: "blur" }],
        userName: [{ validator: validateUserName, trigger: "blur" }],
        cellphone: [{ validator: validateCellphone, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }]
      },

      roleList: []
    };
  },
  computed: {
    ...mapState({
      userId: state => state.user.id
    })
  },

  methods: {
    ...mapActions("settings", ["fetch_user_role_list_self", "fetch_add_user", "fetch_edit_user", "fetch_user_detail"]),
    ...mapMutations("user", ["UPDATE_USER_INFO"]),

    setFormData(data) {
      this.form.nickName = data.nickname || "";
      this.form.roleId = data.role_id || "";
      this.form.userName = data.username || "";
      this.form.cellphone = data.cellphone || "";
      this.form.email = data.email || "";
      this.form.updatedTime = data.update_time || "";
      this.form.uploadedTime = data.upload_time || "";
      this.form.state = data.state || "0";
    },
    async init() {
      // this.$refs.form.clearValidate();

      let arr = [this.fetch_user_role_list_self({ id: this.userId }), this.fetch_user_detail({ id: this.userId })];

      try {
        this.isLoading = true;
        let [res_role_list, res_user_detail] = await Promise.all(arr);

        if (res_user_detail) {
          this.setFormData(res_user_detail);
        }
        this.roleList = res_role_list;

        this.isLoading = false;
        this.isShowHiddenSelect = true;
      } catch (err) {
        this.isLoading = false;
        this.isShowHiddenSelect = true;
        this.$message.error(err.message);
      }
    },

    handle_submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = {
            id: this.userId,
            nickname: this.form.nickName,
            role_id: this.form.roleId,
            password: this.form.password ? md5(this.form.password) : undefined,
            conf_pass: this.form.confirmPassword ? md5(this.form.confirmPassword) : undefined,
            username: this.form.userName,
            cellphone: this.form.cellphone,
            email: this.form.email
          };

          this.fetch_edit_user(params)
            .then(res => {
              this.UPDATE_USER_INFO(params);
              this.handle_close();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        }
      });
    },
    handle_close() {
      this.$emit("close");
    }
  },

  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.user-profile {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 15px;
    background-color: white;
    height: 100%;

    .create-and-edit-form {
      .update-and-upload-time {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #999999;
      }

      .modify-password {
        ::placeholder {
          color: #c5c5c5;
        }

        ::-moz-placeholder {
          color: #c5c5c5;
          opacity: 1;
        }
      }
    }
  }
}

.hidden-select {
  visibility: hidden;
  line-height: 0px;
  height: 0;
}
</style>
<style lang="scss">
.el-select-dropdown {
  .el-select-dropdown__item {
    &.level2 {
      padding-left: 40px;
    }
  }
}
</style>