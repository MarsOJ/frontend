<script setup>
import { reactive } from 'vue'

const loginForm = reactive({
  username: '',
  password: '',
})

function login() {
  console.log("Login:", loginForm)
}
</script>

<template>
  <main>
    <div id="login-form">
      <el-form :model="loginForm">
        <el-input v-model="loginForm.username" type="text" placeholder="用户名" clearable />
        <br />
        <el-input v-model="loginForm.password" type="password" placeholder="密码" show-password />
        <br />
        <el-button type="primary" @click="login()">登录</el-button>
      </el-form>
    </div>
    {{ loginForm }}
  </main>
</template>

<style scoped>
main {
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#login-form {
  background-color: rgba(128, 128, 128, 0.5);
  width: 30%;
  min-width: 400px;
  padding: 1em;
  margin-top: 5em;
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
