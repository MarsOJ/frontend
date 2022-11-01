<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <el-affix>
    <nav>
      <RouterLink to="/home">首页</RouterLink>
      <RouterLink to="/battle">答题对战</RouterLink>
      <RouterLink to="/favorites">收藏夹</RouterLink>
      <RouterLink to="/gallery">礼品屋</RouterLink>
      <RouterLink to="/personal">个人中心</RouterLink>
    </nav>
  </el-affix>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

a,
.green {
  text-decoration: none;
  color: white;
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: paleturquoise;
  }
}

nav {
  width: 100vw;
  font-size: 24px;
  font-weight: bold;
  line-height: 4.5em;
  text-align: right;
  border-bottom: 3px #e7e7e7 solid;
  background: url(../assets/navi.png) no-repeat center center;
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size: 100% 100%;
  background-size: 100% 100%;
}

nav a.router-link-exact-active {
  color: white;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 2rem;
  border-left: 0px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
