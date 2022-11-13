<script setup>
import User from "@/models/user";
</script>

<template>
  <main>
    <div v-if="loading" id="loading">
      <div>加载中……</div>
    </div>
    <div class="wrapper">
      <img id="title" src="../assets/logo.png" />
      <div id="register-form">
        <el-form ref="formRef" :model="form" :rules="rules">
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              type="text"
              placeholder="用户名"
              clearable
            />
          </el-form-item>
          <br />
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              show-password
            />
          </el-form-item>
          <br />
          <el-form-item prop="password2">
            <el-input
              v-model="form.password2"
              type="password"
              placeholder="再次输入密码"
            />
          </el-form-item>
          <br />
          <el-form-item class="submit-btns">
            <el-button round type="info" @click="$router.push('/login')"
              >登录</el-button
            >
            <el-button
              round
              type="primary"
              @click="submitForm(this.$refs.formRef)"
              >注册</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "RegisterView",
  data() {
    return {
      loading: false,
      form: {
        username: "",
        password: "",
        password2: "",
      },
      user: new User("", ""),
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "用户名的长度应为3到12字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "密码的长度应为6到20字符",
            trigger: "blur",
          },
          { validator: this.validatePass, trigger: "blur" },
        ],
        password2: [{ validator: this.validatePassConfirm, trigger: "blur" }],
      },
    };
  },
  methods: {
    errorMessage(msg, title) {
      ElMessageBox.alert(msg, title, {
        confirmButtonText: "确认",
      });
    },
    async submitForm(formEl) {
      if (!formEl) {
        return;
      }
      this.loading = true;
      console.log("Register:", this.form);
      await formEl.validate((valid, fields) => {
        if (valid) {
          this.user.username = this.form.username;
          this.user.password = this.form.password;
          this.$store.dispatch("auth/register", this.user).then(
            () => {
              // Register successful: login now
              console.log("Login:", this.user);
              this.$store.dispatch("auth/login", this.user).then(
                () => {
                  // Login successful
                  this.loading = false;
                  window.location.href = "/home";
                },
                (error) => {
                  // Login failed
                  console.log("Error information!", this.user);
                  this.loading = false;
                  var msg =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();
                  this.errorMessage(msg, "注册成功，登录失败");
                  this.$router.push("/login");
                }
              );
            },
            (error) => {
              // Register failed
              console.log("Error information!", this.user);
              this.loading = false;
              var msg =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              this.errorMessage(msg, "注册失败");
            }
          );
        } else {
          // Validation failed
          console.log("Error in validation!", fields);
          this.loading = false;
          this.errorMessage("请重新输入合法的信息！", "信息错误");
        }
      });
    },
    validatePass(rule, value, callback) {
      // TODO: validate password
      console.log(value);
      if (value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
        callback();
      } else {
        callback(new Error("应同时含有大写字母、小写字母和数字"));
      }
    },
    validatePassConfirm(rule, value, callback) {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入的密码不相同"));
      } else {
        callback();
      }
    },
  },
  created() {
    if (this.$store.state.auth.status.loggedIn) {
      this.$router.push("/home");
    }
  },
};
</script>

<style scoped>
#loading {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(128, 128, 128, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: xx-large;
  color: white;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: url("../assets/bg_fullscreen.png") no-repeat center center;
  background-size: cover;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%;
  min-width: 400px;
}

#title {
  width: 70%;
}

#register-form {
  width: 100%;
  background-color: rgba(128, 128, 128, 0.5);
  padding: 1em;
  margin-top: 5em;
  border-radius: 16px;
  text-align: center;
}

#register-form .el-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#register-form .el-form-item {
  width: 80%;
  max-width: 256px;
  margin: 1em;
  display: flex;
  justify-content: center;
}

#register-form .el-form-item.submit-btns {
  width: fit-content;
}
</style>
