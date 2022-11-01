<script setup>
import { reactive } from "vue";

const loginForm = reactive({
  username: "",
  password: "",
});

function login() {
  console.log("Login:", loginForm);
}
</script>

<template>
  <main>
    wefweffwe
    <div id="login-form">
      <el-form :model="loginForm">
        <el-input
          v-model="loginForm.username"
          type="text"
          placeholder="用户名"
          clearable
        />
        <br />
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="密码"
          show-password
        />
        <br />
        <el-button round type="info" @click="$router.push('/register')"
          >注册</el-button
        >
        <el-button round type="primary" @click="login()">登录</el-button>
      </el-form>
    </div>
  </main>
</template>

<style scoped>
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
  background: url("../assets/bg_fullscreen.png") no-repeat center center;
  background-size: cover;
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
