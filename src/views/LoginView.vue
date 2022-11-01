<script setup>
import User from "@/models/user";
</script>

<template>
  <main>
    <div v-if="loading" id="loading">
      <div>Loading...</div>
    </div>
    <div class="wrapper">
      <img id="title" src="../assets/logo.png" />
      <div id="login-form">
        <el-form :model="user">
          <el-input v-model="user.username" type="text" placeholder="用户名" clearable />
          <br />
          <el-input v-model="user.password" type="password" placeholder="密码" show-password />
          <br />
          <el-button round type="info" @click="$router.push('/register')">注册</el-button>
          <el-button round type="primary" @click="onLogIn()">登录</el-button>
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
    }
  },
  methods: {
    errorMessage(msg, title) {
      ElMessageBox.alert(msg, title, {
        confirmButtonText: "确认",
      });
    },
    onLogIn() {
      this.loading = true;
      console.log("Login:", this.user);
      // $validator.validateAll().then(isValid => {
      //   if (!isValid) {
      //     this.loading = false;
      //     this.errorMessage("用户名或密码错误，请重新输入！", "密码错误");
      //     return;
      //   }
      if (this.user.username && this.user.password) {
        this.$store.dispatch('auth/login', this.user).then(
          () => {
            // Login successful
            this.loading = false;
            this.$router.push('/home');
          },
          error => {
            // Login failed
            this.loading = false;
            var msg = (error.response && error.response.data) || error.message || error.toString();
            this.errorMessage(msg, "登录失败");
          }
        );
      }
      // });
    }
  },
  created() {
    if (this.$store.state.auth.status.loggedIn) {
      this.$router.push('/home');
    }
  }
}
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

#login-form {
  width: 100%;
  background-color: rgba(128, 128, 128, 0.5);
  padding: 1em;
  margin-top: 5em;
  border-radius: 16px;
  text-align: center;
}

#login-form .el-input {
  width: 80%;
  max-width: 256px;
  margin: 1em;
}

#login-form .el-button {
  margin: 1em;
}
</style>
