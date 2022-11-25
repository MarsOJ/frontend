<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>

<style>
html,
body {
  margin: 0px;
  border: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, \5fae\8f6f\96c5\9ed1, Arial, sans-serif;
}

#app {
  font-weight: normal;
  height: 100%;
  min-height: 400px;
  background-color: #f5f5f5;
}

.el-container {
  height: 100%;
}

@media (max-width: 400px) {
  /* if the screen is narrower than 400px: special layout required */
}
</style>
