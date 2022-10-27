<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const count = ref(0);

function increment() {
  count.value++
}
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/register">Register</RouterLink>
      <el-button type="primary" @click="increment()">(By Element UI) Count is: {{ count }}</el-button>
    </nav>
  </header>

  <div id="appRouterView">
    <RouterView />
  </div>
</template>

<style>
@import '@/assets/base.css';

#app {
  font-weight: normal;
}

header {
  line-height: 3em;
  max-height: 100vh;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  border-bottom: 1px #e7e7e7 solid;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (max-width: 1024px) {
  /* if the screen is not large enough */
}
</style>
