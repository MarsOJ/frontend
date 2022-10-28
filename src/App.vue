<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>

<style>
html {
  height: 100%;
}

body {
  margin: 0px;
  height: 100%;
}

#app {
  font-weight: normal;
  height: 100%;
  min-height: 400px;
}

@media (max-width: 400px) {
  /* if the screen is narrower than 400px: special layout required */
}
</style>
