<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
</script>

<template>
  <div class="common-layout" v-loading="loading">
    <el-container direction="vertical">
      <el-scrollbar>
        <div ref="mainpage">
          <NaviBar />
          <el-container class="page-main">
            qwfqwfqwf
          </el-container>
          <Footer />
        </div>
      </el-scrollbar>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
    }
  },
  mounted() {
    this.$store.dispatch("auth/logout").then(
      () => {
        // Logout successful
        this.loading = false;
        ElMessageBox.alert("成功登出！", "登出成功", {
          confirmButtonText: "确认",
        });
        this.$router.push("/home");
      },
      (error) => {
        // Login failed
        console.log("Logout error!");
        this.loading = false;
        var msg =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        ElMessageBox.alert(msg, "登出失败", {
          confirmButtonText: "确认",
        });
      }
    );
  }
}
</script>

<style scoped>
.common-layout {
  height: 100vh;
}
</style>
