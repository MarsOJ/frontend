<script setup>
import User from "@/models/user";
import AuthService from "@/services/auth.service";
</script>

<template>
  <LoadingBlock v-if="loading" :cond="[true]" :msg="['修改密码中……']" />
  <div class="settings-page">
    <div class="settings fade-down">
      <h2>账号安全</h2>
      <div class="settings-item">
        <div class="label">用户类型</div>
        <div class="action" v-if="admin">管理员</div>
        <div class="action" v-else>普通用户</div>
      </div>
      <div class="settings-item">
        <div class="label">设置密码</div>
        <a class="action" @click="pwdEdit">修改密码</a>
      </div>
      <el-form
        id="password-edit"
        class="fade-down"
        v-if="pwdEnabled"
        ref="formRef"
        :model="form"
        :rules="rules"
      >
        <div class="settings-item">
          <div class="label">原密码</div>
          <el-form-item prop="oldPwd">
            <el-input
              v-model="form.oldPwd"
              type="password"
              placeholder="原密码"
            />
          </el-form-item>
        </div>
        <div class="settings-item">
          <div class="label">新密码</div>
          <el-form-item prop="newPwd">
            <el-input
              v-model="form.newPwd"
              type="password"
              placeholder="新密码"
            />
          </el-form-item>
        </div>
        <div class="settings-item">
          <div class="label">重复输入密码</div>
          <el-form-item prop="newPwd2">
            <el-input
              v-model="form.newPwd2"
              type="password"
              placeholder="重复输入密码"
            />
          </el-form-item>
        </div>
        <el-form-item class="submit-btns">
          <el-button
            round
            type="primary"
            @click="submitForm(this.$refs.formRef)"
            >修改密码</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="settings fade-down" v-if="admin">
      <h2>管理权限</h2>
      <div class="settings-item">
        <div class="label">网站内容管理</div>
        <a class="action" @click="$router.push('/home')">进入后台</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsView",
  props: {
    update: Boolean,
  },
  data() {
    return {
      loading: false,
      admin: true,
      pwdEnabled: false,
      form: {
        oldPwd: "",
        newPwd: "",
        newPwd2: "",
      },
      user: new User("", ""),
      rules: {
        oldPwd: [
          { required: true, message: "请输入原始密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "密码的长度应为6到20字符",
            trigger: "blur",
          },
          { validator: this.validatePass, trigger: "blur" },
        ],
        newPwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "密码的长度应为6到20字符",
            trigger: "blur",
          },
          { validator: this.validatePass, trigger: "blur" },
        ],
        newPwd2: [{ validator: this.validatePassConfirm, trigger: "blur" }],
      },
    };
  },
  methods: {
    errorMessage(msg, title) {
      ElMessageBox.alert(msg, title, {
        confirmButtonText: "确认",
      });
    },
    pwdEdit() {
      this.pwdEnabled = true;
    },
    validatePass(rule, value, callback) {
      if (value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)) {
        callback();
      } else {
        callback(new Error("应同时含有大写字母、小写字母和数字"));
      }
    },
    validatePassConfirm(rule, value, callback) {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.newPwd) {
        callback(new Error("两次输入的密码不相同"));
      } else {
        callback();
      }
    },
    async submitForm(formEl) {
      if (!formEl) {
        return;
      }
      this.loading = true;
      await formEl.validate((valid, fields) => {
        if (valid) {
          this.user.username = this.$store.state.auth.user;
          this.user.password = this.form.oldPwd;
          AuthService.changePwd(this.user, this.form.newPwd).then(
            () => {
              // Register successful: login now
              console.log("Successful");
              this.loading = false;
              ElMessage({
                message: "密码修改成功！",
                type: "success",
              });
            },
            (error) => {
              // Register failed
              console.log("Error information!", this.user);
              this.loading = false;
              var msg =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              this.errorMessage(msg, "密码修改失败");
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
  },
};
</script>

<style scoped>
a {
  color: #00a8b1;
  cursor: pointer;
}

.settings-page {
  width: 100%;
}

.settings {
  width: 100%;
  box-sizing: border-box;
  margin: 2em 0em;
  padding: 2em 4em;
  background-color: white;
  border: 1px solid #e9e9e9;
  transition: all 0.4s ease-out;
}

.settings-item {
  margin: 12px 3em;
  display: flex;
  align-items: top;
}

.settings-item .label {
  width: 40%;
}

.settings #password-edit {
  margin: 12px 3em;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.settings #password-edit .settings-item {
  width: 100%;
}

.submit-btns {
  display: flex;
  justify-content: center;
}

.el-form-item.submit-btns {
  width: fit-content;
}
</style>
