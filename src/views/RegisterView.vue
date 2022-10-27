<script setup>
import { reactive } from 'vue'

const registerForm = reactive({
  username: '',
  password: '',
  password2: '',
})

function verifyPassword() {
  return false
}

function register() {
  console.log("Register:", registerForm)
  var valid = verifyPassword()
  if (!valid) {
    ElMessageBox.alert('密码不合法，请重新选择密码！', '密码错误', {
      confirmButtonText: '确认',
    })
  }
  else if (registerForm.password !== registerForm.password2) {
    ElMessageBox.alert('两次密码不一致，请重新输入！', '密码错误', {
      confirmButtonText: '确认',
    })
  }
}
</script>

<template>
  <main>
    <div id="register-form">
      <el-form :model="registerForm">
        <el-input v-model="registerForm.username" type="text" placeholder="用户名" clearable />
        <br />
        <el-input v-model="registerForm.password" type="password" placeholder="密码" show-password />
        <br />
        <el-input v-model="registerForm.password2" type="password" placeholder="再次输入密码" show-password />
        <br />
        <el-button round type="primary" @click="register()">注册</el-button>
      </el-form>
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url('../assets/bg_fullscreen.png') no-repeat center center;
  background-size: cover;
}

#register-form {
  background-color: rgba(128, 128, 128, 0.5);
  width: 30%;
  min-width: 400px;
  padding: 1em;
  margin-top: 5em;
  text-align: center;
}

#register-form .el-input {
  width: 80%;
  max-width: 256px;
  margin: 1em;
}

#register-form .el-button {
  margin: 1em;
}
</style>
