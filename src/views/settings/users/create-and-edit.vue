<template>
    <div class="user-create-and-edit">
        <bread-crumb :values="breadCrumbList"></bread-crumb>

        <div class="main"
            v-loading="isLoading"
            element-loading-spinner="iconfont mas-loading">
            <el-form :model="form"
                :rules="rules"
                size="mini"
                ref="form"
                autocomplete="off"
                label-width="150px"
                class="create-and-edit-form">
                <el-form-item label="User Name:"
                    prop="nickName">
                    <el-input v-model="form.nickName"
                        :disabled="disabledNickName"
                        style="width:450px"></el-input>
                </el-form-item>

                <el-form-item label="Role:"
                    prop="role">
                    <div>
                        <el-select v-show="form.roleId!=1"
                            filterable
                            :disabled="operateType=='detail'"
                            v-model="form.roleId"
                            style="width:450px">
                            <el-option v-for="(item,index) in roleList"
                                :class="{level1: item.level==1, level2: item.level==2}"
                                :key="index"
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
                    <el-input v-if="operateType=='add'"
                        v-model="form.password"
                        :disabled="operateType=='detail'"
                        show-password
                        autocomplete="new-password"
                        style="width:450px"></el-input>
                    <el-input v-else
                        class="modify-password"
                        v-model="form.password"
                        :disabled="operateType=='detail'"
                        show-password
                        placeholder="Please skip this entry if you don't modify it."
                        autocomplete="new-password"
                        style="width:450px"></el-input>
                </el-form-item>

                <el-form-item label="Confirm Password:"
                    prop="confirmPassword">
                    <el-input v-if="operateType=='add'"
                        v-model="form.confirmPassword"
                        :disabled="operateType=='detail'"
                        show-password
                        autocomplete="new-password"
                        style="width:450px"></el-input>
                    <el-input v-else
                        class="modify-password"
                        v-model="form.confirmPassword"
                        :disabled="operateType=='detail'"
                        show-password
                        placeholder="Please skip this entry if you don't modify it."
                        autocomplete="new-password"
                        style="width:450px"></el-input>
                </el-form-item>
                <el-form-item label="Real Name:"
                    prop="userName">
                    <el-input v-model="form.userName"
                        :disabled="operateType=='detail'"
                        style="width:450px"></el-input>
                </el-form-item>
                <el-form-item label="Cellphone Number:"
                    prop="cellphone">
                    <el-input v-model="form.cellphone"
                        :disabled="operateType=='detail'"
                        style="width:450px"></el-input>
                </el-form-item>
                <el-form-item label="E-Mail:"
                    prop="email">
                    <el-input v-model="form.email"
                        :disabled="operateType=='detail'"
                        style="width:450px"></el-input>
                </el-form-item>
                <el-form-item v-if="operateType!='add'">
                    <div class="update-and-upload-time"
                        style="width:450px">
                        <span>Updated on {{form.updatedTime}}</span> <span>Uploaded on {{form.uploadedTime}}</span>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary"
                        v-if="operateType!='detail'"
                        @click="handle_submit">Submit</el-button>
                    <el-button @click="handle_cancel">Cancel</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import breadCrumb from "@/components/common/bread-crumb";
import md5 from "md5";

export default {
  name: "Create-And-Edit",
  components: { breadCrumb },

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
      if (this.operateType != "add" && value == "") {
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
      breadCrumbList: [],
      operateType: "",

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
    }),

    disabledNickName() {
      return this.operateType == "detail" || this.operateType == "profile";
    }
  },
  watch: {
    $route: {
      handler: function(val) {
        this.$refs.form.clearValidate();
        this.init();
      },
      deep: true //监听深度层次的数据结构
    }
  },
  methods: {
    ...mapActions("settings", ["fetch_user_role_list", "fetch_add_user", "fetch_edit_user", "fetch_user_detail"]),
    ...mapMutations("user", ["UPDATE_USER_INFO"]),

    setFormData(data) {
      if (this.$route.query.type == "add") {
        this.form.roleId = data.role_id || "";
      } else {
        this.form.nickName = data.nickname || "";
        this.form.roleId = data.role_id || "";
        this.form.userName = data.username || "";
        this.form.cellphone = data.cellphone || "";
        this.form.email = data.email || "";
        this.form.updatedTime = data.update_time || "";
        this.form.uploadedTime = data.upload_time || "";
        this.form.state = data.state || "0";
      }
    },
    async init() {
      let arr = [];

      if (this.$route.query.type == "edit") {
        this.operateType = "edit";
        //编辑
        this.breadCrumbList = [
          { path: "/settings/users", name: "Settings" },
          { path: "/settings/users", name: "Users" },
          { path: "", name: "Edit User" }
        ];
        arr = [this.fetch_user_role_list({ id: this.userId }), this.fetch_user_detail({ id: this.$route.query.id })];
      }
      if (this.$route.query.type == "profile") {
        this.operateType = "profile";

        //编辑
        this.breadCrumbList = [
          { path: "/settings/users", name: "Settings" },
          { path: "/settings/users", name: "Users" },
          { path: "", name: "Profile" }
        ];
        arr = [this.fetch_user_role_list({ id: this.userId }), this.fetch_user_detail({ id: this.$route.query.id })];
      }
      if (this.$route.query.type == "detail") {
        this.operateType = "detail";
        //编辑
        this.breadCrumbList = [
          { path: "/settings/users", name: "Settings" },
          { path: "/settings/users", name: "Users" },
          { path: "", name: "Detail User" }
        ];
        arr = [this.fetch_user_role_list({ id: this.userId }), this.fetch_user_detail({ id: this.$route.query.id })];
      }

      if (this.$route.query.type == "add") {
        this.operateType = "add";
        //添加
        this.breadCrumbList = [
          { path: "/settings/users", name: "Settings" },
          { path: "/settings/users", name: "Users" },
          { path: "", name: "Add User" }
        ];
        if (this.$route.query.id) {
          arr = [this.fetch_user_role_list({ id: this.userId }), this.fetch_user_detail({ id: this.$route.query.id })];
        } else {
          arr = [this.fetch_user_role_list({ id: this.userId }), null];
        }
      }

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
            nickname: this.form.nickName,
            role_id: this.form.roleId,
            password: this.form.password ? md5(this.form.password) : undefined,
            conf_pass: this.form.confirmPassword ? md5(this.form.confirmPassword) : undefined,
            username: this.form.userName,
            cellphone: this.form.cellphone,
            email: this.form.email
          };

          if (this.operateType == "add") {
            this.fetch_add_user(params)
              .then(res => {
                this.$router.push({ name: "users" });
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            if (this.operateType == "edit") {
              params.id = this.$route.query.id;
            }
            if (this.operateType == "profile") {
              params.id = this.userId;
            }

            this.fetch_edit_user(params)
              .then(res => {
                if (this.operateType == "profile") {
                  this.UPDATE_USER_INFO(params);
                }
                this.$router.push({ name: "users" });
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          }
        }
      });
    },
    handle_cancel() {
      this.$router.push({
        name: "users"
      });
    }
  },

  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.user-create-and-edit {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 10px 10px 0 10px;

  .main {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 15px;
    background-color: white;
    height: 100%;

    .create-and-edit-form {
      margin-top: 30px;
      margin-left: 50px;

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