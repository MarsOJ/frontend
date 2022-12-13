<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <el-affix>
    <nav>
      <RouterLink to="/home">
        <img src="../assets/main-logo.png" @click="this.$router.push('/home')" />
      </RouterLink>

      <div class="fill"></div>

      <span class="links">
        <RouterLink to="/battle" class="link">
          <div>答题对战</div>
        </RouterLink>
        <RouterLink to="/favorites" class="link">
          <div>收藏夹</div>
        </RouterLink>
        <RouterLink to="/gallery" class="link">
          <div>礼品屋</div>
        </RouterLink>
        <RouterLink to="/personal" class="link" :class="{ 'router-link-active': $route.path.startsWith('/personal') }">
          <div>
            {{ username }}
          </div>
          <div class="dropdown-content" style="{'--num': 3}">
            <RouterLink to="/personal">个人资料</RouterLink>
            <RouterLink to="/personal/settings">账户设置</RouterLink>
            <RouterLink to="/logout">退出登录</RouterLink>
          </div>
        </RouterLink>
      </span>
    </nav>

    <!-- Add drop-down menu if the screen is narrow -->
  </el-affix>
</template>

<script>
export default {
  data() {
    return {
      username: "登录",
    };
  },
  mounted() {
    if (this.$store.state.auth.status.loggedIn) {
      this.username = this.$store.state.auth.user;
    }
  },
};
</script>

<style lang="scss" scoped>
$dropdown-height: 42px;

* {
  margin: 0;
  padding: 0;
}

nav {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  background: url(../assets/home.png) no-repeat center top;
  background-size: cover;
  position: relative;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(34, 34, 34, 0.5);
}

nav img {
  height: 36px;
  margin: 12px 2em 12px 2em;
  cursor: pointer;
}

nav .fill {
  height: 100%;
  flex-grow: 1;
  background-image: linear-gradient(to right,
      transparent,
      rgba(0, 20, 18, 0.8));
}

nav .links {
  height: 100%;
  padding-right: 1em;
  display: flex;
  justify-content: flex-end;
  text-align: right;
  font-size: 16px;
  /* font-weight: bold; */
  background: rgba(0, 20, 18, 0.8);
}

nav .links a.link {
  height: 100%;
  min-width: 92px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  position: relative;
  border-left: 0px solid var(--color-border);
  border-bottom: transparent 5px solid;
  border-top: transparent 5px solid;
}

nav .links a.link,
.green {
  text-decoration: none;
  color: white;
  transition: 0.4s;
}

@media (hover: hover) {
  nav .links a.link:hover {
    background-color: darkcyan;
  }
}

nav .links a.link.router-link-active,
nav .links a.link.router-link-exact-active {
  border-bottom: white 5px solid;
  border-top: transparent 5px solid;
}

/* nav .links a.link:first-of-type {
  border: 0;
} */

@media (max-width: 800px) {
  nav {
    background-image: url(../assets/navi.png);
  }

  .links {
    display: none !important;
  }
}

.dropdown-content {
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 55px;
  right: 0;
  background-color: #21202e;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 100;
  overflow: hidden;
  transition: all 0.2s ease-out;
}

a.link:hover .dropdown-content {
  height: calc(var(--num) * $dropdown-height);
}

.dropdown-content a {
  width: 100%;
  height: 0;
  font-size: 14px;
  text-decoration: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease-out;
}

.dropdown-content a:hover {
  background-color: darkcyan;
}

a.link:hover .dropdown-content a {
  height: $dropdown-height;
}
</style>
