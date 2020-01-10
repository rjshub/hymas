<template>
    <div class="login">
        <festival-show></festival-show>
        <div class="container">
            <div class="main">
                <div class="bg-img login-background">
                    <div class="paragraph">
                        <div class="left"><i class="iconfont mas-quote2-left"></i></div>
                        <div>Welcome to HYMAS,</div>
                        <div>the advanced</div>
                        <div>agency reporting system</div>
                        <div class="right"><i class="iconfont mas-quote2-right"></i></div>
                    </div>
                </div>
                <div class="form">
                    <div class="legend">Login your account</div>
                    <div class="panel">
                        <el-form ref="form"
                            :model="form"
                            :rules="rules"
                            label-position="top"
                            label-width="80px">
                            <el-form-item label="User name"
                                prop="username">
                                <el-input v-model="form.username"
                                    @keyup.enter.native="handle_submit"
                                    autocomplete="on"></el-input>
                            </el-form-item>
                            <el-form-item label="Password"
                                prop="password">
                                <el-input v-model="form.password"
                                    @keyup.enter.native="handle_submit"
                                    show-password></el-input>
                            </el-form-item>
                            <el-form-item label="Code"
                                prop="qrcode">
                                <el-input v-model="form.qrcode"
                                    @keyup.enter.native="handle_submit"
                                    class="code">
                                    <template v-slot:append>
                                        <img :src="qrcode_url"
                                            class="vcode"
                                            @click="handle_refresh_qrcode"
                                            alt="Click Refresh">
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="submit">
                        <el-button type="primary"
                            :loading="isLoading"
                            native-type="submit"
                            @click="handle_submit">{{loadingText}}</el-button>
                        <!-- 既能点击提交，又能回车键提交 表单 -->
                    </div>
                </div>
            </div>
        </div>
        <div class="copyright">
            {{copyright}}
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import md5 from "md5";

import fetch from "@/services/fetch";
import festivalShow from "@/components/common/festival-show";
export default {
  name: "Login",
  components: { festivalShow },

  data() {
    let validateUserName = (rule, value, callback) => {
      let nameRegx = this.$REGXMAP.name;
      if (!value) {
        callback(new Error("Username is required."));
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

    let validatePassword = (rule, value, callback) => {
      let nameRegx = this.$REGXMAP.password;
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
    };

    let validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error("Code is required."));
      } else {
        callback();
      }
    };

    return {
      isLoading: false,
      loadingText: "Sign in",
      form: {
        username: "",
        password: "",
        qrcode: ""
      },
      qrcode_url: "",
      rules: {
        username: [{ validator: validateUserName, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        qrcode: [{ validator: validateCode, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState("common", ["welcome", "copyright"]),

    // ...mapGetters("home", ["homeSubRoute"]),
    ...mapGetters("reportCenter", ["reportSubRoute"]),
    ...mapGetters("dataSource", ["sourceSubRoute"]),
    ...mapGetters("settings", ["settingsSubRoute"])
  },

  methods: {
    ...mapActions("user", ["login"]),
    ...mapMutations("common", ["UPDATE_ROUTE"]),

    triggerLoading(flag) {
      this.isLoading = flag;
      this.loginBtnText = flag ? "Signing in" : "Sign in";
    },

    //返回二维码url
    async handle_refresh_qrcode() {
      try {
        let res = await fetch.get("/login/vcode");
        this.qrcode_url = res.data.url;
      } catch (err) {
        this.$message.error(err.message);
      }
    },

    //点击登录
    handle_submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.triggerLogin();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    async triggerLogin() {
      this.triggerLoading(true);

      let form = {
        uname: this.form.username,
        upass: md5(this.form.password),
        vcode: this.form.qrcode
      };

      try {
        let result = await this.login(form);

        let timer = setTimeout(() => {
          clearTimeout(timer); //清除定时器

          this.UPDATE_ROUTE("home");
          this.$router.replace(`/home/custom-page`);
          // if (this.homeSubRoute && this.homeSubRoute.length > 0) {
          //   this.UPDATE_ROUTE("home");
          //   this.$router.replace(`/home/${this.homeSubRoute[0].key}`);
          // } else if (this.reportSubRoute && this.reportSubRoute.length > 0) {
          //   this.UPDATE_ROUTE("report-center");
          //   this.$router.replace(`/report-center/${this.reportSubRoute[0].key}`);
          // } else if (this.sourceSubRoute && this.sourceSubRoute.length > 0) {
          //   this.UPDATE_ROUTE("data-source");
          //   this.$router.replace(`/data-source/${this.sourceSubRoute[0].key}`);
          // } else if (this.settingsSubRoute && this.settingsSubRoute.length > 0) {
          //   this.UPDATE_ROUTE("settings");
          //   this.$router.replace(`/settings/${this.settingsSubRoute[0].key}`);
          // } else {
          //   console.log("暂无任何菜单项，无法登陆");
          // }
        }, 1500);
      } catch (err) {
        this.handle_refresh_qrcode();
        this.triggerLoading(false);
        this.$message({
          showClose: true,
          type: "error",
          message: err.message
        });
      }
    }
  },

  mounted() {
    this.handle_refresh_qrcode();
  }
};
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f4f9;

  .bg-img {
    display: flex;
    justify-content: center;
    align-items: center;

    .paragraph {
      @media only screen and (min-width: 1200px) {
        width: 310px;
        font-size: 28px;
      }

      @media only screen and (min-width: 1440px) {
        width: 410px;
        font-size: 33px;
        letter-spacing: 2px;
      }

      position: relative;
      width: 310px;
      height: 100px;
      line-height: 35px;
      font-size: 28px;
      color: #b4ddff;

      .left {
        position: absolute;
        left: -70px;
        top: -10px;
      }

      .right {
        position: absolute;
        right: -65px;
        bottom: -20px;
      }

      i {
        font-size: 45px;
      }
    }
  }

  .container {
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    .main {
      display: flex;

      height: 500px;
      width: 900px;

      @media only screen and (min-width: 1200px) {
        height: 500px;
        width: 900px;
      }

      @media only screen and (min-width: 1440px) {
        height: 600px;
        width: 1100px;
      }

      background-color: white;
      box-shadow: 1px 1px 20px 4px rgba(0, 169, 255, 0.15);
      border-radius: 5px;

      .bg-img {
        width: 60%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .form {
        flex: 1;
        padding: 80px 35px;

        @media only screen and (min-width: 1200px) {
          padding: 80px 35px;
        }

        @media only screen and (min-width: 1440px) {
          padding: 100px 50px;
        }

        .legend {
          padding-bottom: 30px;
          text-align: center;
          font-size: 20px;
          color: #606266;
        }

        .el-form {
          /deep/ .el-form-item__label {
            padding: 0;
            line-height: 25px;
          }
          /deep/ .el-input__inner {
            border-radius: 30px;
          }

          .code {
            /deep/ .el-input__inner {
              border-radius: 30px;
            }

            /deep/ .el-input-group__append {
              background-color: transparent;
              border: 0;
              width: 40%;
              cursor: pointer;
              padding: 0;

              .vcode {
                width: 100%;
                display: block;
                height: 38px;
              }
            }
          }
        }

        .submit {
          .el-button {
            width: 100%;
            border-radius: 40px;
          }
        }
      }
    }
  }
  .copyright {
    display: flex;
    justify-content: center;
    height: 10%;
    color: silver;
  }
}
</style>

