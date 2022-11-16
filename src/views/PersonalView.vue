<script setup>
import NaviBar from "@/components/NaviBar.vue";
import Footer from "@/components/PageFooter.vue";
</script>

<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <NaviBar />
      <el-main class="main"> </el-main>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.main {
  text-align: center;
  padding-top: 5vh;
  padding-left: 3vw;
  padding-right: 3vw;
  width: 100vw;
  background-color: rgba(240, 245, 240, 0.549);
}

.common-layout {
  height: 100vh;
}
</style>
