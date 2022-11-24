<script setup>
import User from "@/models/user";
</script>

<template>
  <main v-loading="loading" element-loading-text="Loading..." element-loading-background=" rgba(80, 80, 80, 0.8)">
    <div class="wrapper">
      <img id="title" src="../assets/logo.png" />
      <div id="login-form" class="fade-down">
        <el-form ref="formRef" :model="user" :rules="rules">
          <el-form-item prop="username">
            <el-input v-model="user.username" type="text" placeholder="用户名" clearable />
          </el-form-item>
          <br />
          <el-form-item prop="password">
            <el-input v-model="user.password" type="password" placeholder="密码" show-password />
          </el-form-item>
          <br />
          <el-form-item class="submit-btns">
            <el-button round type="info" @click="$router.push('/register')">注册</el-button>
            <el-button round type="primary" @click="submitForm(this.$refs.formRef)">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      loading: false,
      user: new User("", ""),
      rules: {
        username: [
          { required: true, message: "请输入正确的用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入正确的密码", trigger: "blur" },
        ],
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
      console.log("Login:", this.user);
      await formEl.validate((valid, fields) => {
        if (valid) {
          this.$store.dispatch("auth/login", this.user).then(
            () => {
              // Login successful
              this.loading = false;
              this.$router.push("/home");
            },
            (error) => {
              // Login failed
              console.log("Error information!", this.user);
              this.loading = false;
              var msg =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              this.errorMessage(msg, "登录失败");
            }
          );
        } else {
          // Validation failed
          console.log("Error in validation!", fields);
          this.loading = false;
          this.errorMessage("用户名或密码错误，请重新输入！", "信息错误");
        }
      });
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
@import "@/assets/css/animation.css";

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

#login-form {
  width: 100%;
  background-color: rgba(128, 128, 128, 0.5);
  padding: 1em;
  margin-top: 5em;
  border-radius: 16px;
  text-align: center;
}

#login-form .el-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#login-form .el-form-item {
  width: 80%;
  max-width: 256px;
  margin: 1em;
  display: flex;
  justify-content: center;
}

#login-form .el-form-item.submit-btns {
  width: fit-content;
}
</style>
