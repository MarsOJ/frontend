<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import { ref } from "vue";

const count = ref(0);

function increment() {
  count.value++;
}
</script>

<template>
  <header>
    <NavigationBar />
  </header>

  <main>
    <em>Element Plus</em> Button Sample:
    <el-button type="primary" @click="increment()">CLICK HERE >>>> {{ count }}</el-button>
  </main>
</template>

<style scoped>
main {
  text-align: center;
}
</style>
