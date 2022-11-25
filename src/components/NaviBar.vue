<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <el-affix>
    <nav>
      <RouterLink to="/home">
        <img
          src="../assets/main-logo.png"
          @click="this.$router.push('/home')"
        />
      </RouterLink>

      <div class="fill"></div>

      <span class="links">
        <RouterLink to="/battle">
          <div>答题对战</div>
        </RouterLink>
        <RouterLink to="/favorites">
          <div>收藏夹</div>
        </RouterLink>
        <RouterLink to="/gallery">
          <div>礼品屋</div>
        </RouterLink>
        <RouterLink to="/personal">
          <div>
            {{ username }}
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

<style scoped>
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
}

nav img {
  height: 36px;
  margin: 12px 2em 12px 2em;
  cursor: pointer;
}

nav .fill {
  height: 100%;
  flex-grow: 1;
  background-image: linear-gradient(
    to right,
    transparent,
    rgba(0, 20, 18, 0.8)
  );
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

nav .links a {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-left: 0px solid var(--color-border);
}

nav .links a,
.green {
  text-decoration: none;
  color: white;
  transition: 0.4s;
}

@media (hover: hover) {
  nav .links a:hover {
    background-color: darkcyan;
  }
}

nav .links a.router-link-exact-active {
  border-bottom: white 5px solid !important;
  border-top: transparent 5px solid !important;
}

nav .links a:first-of-type {
  border: 0;
}

@media (max-width: 800px) {
  nav {
    background-image: url(../assets/navi.png);
  }

  .links {
    display: none !important;
  }
}
</style>
